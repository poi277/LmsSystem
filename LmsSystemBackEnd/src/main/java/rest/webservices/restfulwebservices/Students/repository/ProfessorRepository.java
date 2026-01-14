package rest.webservices.restfulwebservices.Students.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;

public interface ProfessorRepository extends JpaRepository<ProfessorInfo, String> {

	Optional<ProfessorInfo> findByEmail(String email);

	boolean existsByEmail(String email);

}
