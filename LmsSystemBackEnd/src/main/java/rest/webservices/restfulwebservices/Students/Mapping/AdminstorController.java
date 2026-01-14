package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import rest.webservices.restfulwebservices.Students.dto.LoginRequest;
import rest.webservices.restfulwebservices.Students.info.Admin;
import rest.webservices.restfulwebservices.Students.jwt.JwtUtil;
import rest.webservices.restfulwebservices.Students.jwt.LoginResponse;
import rest.webservices.restfulwebservices.Students.repository.AdminRepository;
import rest.webservices.restfulwebservices.Students.service.AdminDetailsService;

@RestController
public class AdminstorController {

	private final AuthenticationManager authenticationManager;
	private final AdminDetailsService adminDetailsService;
	private final JwtUtil jwtUtil;
	private final AdminRepository adminRepository;
	public AdminstorController(AuthenticationManager authenticationManager, AdminDetailsService adminDetailsService,
			JwtUtil jwtUtil, AdminRepository adminRepository) {
		this.authenticationManager = authenticationManager;
		this.adminDetailsService = adminDetailsService;
		this.jwtUtil = jwtUtil;
		this.adminRepository = adminRepository;
	}

	@PostMapping("/refresh/admin")
	public ResponseEntity<?> refreshStudent(
			@CookieValue(name = "refreshToken_admin", required = false) String refreshToken) {
		return regenerateToken(refreshToken, "ADMIN");
	}

	private ResponseEntity<?> regenerateToken(String refreshToken, String role) {
		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("발행된 관리자 토큰이 없습니다729.");
		}

		try {
			String AdminStr = jwtUtil.extractSubject(refreshToken);
			String AdminId = AdminStr;
			Optional<Admin> AdminOptional = adminRepository.findById(AdminId);
			if (AdminOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("어드민 정보 없음");
			}

			Admin admin = AdminOptional.get();

			String newAccessToken = jwtUtil.generateTokenForAdmin(admin);
			return ResponseEntity.ok(new LoginResponse(newAccessToken));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 발행된 토큰입니다.");
		}
	}

	@PostMapping("/admin/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		String AdminId = request.getUsername();
		Optional<Admin> adminOptional = adminRepository.findById(AdminId);
		if (adminOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("관리자 정보가 없습니다.");
		}
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
		}

		Admin admin = adminOptional.get();
		// ✅ 토큰 생성
		String accessToken = jwtUtil.generateTokenForAdmin(admin);
		String refreshToken = jwtUtil.generateRefreshAdminToken(admin, "ADMIN");

		// ✅ refreshToken_admin을 쿠키로 설정 (HttpOnly, Secure)
		ResponseCookie cookie = ResponseCookie.from("refreshToken_admin", refreshToken).httpOnly(true).secure(true)
				.path("/") // 모든 경로에서 접근 가능
				.maxAge(1 * 24 * 60 * 60) // 1일
				// .sameSite("Strict") // 가장 엄격한 옵션입니다. 쿠키가 오직 도메인이 '같은 사이트'에서만 전송됩니다.
				.sameSite("None")
				.build();
		// ✅ accessToken만 클라이언트로 보냄
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()) // 🔥 쿠키 설정
				.body(new LoginResponse(accessToken)); // 🔥 accessToken은 JSON 응답
	}

}
