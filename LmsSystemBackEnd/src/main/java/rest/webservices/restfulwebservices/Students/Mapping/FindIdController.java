package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.students.StudentRegisterDTO;
import rest.webservices.restfulwebservices.Students.info.EmailRequest;
import rest.webservices.restfulwebservices.Students.info.VerificationRequest;
import rest.webservices.restfulwebservices.Students.service.FindIdService;
import rest.webservices.restfulwebservices.Students.service.MailService;
import rest.webservices.restfulwebservices.Students.service.ProfessorService;
import rest.webservices.restfulwebservices.Students.service.StudentsService;

@RestController
public class FindIdController {

    @Autowired
    private FindIdService findIdService;
    @Autowired
	private MailService mailService;
	@Autowired
	private StudentsService StudentsService;
	@Autowired
	private ProfessorService professorService;
	@Autowired
	PasswordEncoder passwordEncoder;


    @PostMapping("/find-id/send-code")
    public ResponseEntity<?> sendFindIdCode(@RequestBody EmailRequest request) {
		if (!StudentsService.existsByEmail(request.getEmail()) && !professorService.existsByEmail(request.getEmail())) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 이메일로 등록된 유저가 없습니다.");
		}

        try {
            findIdService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok("인증 코드 발송 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("메일 발송 실패");
        }
    }

    @PostMapping("/find-id/verify-code")
    public ResponseEntity<?> verifyCodeAndReturnId(@RequestBody VerificationRequest request) {
        boolean verified = findIdService.verifyCode(request.getEmail(), request.getCode());
        if (verified) {
			List<String> idlist = new ArrayList<String>();
			String id = StudentsService.findIdByEmail(request.getEmail());
			if (id != null) {
				idlist.add(id);
			}
			id = professorService.findIdByEmail(request.getEmail());
			if (id != null) {
				idlist.add(id);
			}
			return ResponseEntity.ok(idlist);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패 또는 만료된 코드");
        }
    }

	/////////////// 여기서 부턴 회원가입

	@PostMapping("/register-send-verification-code")
	public ResponseEntity<?> RegisterSendVerificationCode(@RequestBody EmailRequest request) {
		String email = request.getEmail();

		if (email == null || email.trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일은 필수입니다.");
		}
		if (StudentsService.existsByEmail(request.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("해당 이메일로 이미 등록된 학생이 있습니다.");
		}
		if (professorService.existsByEmail(request.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("해당 이메일로 이미 등록된 교수가 있습니다.");
		}

		try {
			String code = mailService.generateAndSendCode(email);
			return ResponseEntity.ok("인증 코드가 전송되었습니다.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 이메일 형식");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		}
	}

	@PostMapping("/register-verify-code")
	public ResponseEntity<?> RegisterVerifyCode(@RequestBody VerificationRequest request) {
		boolean isValid = mailService.verifyCode(request.getEmail(), request.getCode());
		if (isValid) {
			return ResponseEntity.ok("인증 성공");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 코드가 유효하지 않습니다.");
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerStudent(@RequestBody StudentRegisterDTO dto) {
		if (!dto.getPassword().equals(dto.getConfirmPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호가 일치하지 않습니다.");
		}

		if (dto.getDepartment().isEmpty() || dto.getEmail().isEmpty() || dto.getPassword().isEmpty()
				|| dto.getPhoneNumber().isEmpty() || dto.getStudentId().isEmpty() || dto.getStudentName().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("정보를 모두 기입해주세요.");
		}
		try {
			findIdService.register(dto, 18);
			return ResponseEntity.ok("회원가입 성공!");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패: " + e.getMessage());
		}
	}
}