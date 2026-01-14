package rest.webservices.restfulwebservices.Students.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.students.StudentInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.students.StudentsGradeDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsGrade;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.repository.GradeRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;

@Service
public class GradeService {

	private final GradeRepository gradeRepository;
	private StudentsRepository studentsRepository;

	public GradeService(GradeRepository gradeRepository, StudentsRepository studentsRepository) {
		this.gradeRepository = gradeRepository;
		this.studentsRepository = studentsRepository;
	}

	public Optional<StudentsGrade> findGradeById(int id) {
		return gradeRepository.findById(id);
	}

	public StudentsGrade createGrade(StudentsGrade grade) {
		return gradeRepository.save(grade);
	}


	public boolean deleteGradeById(int id) {
		Optional<StudentsGrade> gradeOpt = gradeRepository.findById(id);
		if (gradeOpt.isEmpty()) {
			return false;
		}
		StudentsGrade grade = gradeOpt.get();
		StudentsInfo student = grade.getStdentsInfo();
		SubjectInfo subject = grade.getSubjectInfo();
		subject.decreMentsCurrentStudentsCount();
		// 🔥 다대다 관계 해제
		student.getSubjects().remove(subject);

		studentsRepository.save(student); // 💾 관계 해제 저장
		gradeRepository.deleteById(id); // ❌ 성적 삭제

		return true;
	}

	public void deleteGradesByStudent(StudentsInfo student) {
		List<StudentsGrade> grades = student.getStudentsGrade();
		gradeRepository.deleteAll(grades);
	}

	public List<StudentsGrade> findGradesByStudentId(StudentsInfo student) {
		return student.getStudentsGrade();
	}

	public List<StudentInfoDTO> getStudentsWithGradesBySubject(SubjectInfo subjectInfo) {
		List<StudentsGrade> gradeList = gradeRepository.findBySubjectInfo_Subjectid(subjectInfo.getSubjectid());
		return gradeList.stream().map(grade -> {
			StudentsInfo student = grade.getStdentsInfo();
			StudentInfoDTO dto = new StudentInfoDTO(student);

			// 특정 과목에 해당하는 성적만 StudentsGradeDTO로 만들어 넣기
			StudentsGradeDTO targetGradeDto = new StudentsGradeDTO(grade); // 한 과목에 대한 성적 DTO
			dto.setGrades(List.of(targetGradeDto)); // 리스트로 만들어서 교체

			return dto;
		}).collect(Collectors.toList());
	}

	public void updateGrade(SubjectInfoDTO subjectInfoDTO) {
		List<StudentsGrade> gradeList = gradeRepository.findBySubjectInfo_Subjectid(subjectInfoDTO.getSubjectid());

		for (StudentsGrade grade : gradeList) {
			String studentId = grade.getStdentsInfo().getStudentId();

			Optional<StudentInfoDTO> matchingDTO = subjectInfoDTO.getStudentsGrade().stream()
					.filter(dto -> dto.getStudentId().equals(studentId)).findFirst();

			if (matchingDTO.isPresent()) {
				StudentsGradeDTO newGrade = matchingDTO.get().getGrades().get(0); // grades에 1개만 있다고 가정
				grade.setGrade(newGrade.getGrade());
				grade.setGradeRank(newGrade.getGradeRank());
				gradeRepository.save(grade);
			}
		}
	}


}

