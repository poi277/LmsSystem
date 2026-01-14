package rest.webservices.restfulwebservices.Students.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.repository.PendingSignupRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;

@Service
public class StudentsService {

	private final StudentsRepository studentsRepository;
	private final PendingSignupRepository pendingSignupRepository;
	private MailService mailService;
	@Autowired
	private PasswordEncoder passwordEncoder;

	public StudentsService(StudentsRepository studentsRepository, PendingSignupRepository pendingSignupRepository,
			MailService mailService) {
		this.studentsRepository = studentsRepository;
		this.pendingSignupRepository = pendingSignupRepository;
		this.mailService = mailService;
	}

	public List<StudentsInfo> findAllStudents() {
		return studentsRepository.findAll();
	}

	public Optional<StudentsInfo> findStudentById(String id) {
		return studentsRepository.findById(id);
	}


	public StudentsInfo createStudent(StudentsInfo student) {
		// 회원가입 시 평문 비밀번호를 암호화
		student.setPassword(passwordEncoder.encode(student.getPassword()));
		return studentsRepository.save(student);
	}

	public boolean studentExists(String id) {
		return studentsRepository.existsById(id);
	}

	public StudentsInfo updateStudent(StudentsInfo student) {
		return studentsRepository.save(student);
	}

	public boolean deleteStudentWithGrades(String id, GradeService gradeService) {
		Optional<StudentsInfo> studentOpt = studentsRepository.findById(id);
		if (studentOpt.isEmpty())
			return false;
		gradeService.deleteGradesByStudent(studentOpt.get());
		studentsRepository.deleteById(id);
		return true;
	}

	public boolean studentIdExists(String id) {
		return studentsRepository.existsById(id);
	}

	public StudentsInfo saveStudent(StudentsInfo student) {
		// TODO Auto-generated method stub
		return studentsRepository.save(student);
	}

//	public void prepareSignup(StudentSignupDTO dto) {
//		if (studentsRepository.existsByStudentId(dto.getStudentId())) {
//			throw new IllegalArgumentException("이미 존재하는 학번입니다.");
//		}
//
//		String token = UUID.randomUUID().toString();
//		LocalDateTime expireAt = LocalDateTime.now().plusHours(1);
//
//		PendingStudentSignup pending = new PendingStudentSignup();
//		pending.setToken(token);
//		pending.setStudentId(dto.getStudentId());
//		pending.setStudentName(dto.getStudentName());
//		pending.setDepartment(dto.getDepartment());
//		pending.setPassword(passwordEncoder.encode(dto.getPassword()));
//		pending.setPhoneNumber(dto.getPhoneNumber());
//		pending.setEmail(dto.getEmail());
//		pending.setMaxGradeHour(dto.getMaxGradeHour());
//		pending.setExpireAt(expireAt);
//
//		pendingSignupRepository.save(pending);
//
//		mailService.sendVerificationMail(dto.getEmail(), token); // 메일 전송
//	}
//
//	public void verifyEmail(String token) {
//		System.out.println("검증 토큰: " + token);
//		Optional<PendingStudentSignup> pendingOpt = pendingSignupRepository.findById(token);
//		if (pendingOpt.isEmpty()) {
//			System.out.println("토큰 없음");
//			throw new IllegalArgumentException("유효하지 않은 토큰");
//		}
//		PendingStudentSignup pending = pendingOpt.get();
//		System.out.println("토큰 만료 시간: " + pending.getExpireAt());
//		if (pending.getExpireAt().isBefore(LocalDateTime.now())) {
//			System.out.println("토큰 만료됨");
//			throw new IllegalArgumentException("토큰이 만료되었습니다.");
//		}
//
//		// --- 여기가 핵심: 회원 정보 생성 및 저장 ---
//		StdentsInfo student = new StdentsInfo(pending.getStudentId(), pending.getPassword(), pending.getStudentName(),
//				pending.getDepartment(), pending.getMaxGradeHour(), pending.getPhoneNumber(), pending.getEmail());
//
//		studentsRepository.save(student); // 실제 회원 저장
//		pendingSignupRepository.deleteById(token); // 임시 가입 요청 삭제
//	}

	public String findIdByEmail(String email) {
		Optional<StudentsInfo> studentOpt = studentsRepository.findByEmail(email);
		return studentOpt.map(StudentsInfo::getStudentId).orElse(null);
	}

	public boolean existsByEmail(String email) {
		return studentsRepository.existsByEmail(email);
	}

}
