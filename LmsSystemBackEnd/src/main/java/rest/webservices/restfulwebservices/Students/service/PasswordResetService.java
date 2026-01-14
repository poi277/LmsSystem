package rest.webservices.restfulwebservices.Students.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;

@Service
public class PasswordResetService {

	private final StudentsRepository studentsRepository;
	private final ProfessorRepository professorRepository;
	private final MailService mailService;
	private PasswordEncoder passwordEncoder;

	public PasswordResetService(StudentsRepository studentRepository, MailService mailService,
			PasswordEncoder passwordEncoder, ProfessorRepository professorRepository) {
		this.studentsRepository = studentRepository;
		this.mailService = mailService;
		this.passwordEncoder = passwordEncoder;
		this.professorRepository = professorRepository;
	}

	// 인증 코드 발송
	public void sendResetCode(String Id, String email) {
		Optional<StudentsInfo> studentOpt = studentsRepository.findById(Id);
		Optional<ProfessorInfo> professorOpt = professorRepository.findById(Id);
		if (studentOpt.isEmpty() && professorOpt.isEmpty()) {
			throw new RuntimeException("아이디가 존재하지 않습니다.");
		}
		boolean studentEmailMatch = studentOpt.isPresent() && email.equals(studentOpt.get().getEmail());
		boolean professorEmailMatch = professorOpt.isPresent() && email.equals(professorOpt.get().getEmail());

		if (!studentEmailMatch && !professorEmailMatch) {
			throw new RuntimeException("이메일이 일치하지 않습니다.");
		}
		mailService.generateAndSendCode(email);
	}


	// 인증 코드 검증
	public boolean verifyResetCode(String Id, String email, String code) {
		Optional<StudentsInfo> studentOpt = studentsRepository.findById(Id);
		Optional<ProfessorInfo> professorOpt = professorRepository.findById(Id);
		if (studentOpt.isEmpty() && professorOpt.isEmpty()) {
			throw new RuntimeException("아이디가 존재하지 않습니다.");
		}
		boolean studentEmailMatch = studentOpt.isPresent() && studentOpt.get().getEmail().equals(email);
		boolean professorEmailMatch = professorOpt.isPresent() && professorOpt.get().getEmail().equals(email);

		if (!studentEmailMatch && !professorEmailMatch) {
			throw new RuntimeException("이메일이 일치하지 않습니다.");
		}

		return mailService.verifyCode(email, code);
	}

	// 비밀번호 재설정
	public void resetPassword(String userId, String newPassword) {
		Optional<StudentsInfo> studentOpt = studentsRepository.findById(userId);
		Optional<ProfessorInfo> professorOpt = professorRepository.findById(userId);

		if (studentOpt.isPresent()) {
			StudentsInfo student = studentOpt.get();
			student.setPassword(passwordEncoder.encode(newPassword));
			studentsRepository.save(student);
			mailService.removeCode(student.getEmail());
		} else if (professorOpt.isPresent()) {
			ProfessorInfo professor = professorOpt.get();
			professor.setPassword(passwordEncoder.encode(newPassword));
			professorRepository.save(professor);
			mailService.removeCode(professor.getEmail());
		} else {
			throw new RuntimeException("해당 아이디를 가진 사용자가 존재하지 않습니다.");
		}
	}


	public void resetProfessorPassword(String ProfessorId, String newPassword) {
		ProfessorInfo professor = professorRepository.findById(ProfessorId)
				.orElseThrow(() -> new RuntimeException("교수의 아이디가 존재하지 않습니다."));
		professor.setPassword(passwordEncoder.encode(newPassword));
		professorRepository.save(professor);

		mailService.removeCode(professor.getEmail());
	}
}

