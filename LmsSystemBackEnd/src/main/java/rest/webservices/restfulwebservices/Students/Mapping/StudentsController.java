package rest.webservices.restfulwebservices.Students.Mapping;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import rest.webservices.restfulwebservices.Students.dto.LoginRequest;
import rest.webservices.restfulwebservices.Students.dto.students.StudentDetailInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.students.StudentInfoDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.jwt.JwtUtil;
import rest.webservices.restfulwebservices.Students.jwt.LoginResponse;
import rest.webservices.restfulwebservices.Students.service.GradeService;
import rest.webservices.restfulwebservices.Students.service.StudentsService;

@RestController
public class StudentsController {
	StudentsService studentsService;
	GradeService gradeService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;

	StudentsController(StudentsService studentsService,GradeService gradeService) {
		this.studentsService = studentsService;
		this.gradeService = gradeService;
	}

	@GetMapping("/admin-basicauthazation")
	public ResponseEntity<Map<String, Object>> basicAuthTest(Principal principal) {
		Map<String, Object> response = new HashMap<>();
		response.put("id", principal.getName()); // principal.getName() == 로그인한 관리자 ID
		response.put("name", "관리자"); // 혹시 DB에서 이름 조회 가능하면 바꿔도 됩니다
		return ResponseEntity.ok(response);
	}

	@GetMapping(path = "/")
	public String returnSomethingAtRootUrl() {
		return "good";
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		String studentId = request.getUsername();
		Optional<StudentsInfo> studentOptional = studentsService.findStudentById(studentId);
		if (studentOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("해당 학번의 학생 정보가 없습니다.");
		}
	    try {
	        authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
	        );
	    } catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
	    }

	    StudentsInfo student = studentOptional.get();
	    // ✅ 토큰 생성
	    String accessToken = jwtUtil.generateTokenStudentsMainHomePage(student);
		String refreshToken = jwtUtil.generateRefreshToken(student, "STUDENT");

	    // ✅ refreshToken을 쿠키로 설정 (HttpOnly, Secure)
	    ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
	        .httpOnly(true)
	        .secure(true) // 배포 시 true (로컬 개발 중이면 false)
	        .path("/") // 모든 경로에서 접근 가능
				.maxAge(24 * 60 * 60) // 1일
	        .sameSite("Strict") // CSRF 방지
	        .build();
	    // ✅ accessToken만 클라이언트로 보냄
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()) // 🔥 쿠키 설정
				.body(new LoginResponse(accessToken)); // 🔥 accessToken은 JSON 응답
	}



	@PostMapping("/refresh/students")
	public ResponseEntity<?> refreshStudent(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
		return regenerateToken(refreshToken, "STUDENT");
	}

	@PostMapping("/refresh/subject")
	public ResponseEntity<?> refreshSubject(
			@CookieValue(name = "refreshSubjectToken", required = false) String refreshToken) {
		return regenerateToken(refreshToken, "SUBJECT_REGISTER");
	}

	private ResponseEntity<?> regenerateToken(String refreshToken, String role) {
		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is missing");
		}

		try {
			String studentIdStr = jwtUtil.extractSubject(refreshToken);
			String studentId = studentIdStr;

			Optional<StudentsInfo> studentOptional = studentsService.findStudentById(studentId);
			if (studentOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("학생 정보 없음");
			}

			StudentsInfo student = studentOptional.get();

			String newAccessToken = "STUDENT".equals(role) ? jwtUtil.generateTokenStudentsMainHomePage(student)
					: jwtUtil.generateTokenSubjectRegister(student);

			return ResponseEntity.ok(new LoginResponse(newAccessToken));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 refresh token");
		}
	}



	@GetMapping("/Students-hello")
	public String StudentHello() {
		return "studentshellov2";
	}



	@GetMapping(path = "/Students")
	public List<StudentsInfo> studentsAllInfo() {
		return studentsService.findAllStudents();
	}

	@GetMapping("/Students/{id}")
	public ResponseEntity<StudentInfoDTO> studentsFindByid(@PathVariable String id) {
		Optional<StudentsInfo> student = studentsService.findStudentById(id);
		return student.map(s -> ResponseEntity.ok(new StudentInfoDTO(s)))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/StudentsDetail/{id}")
	public ResponseEntity<StudentDetailInfoDTO> studentsFindByidDetails(@PathVariable String id) {
		Optional<StudentsInfo> student = studentsService.findStudentById(id);
		return student.map(s -> ResponseEntity.ok(new StudentDetailInfoDTO(s)))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@PutMapping(path = "/Students/update")
	public ResponseEntity<?> studentsupdate(@RequestBody StudentsInfo student) {
		if (!studentsService.studentExists(student.getStudentId())) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
		}
		if (student.getStudentId() == null || student.getStudentName() == null
				|| student.getStudentName().trim().isEmpty() || student.getDepartment() == null
				|| student.getEmail().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("모든 필드를 정확히 입력하세요.");
		}
		StudentsInfo savedStudent = studentsService.updateStudent(student);
		return ResponseEntity.ok(savedStudent);
	}

	@DeleteMapping("/Students/delete/{id}")
	public ResponseEntity<?> studentsDelete(@PathVariable String id) {
		if (!studentsService.studentExists(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 ID를 찾을 수 없습니다: " + id);
		}

		boolean deleted = studentsService.deleteStudentWithGrades(id, gradeService);

		if (deleted) {
			return ResponseEntity.noContent().build(); // 삭제 성공
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
		}
	}

	@PostMapping("/Students/create")
	public ResponseEntity<?> studentsCreate(@RequestBody StudentsInfo student) {
		if (student.getStudentId() == null || student.getStudentName() == null
				|| student.getStudentName().trim().isEmpty() || student.getDepartment() == null
				|| student.getDepartment().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("모든 필드를 정확히 입력하세요.");
		}
		if (studentsService.studentIdExists(student.getStudentId())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 학번입니다.");
		}
		StudentsInfo savedStudent = studentsService.createStudent(student);
		return ResponseEntity.ok(savedStudent);
	}

	@GetMapping(path = "/test")
	public List<StudentsInfo> test()
	{
		return studentsService.findAllStudents();
	}



}
