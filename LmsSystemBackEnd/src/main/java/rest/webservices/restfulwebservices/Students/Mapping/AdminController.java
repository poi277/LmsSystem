package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.UserInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectUpdateDTO;
import rest.webservices.restfulwebservices.Students.dto.password.PasswordChangeDTO;
import rest.webservices.restfulwebservices.Students.dto.professor.ProfessorRegisterDto;
import rest.webservices.restfulwebservices.Students.dto.professor.ProfessorResponseDTO;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectPostRepository;
import rest.webservices.restfulwebservices.Students.service.AdminUserService;
import rest.webservices.restfulwebservices.Students.service.FileService;
import rest.webservices.restfulwebservices.Students.service.ProfessorService;

@RestController
public class AdminController {
	private final ProfessorRepository professorRepository;
	private final StudentsRepository studentsRepository;
	private final SubjectListRepository subjectListRepository;
	private final AdminUserService adminUserService;
	private final SubjectPostRepository subjectPostRepository;
	private final ProfessorService professorService;
	private final PasswordEncoder passwordEncoder;
	private final FileService fileService;

	public AdminController(ProfessorRepository professorRepository, StudentsRepository studentsRepository,
			AdminUserService adminUserService, SubjectListRepository subjectListRepository,
			SubjectPostRepository subjectPostRepository, ProfessorService professorService,
			PasswordEncoder passwordEncoder, FileService fileService) {
		this.professorRepository = professorRepository;
		this.studentsRepository = studentsRepository;
		this.adminUserService = adminUserService;
		this.subjectListRepository = subjectListRepository;
		this.subjectPostRepository = subjectPostRepository;
		this.professorService = professorService;
		this.passwordEncoder = passwordEncoder;
		this.fileService = fileService;
	}

	@GetMapping("/admin/main")
	public List<UserInfoDTO> adminUserList() {
		List<UserInfoDTO> result = new ArrayList<>();

		// 교수
		professorRepository.findAll().forEach(professor -> {
			UserInfoDTO dto = new UserInfoDTO(professor.getProfessorId(), professor.getProfessorName(),
					professor.getDepartment(), professor.getPosition(), professor.getPhoneNumber(),
					professor.getEmail(), professor.getOfficeLocation(), // 추가된 필드
					0, // 교수는 maxGradeHour가 없으므로 0이나 기본값
					"PROFESSOR");
			result.add(dto);
		});

		// 학생
		studentsRepository.findAll().forEach(student -> {
			UserInfoDTO dto = new UserInfoDTO(student.getStudentId(), student.getStudentName(), student.getDepartment(),
					null, // 학생은 position이 없으므로 null
					student.getPhoneNumber(), student.getEmail(), null, // 학생은 officeLocation이 없으므로 null
					student.getMaxGradeHour(), // 학생만 있는 필드
					"STUDENT");
			result.add(dto);
		});

		return result;
	}

	@GetMapping("/admin/professorList")
	public List<ProfessorResponseDTO> adminProfessorList() {
		List<ProfessorResponseDTO> result = new ArrayList<>();
		professorRepository.findAll().forEach(professor -> {
			ProfessorResponseDTO dto = new ProfessorResponseDTO(professor);
			result.add(dto);
		});
		return result;
	}


	@DeleteMapping("/admin/delete/{id}/{role}")
	public ResponseEntity<?> adminUserDelete(@PathVariable String id, @PathVariable String role) {
		if ("PROFESSOR".equalsIgnoreCase(role)) {
			List<SubjectPost> posts = subjectPostRepository.findByProfessorAuthorProfessorId(id);
			fileService.moveFilesByPostsAndDelete(posts); // ✅ 게시글 기반 파일 삭제
			professorRepository.deleteById(id);

		} else if ("STUDENT".equalsIgnoreCase(role)) {
			List<SubjectPost> posts = subjectPostRepository.findByAuthorStudentId(id);
			fileService.moveFilesByPostsAndDelete(posts); // ✅ 게시글 기반 파일 삭제
			studentsRepository.deleteById(id);

		} else {
			throw new IllegalArgumentException("Invalid role: " + role);
		}

		return ResponseEntity.noContent().build(); // 204 No Content
	}



	@GetMapping("/admin/detail/{id}/{role}")
	public ResponseEntity<UserInfoDTO> adminGetUserDetail(@PathVariable String id, @PathVariable String role) {
		if ("PROFESSOR".equalsIgnoreCase(role)) {
			return professorRepository.findById(id).map(professor -> {
				UserInfoDTO dto = new UserInfoDTO(professor.getProfessorId(), professor.getProfessorName(),
						professor.getDepartment(), professor.getPosition(), professor.getPhoneNumber(),
						professor.getEmail(), professor.getOfficeLocation(), 0, // 교수는 maxGradeHour 없음
						"PROFESSOR");
				return ResponseEntity.ok(dto);
			}).orElse(ResponseEntity.notFound().build());
		} else if ("STUDENT".equalsIgnoreCase(role)) {
			return studentsRepository.findById(id).map(student -> {
				UserInfoDTO dto = new UserInfoDTO(student.getStudentId(), student.getStudentName(),
						student.getDepartment(), null, // 학생은 position 없음
						student.getPhoneNumber(), student.getEmail(), null, // 학생은 officeLocation 없음
						student.getMaxGradeHour(), "STUDENT");
				return ResponseEntity.ok(dto);
			}).orElse(ResponseEntity.notFound().build());
		} else {
			return ResponseEntity.badRequest().build(); // 역할이 잘못된 경우
		}
	}

	@PutMapping("/admin/update")
	public ResponseEntity<?> adminUserUpdate(@RequestBody UserInfoDTO dto) {
		// 예시: 서비스에 전달
		try {
			adminUserService.updateUser(dto); // 각 역할에 따라 분기
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패: " + e.getMessage());
		}
	}

	@GetMapping("/admin/subjectAll")
	public List<SubjectResponseDTO> AllsubjectList() {
		List<SubjectInfo> allSubjects = subjectListRepository.findAll();
		if (allSubjects.isEmpty()) {
			throw new RuntimeException("과목을 찾을 수 없습니다."); // 학생이 아니라 과목임
		}
		return allSubjects.stream().map(subject -> new SubjectResponseDTO(subject)) // 각 subject를 DTO로 변환
				.collect(Collectors.toList());
	}

	@GetMapping("/admin/subject/{id}")
	public ResponseEntity<SubjectResponseDTO> adminSubjectDetail(@PathVariable int id) {
		return subjectListRepository.findById(id).map(subject -> {
			SubjectResponseDTO dto = new SubjectResponseDTO(subject);
			return ResponseEntity.ok(dto);
		}).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/admin/subjectlist/update")
	public ResponseEntity<?> updateSubjects(@RequestBody List<SubjectResponseDTO> dto) {
		adminUserService.updateSubjectList(dto);
		return ResponseEntity.ok("수정 완료");
	}

	@PutMapping("/admin/subject/update")
	public ResponseEntity<?> adminSubjectUpdate(@RequestBody SubjectUpdateDTO dto) {
		if (dto.getProfessorId() == null || dto.getProfessorId().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("교수 선택은 필수입니다.");
		}

		if (dto.getSubject() == null || dto.getSubject().isEmpty() || dto.getDepartmentClass() == null
				|| dto.getDepartmentClass().isEmpty() || dto.getGradeHour() == null || dto.getClassday() == null
				|| dto.getClassday().isBlank() || dto.getStartHour() == null || dto.getEndHour() == null
				|| dto.getMaximumStudentsCount() == null || dto.getSemester() == null || dto.getSubjectStatus() == null
				|| dto.getSubjectYear() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("양식을 다 채워주세요");
		}

		// 예시: 서비스에 전달
		try {
			adminUserService.updateSubject(dto); // 각 역할에 따라 분기
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패: " + e.getMessage());
		}
	}

	@DeleteMapping("/admin/subject/delete/{id}")
	public ResponseEntity<?> adminSubjectDelete(@PathVariable int id) {
		// ✅ 과목 존재 여부 확인
		SubjectInfo subjectInfo = subjectListRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 과목이 존재하지 않습니다."));

		// ✅ 파일 처리
		fileService.moveFilesBySubjectIdAndDelete(Long.valueOf(id));

		// ✅ 과목 삭제
		subjectListRepository.deleteById(id);

		return ResponseEntity.noContent().build(); // 204 응답
	}


	@PostMapping("/admin/professor/register")
	public ResponseEntity<?> registerProfessor(@RequestBody ProfessorRegisterDto dto) {
		try {
			professorService.createProfessor(dto);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("교수 등록 실패: " + e.getMessage());
		}
	}

	@PostMapping("/admin/subject/register")
	public ResponseEntity<?> registerSubject(@RequestBody SubjectResponseDTO dto) {
		if (dto.getProfessorId() == null || dto.getProfessorId().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("교수 ID는 필수입니다.");
		}
		if (dto.getSubject() == null || dto.getSubject().isEmpty() || dto.getDepartmentClass() == null
				|| dto.getDepartmentClass().isEmpty() || dto.getGradeHour() == null || dto.getClassday() == null
				|| dto.getClassday().isBlank() || dto.getStartHour() == null || dto.getEndHour() == null
				|| dto.getMaximumStudentsCount() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("양식을 다 채워주세요");
		}
		if (dto.getStartHour() >= dto.getEndHour()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("시간을 올바르게 입력해주세요.");
		}

		try {
			Optional<ProfessorInfo> professorInfo = professorRepository.findById(dto.getProfessorId());
			if (professorInfo.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 교수 ID는 존재하지 않습니다.");
			}

			SubjectInfo subjectInfo = new SubjectInfo();
			subjectInfo.setSubject(dto.getSubject());
			subjectInfo.setDepartmentClass(dto.getDepartmentClass());
			subjectInfo.setGradeHour(dto.getGradeHour());
			subjectInfo.setClassday(dto.getClassday());
			subjectInfo.setStartHour(dto.getStartHour());
			subjectInfo.setEndHour(dto.getEndHour());
			subjectInfo.setMaximumStudentsCount(dto.getMaximumStudentsCount());
			subjectInfo.setProfessor(professorInfo.get());
			try {
				subjectInfo.setSemester(SubjectInfo.Semester.valueOf(dto.getSemester()));
			} catch (IllegalArgumentException | NullPointerException e) {
				throw new RuntimeException("잘못된 학기 값: " + dto.getSemester(), e);
			}
			try {
				subjectInfo.setSubjectStatus(SubjectInfo.SubjectStatus.valueOf(dto.getSubjectStatus()));
			} catch (IllegalArgumentException | NullPointerException e) {
				throw new RuntimeException("잘못된 상태 값: " + dto.getSubjectStatus(), e);
			}
			subjectInfo.setSubjectYear(dto.getSubjectYear());

			subjectListRepository.save(subjectInfo);

			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("과목 등록 실패: " + e.getMessage());
		}
	}




	@PostMapping("/admin/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody PasswordChangeDTO dto) {
		if (dto.getRole().equals("student")) {
			StudentsInfo student = studentsRepository.findById(dto.getId())
					.orElseThrow(() -> new RuntimeException("학생 없음"));
			student.setPassword(passwordEncoder.encode(dto.getNewPassword()));
			studentsRepository.save(student);
		} else if (dto.getRole().equals("professor")) {
			ProfessorInfo prof = professorRepository.findById(dto.getId())
					.orElseThrow(() -> new RuntimeException("교수 없음"));
			prof.setPassword(passwordEncoder.encode(dto.getNewPassword()));
			professorRepository.save(prof);
		}
		return ResponseEntity.ok("비밀번호 변경 완료");
	}

}
