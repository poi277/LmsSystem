package rest.webservices.restfulwebservices.Students.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.StudentsInfo;

public interface StudentsRepository extends JpaRepository<StudentsInfo, String> {
	boolean existsByStudentId(String studentId);

	Optional<StudentsInfo> findByEmail(String email);

	boolean existsByEmail(String email);
}
