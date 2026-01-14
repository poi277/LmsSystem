package rest.webservices.restfulwebservices.Students.Mapping;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.password.PasswordChangeDTO;
import rest.webservices.restfulwebservices.Students.dto.password.PasswordResetRequestDTO;
import rest.webservices.restfulwebservices.Students.dto.password.PasswordVerifyDTO;
import rest.webservices.restfulwebservices.Students.service.PasswordResetService;

@RestController
public class PasswordResetController {

	private final PasswordResetService passwordResetService;

	public PasswordResetController(PasswordResetService passwordResetService) {
		this.passwordResetService = passwordResetService;
	}

	@PostMapping("/password-code")
	public ResponseEntity<?> sendResetCode(@RequestBody PasswordResetRequestDTO dto) {
		try {
			passwordResetService.sendResetCode(dto.getId(), dto.getEmail());
			return ResponseEntity.ok("인증 코드 전송 완료");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/password-verify")
	public ResponseEntity<?> verifyCode(@RequestBody PasswordVerifyDTO dto) {
		try {
			boolean result = passwordResetService.verifyResetCode(dto.getId(), dto.getEmail(), dto.getCode());
			if (result)
				return ResponseEntity.ok("인증 성공");
			else
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("코드가 올바르지 않거나 유효하지 않습니다.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}


	@PostMapping("/password-change")
	public ResponseEntity<?> resetPassword(@RequestBody PasswordChangeDTO dto) {
		if (dto.getNewPassword() == null || dto.getNewPassword().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호를 입력하지 않았습니다.");
		}
		if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호가 같지 않습니다.");
		}

		try {
			passwordResetService.resetPassword(dto.getId(), dto.getNewPassword());
			return ResponseEntity.ok("비밀번호 변경 완료");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/password-change-professor")
	public ResponseEntity<?> ProfessorResetPassword(@RequestBody PasswordChangeDTO dto) {
		if (dto.getNewPassword() == null || dto.getNewPassword().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호를 입력하지 않았습니다.");
		}
		if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호가 같지 않습니다.");
		}

		try {
			passwordResetService.resetProfessorPassword(dto.getId(), dto.getNewPassword());
			return ResponseEntity.ok("비밀번호 변경 완료");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
}
