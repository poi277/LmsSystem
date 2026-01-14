package rest.webservices.restfulwebservices.Students.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsGrade;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;

public interface GradeRepository extends JpaRepository<StudentsGrade, Integer> {
	Optional<StudentsGrade> findByStdentsInfoAndSubjectInfo(StudentsInfo stdentsInfo, SubjectInfo subjectInfo);

	List<StudentsGrade> findBySubjectInfo_Subjectid(Integer subjectId);
}
