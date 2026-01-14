package rest.webservices.restfulwebservices.Students.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.SubjectPost;

public interface SubjectPostRepository extends JpaRepository<SubjectPost, Long> {
	List<SubjectPost> findBySubjectSubjectid(Long subjectId); // 과목별 게시물

	List<SubjectPost> findByAuthorStudentId(String studentId);

	List<SubjectPost> findByProfessorAuthorProfessorId(String professorId);

}
