package rest.webservices.restfulwebservices.Students.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.dto.students.StudentRegisterDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;

@Service
public class FindIdService {

    private Map<String, VerificationCodeInfo> codeStore = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;
	@Autowired
	private StudentsRepository studentsRepository;

	private final PasswordEncoder passwordEncoder;

	public FindIdService(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

    public void sendVerificationCode(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        codeStore.put(email, new VerificationCodeInfo(code, System.currentTimeMillis()));
        sendCodeEmail(email, code);
    }

    public boolean verifyCode(String email, String code) {
        VerificationCodeInfo info = codeStore.get(email);
        return info != null && info.getCode().equals(code)
               && System.currentTimeMillis() - info.getTimestamp() < 5 * 60 * 1000;
    }

    private void sendCodeEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[아이디 찾기 인증 코드]");
        message.setText("인증 코드: " + code + "\n\n※ 이 코드는 5분간 유효합니다.");
        mailSender.send(message);
    }

    static class VerificationCodeInfo {
        private String code;
        private long timestamp;

        public VerificationCodeInfo(String code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }

        public String getCode() { return code; }
        public long getTimestamp() { return timestamp; }
    }

	public void register(StudentRegisterDTO dto, int maxGradeHour) {
		// 중복 체크 예시
		if (studentsRepository.existsById(dto.getStudentId())) {
			throw new RuntimeException("이미 존재하는 학번입니다.");
		}

		StudentsInfo student = new StudentsInfo(dto.getStudentId(), dto.getPassword(),
				dto.getStudentName(), dto.getDepartment(), maxGradeHour, dto.getPhoneNumber(), dto.getEmail());
		System.out.println("Saving student: " + student.getStudentId());
		String encodedPassword = passwordEncoder.encode(dto.getPassword());
		student.setPassword(encodedPassword);
		studentsRepository.save(student);
	}

}