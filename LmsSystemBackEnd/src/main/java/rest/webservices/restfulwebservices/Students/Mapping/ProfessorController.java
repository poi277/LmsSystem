package rest.webservices.restfulwebservices.Students.Mapping;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import rest.webservices.restfulwebservices.Students.dto.LoginRequest;
import rest.webservices.restfulwebservices.Students.dto.professor.ProfessorDetailDTO;
import rest.webservices.restfulwebservices.Students.dto.professor.ProfessorResponseDTO;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.jwt.JwtUtil;
import rest.webservices.restfulwebservices.Students.jwt.LoginResponse;
import rest.webservices.restfulwebservices.Students.service.ProfessorService;

@RestController
public class ProfessorController {
	private ProfessorService professorService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;
	ProfessorController(ProfessorService professorService) {
		this.professorService = professorService;
	}

	@PostMapping("/professor/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		String professorId = request.getUsername();
		Optional<ProfessorInfo> professorOptional = professorService.findProfessorById(professorId);
		if (professorOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("해당 교수 정보가 없습니다.");
		}
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
		}
		ProfessorInfo Professor = professorOptional.get();
		// ✅ 토큰 생성
		String accessToken = jwtUtil.generateTokenProfessorMainHomePage(Professor);
		String refreshToken = jwtUtil.generateRefreshProfessorToken(Professor, "PROFESSOR");

		// ✅ refreshToken을 쿠키로 설정 (HttpOnly, Secure)
		ResponseCookie cookie = ResponseCookie.from("refreshToken_professor", refreshToken).httpOnly(true).secure(true) // false)
				.path("/") // 모든 경로에서 접근 가능
				.maxAge(1 * 24 * 60 * 60) // 1일
				.sameSite("Strict") // CSRF 방지
				.build();
		// ✅ accessToken만 클라이언트로 보냄
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()) // 🔥 쿠키 설정
				.body(new LoginResponse(accessToken)); // 🔥 accessToken은 JSON 응답
	}

	@PostMapping("/refresh/professor")
	public ResponseEntity<?> refreshProfessor(
			@CookieValue(name = "refreshToken_professor", required = false) String refreshToken) {
		return regenerateProfessorToken(refreshToken, "PROFESSOR");
	}

	private ResponseEntity<?> regenerateProfessorToken(String refreshToken, String role) {
		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("발행된 토큰이 없습니다.");
		}

		try {
			String ProfessorId = jwtUtil.extractSubject(refreshToken);
			Optional<ProfessorInfo> ProfessorOptional = professorService.findProfessorById(ProfessorId);
			if (ProfessorOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("교수 정보 없음");
			}

			ProfessorInfo Professor = ProfessorOptional.get();

			String newAccessToken = jwtUtil.generateTokenProfessorMainHomePage(Professor);

			return ResponseEntity.ok(new LoginResponse(newAccessToken));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 refresh token");
		}
	}

	@GetMapping("/professor/{id}")
	public ResponseEntity<ProfessorResponseDTO> ProfessorSubjectFindByid(@PathVariable String id) {
		Optional<ProfessorInfo> professor = professorService.findProfessorById(id);

		return professor.map(p -> new ProfessorResponseDTO(p)) // DTO 변환
				.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/professorDetail/{id}")
	public ResponseEntity<ProfessorDetailDTO> ProfessorDetailFindByid(@PathVariable String id) {
		Optional<ProfessorInfo> professor = professorService.findProfessorById(id);

		return professor.map(p -> new ProfessorDetailDTO(p)) // DTO 변환
				.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@PutMapping(path = "/professor/update")
	public ResponseEntity<?> Professorupdate(@RequestBody ProfessorInfo professor) {
		if (!professorService.professorExists(professor.getProfessorId())) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
		}
		if (professor.getProfessorId() == null || professor.getProfessorName() == null
				|| professor.getProfessorName().trim().isEmpty() || professor.getDepartment() == null
				|| professor.getEmail().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("모든 필드를 정확히 입력하세요.");
		}
		ProfessorInfo savedProfessor = professorService.updateProfessor(professor);
		return ResponseEntity.ok(savedProfessor);
	}

}
