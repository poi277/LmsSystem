package rest.webservices.restfulwebservices.Students.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.dto.UserInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectUpdateDTO;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo.Semester;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo.SubjectStatus;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;

@Service
public class AdminUserService {
	StudentsRepository studentsRepository;
	ProfessorRepository professorRepository;
	SubjectListRepository subjectListRepository;

	AdminUserService(StudentsRepository studentsRepository, 
			ProfessorRepository professorRepository,
			SubjectListRepository subjectListRepository) {
		this.studentsRepository = studentsRepository;
		this.professorRepository = professorRepository;
		this.subjectListRepository = subjectListRepository;
	}

	public void updateUser(UserInfoDTO dto) {
		switch (dto.getRole().toUpperCase()) {
		case "STUDENT":
			StudentsInfo student = studentsRepository.findById(dto.getId())
					.orElseThrow(() -> new RuntimeException("학생 없음"));
			student.setStudentName(dto.getName());
			student.setDepartment((dto.getDepartment()));
			student.setPhoneNumber((dto.getPhoneNumber()));
			student.setMaxGradeHour(dto.getMaxGradeHour());
			student.setEmail(dto.getEmail());
			studentsRepository.save(student);
			break;
		case "PROFESSOR":
			ProfessorInfo professor = professorRepository.findById(dto.getId())
					.orElseThrow(() -> new RuntimeException("학생 없음"));
			professor.setProfessorName((dto.getName()));
			professor.setDepartment((dto.getDepartment()));
			professor.setPhoneNumber((dto.getPhoneNumber()));
			professor.setEmail(dto.getEmail());
			professor.setPosition(dto.getPosition());
			professor.setOfficeLocation(dto.getPosition());
			;
			professorRepository.save(professor);
			break;
		default:
			throw new RuntimeException("알 수 없는 역할입니다.");
		}
	}

	public void updateSubject(SubjectUpdateDTO dto) {
		SubjectInfo subject = subjectListRepository.findById(dto.getSubjectid())
				.orElseThrow(() -> new RuntimeException("과목 없음"));

		// ✅ 예외 처리: 최대 수강인원이 현재 수강인원보다 작을 수 없음
		if (dto.getMaximumStudentsCount() < dto.getCurrentStudentsCount()) {
			throw new IllegalArgumentException("최대 수강 인원은 현재 수강 인원보다 작을 수 없습니다.");
		}
		Optional<ProfessorInfo> professorInfo = professorRepository.findById(dto.getProfessorId());
		subject.setProfessor(professorInfo.get());
		subject.setDepartmentClass(dto.getDepartmentClass());
		subject.setSubject(dto.getSubject());
		subject.setGradeHour(dto.getGradeHour());
		subject.setClassday(dto.getClassday());
		subject.setStartHour(dto.getStartHour());
		subject.setEndHour(dto.getEndHour());
		subject.setMaximumStudentsCount(dto.getMaximumStudentsCount());
		subject.setCurrentStudentsCount(dto.getCurrentStudentsCount());
		subject.setSubjectYear(dto.getSubjectYear());
		try {
			if (dto.getSemester() != null)
				subject.setSemester(Semester.valueOf(dto.getSemester()));

			if (dto.getSubjectStatus() != null)
				subject.setSubjectStatus(SubjectStatus.valueOf(dto.getSubjectStatus()));
		} catch (IllegalArgumentException e) {
			// 잘못된 enum 문자열 처리
			throw new RuntimeException("유효하지 않은 학기나 상태 값입니다.");
		}

		subjectListRepository.save(subject);
	}

	public void updateSubjectList(List<SubjectResponseDTO> subjectDTOList) {
		for (SubjectResponseDTO dto : subjectDTOList) {
			Optional<SubjectInfo> optionalSubject = subjectListRepository.findById(dto.getSubjectid());
			if (optionalSubject.isPresent()) {
				SubjectInfo subject = optionalSubject.get();
				try {
					subject.setSemester(SubjectInfo.Semester.valueOf(dto.getSemester()));
				} catch (IllegalArgumentException | NullPointerException e) {
					throw new RuntimeException("잘못된 학기 값: " + dto.getSemester(), e);
				}
				try {
					subject.setSubjectStatus(SubjectInfo.SubjectStatus.valueOf(dto.getSubjectStatus()));
					if (SubjectInfo.SubjectStatus
							.valueOf(dto.getSubjectStatus()) == SubjectInfo.SubjectStatus.CANCELLED) {

					}
				} catch (IllegalArgumentException | NullPointerException e) {
					throw new RuntimeException("잘못된 상태 값: " + dto.getSubjectStatus(), e);
				}
				subject.setSubjectYear(dto.getSubjectYear());

				subjectListRepository.save(subject);
			}
		}
	}


}
