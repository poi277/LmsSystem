package rest.webservices.restfulwebservices.Students.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.PendingStudentSignup;

public interface PendingSignupRepository extends JpaRepository<PendingStudentSignup, String> {

}
