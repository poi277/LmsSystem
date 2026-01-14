package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import rest.webservices.restfulwebservices.Students.dto.LoginRequest;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsGrade;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo.SubjectStatus;
import rest.webservices.restfulwebservices.Students.jwt.JwtUtil;
import rest.webservices.restfulwebservices.Students.jwt.LoginResponse;
import rest.webservices.restfulwebservices.Students.repository.GradeRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;
import rest.webservices.restfulwebservices.Students.service.StudentsService;

@RestController
public class SubjectRegisterController {

	SubjectListRepository subjectListRepository;
	StudentsService studentsService;
	GradeRepository gradeRepository;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;

	SubjectRegisterController(SubjectListRepository subjectListRepository, StudentsService studentsService,
			GradeRepository gradeRepository) {
		this.subjectListRepository = subjectListRepository;
		this.studentsService = studentsService;
		this.gradeRepository = gradeRepository;
	}

	@PostMapping("/subjectRegister/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		String studentId = request.getUsername();
		Optional<StudentsInfo> studentOptional = studentsService.findStudentById(studentId);
		if (studentOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("해당 학번의 학생 정보가 없습니다.");
		}
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디나 비밀번호가 틀렸습니다.");
		}


		StudentsInfo student = studentOptional.get();

		// ✅ access + refresh 토큰 생성
		String accessToken = jwtUtil.generateTokenSubjectRegister(student);
		String refreshToken = jwtUtil.generateRefreshToken(student, "SUBJECT_REGISTER");

		// ✅ refreshToken을 HttpOnly 쿠키로 설정
		ResponseCookie cookie = ResponseCookie.from("refreshSubjectToken", refreshToken).httpOnly(true).secure(true)
				.path("/") // 모든 경로에서 전송
				.maxAge(7 * 24 * 60 * 60) // 7일 유지
				.sameSite("Strict") // CSRF 방지
				.build();
		// ✅ 응답 헤더에 쿠키 설정, JSON으로 accessToken 반환
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
				.body(new LoginResponse(accessToken));
	}

	@GetMapping("/subjectRegister/{studentId}")
	public List<SubjectResponseDTO> subjectListWithStatus(@PathVariable String studentId) {
		Optional<StudentsInfo> optionalStudent = studentsService.findStudentById(studentId);
		if (optionalStudent.isEmpty()) {
			throw new RuntimeException("학생을 찾을 수 없습니다.");
		}
		StudentsInfo student = optionalStudent.get();

		List<SubjectInfo> allSubjects = subjectListRepository.findAll();

		// 개설 상태(OPEN)인 과목만 필터링
		List<SubjectInfo> openSubjects = allSubjects.stream()
				.filter(subject -> subject.getSubjectStatus() == SubjectStatus.OPEN).collect(Collectors.toList());

		// 학생이 등록한 과목 중, 상태가 OPEN인 것만 유지
		Set<SubjectInfo> validRegisteredSubjects = student.getSubjects().stream()
				.filter(subject -> subject.getSubjectStatus() == SubjectStatus.OPEN).collect(Collectors.toSet());

		return openSubjects.stream()
				.map(subject -> new SubjectResponseDTO(subject, validRegisteredSubjects.contains(subject)))
				.collect(Collectors.toList());
	}





	@PostMapping("/subjectRegister/{studentId}/{subjectId}")
	public ResponseEntity<String> subjectRegister(@PathVariable String studentId, @PathVariable int subjectId) {
		Optional<StudentsInfo> optionalStudent = studentsService.findStudentById(studentId);
		if (optionalStudent.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("학생을 찾을 수 없습니다: id = " + studentId);
		}

		Optional<SubjectInfo> optionalSubject = subjectListRepository.findById(subjectId);
		if (optionalSubject.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("과목을 찾을 수 없습니다: id = " + subjectId);
		}

		StudentsInfo student = optionalStudent.get();
		SubjectInfo subject = optionalSubject.get();

		if (subject.isFullStudents()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("인원이 한도 초과 되었습니다.");
		}

		// ✅ 중복 수강 방지 (같은 과목명 중복)
		boolean alreadyRegisteredSameName = student.getSubjects().stream()
				.anyMatch(sub -> sub.getSubject().equals(subject.getSubject()));

		if (alreadyRegisteredSameName) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 같은 과목을 수강 중입니다: " + subject.getSubject());
		}

		// ✅ 과목 자체 중복
		if (student.getSubjects().contains(subject)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 신청한 과목입니다.");
		}

		// OPEN 상태의 수강 중 과목만 필터링
		Set<SubjectInfo> openSubjects = student.getSubjects().stream()
				.filter(s -> s.getSubjectStatus() == SubjectStatus.OPEN).collect(Collectors.toSet());

		// 시간표 겹침 확인: 폐강,종강된 과목은 비교 대상에서 제외
		if (!SubjectInfo.canRegister(subject, new ArrayList<>(openSubjects))) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("시간표가 다른 과목과 겹칩니다.");
		}

		subject.increMentsCurrentStudentsCount();
		student.getSubjects().add(subject);
		studentsService.saveStudent(student);

		StudentsGrade grade = new StudentsGrade(subject.getSubject(), 0, "미입력", subject.getGradeHour());
		grade.setSubjectInfo(subject);
		grade.setStdentsInfo(student);
		gradeRepository.save(grade);
		student.getStudentsGrade().add(grade);

		return ResponseEntity.ok("수강신청이 완료되었습니다.");
	}

	@DeleteMapping("/subjectRegister/{studentId}/{subjectId}")
	public ResponseEntity<String> subjectDelete(@PathVariable String studentId, @PathVariable int subjectId) {
		Optional<StudentsInfo> optionalStudent = studentsService.findStudentById(studentId);
		if (optionalStudent.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("학생을 찾을 수 없습니다: id = " + studentId);
		}

		Optional<SubjectInfo> optionalSubject = subjectListRepository.findById(subjectId);
		if (optionalSubject.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("과목을 찾을 수 없습니다: id = " + subjectId);
		}

		StudentsInfo student = optionalStudent.get();
		SubjectInfo subject = optionalSubject.get();

		// 과목 수강 취소
		boolean removed = student.getSubjects().remove(subject);
		if (!removed) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이 학생은 해당 과목을 신청하지 않았습니다.");
		}
		subject.decreMentsCurrentStudentsCount();
		// 성적 삭제 (과목 ID 기반으로 삭제)
		Optional<StudentsGrade> gradeOptional = gradeRepository.findByStdentsInfoAndSubjectInfo(student, subject);

		gradeOptional.ifPresent(gradeRepository::delete);

		studentsService.saveStudent(student);
		return ResponseEntity.ok("수강신청이 취소되었습니다.");
	}


}
