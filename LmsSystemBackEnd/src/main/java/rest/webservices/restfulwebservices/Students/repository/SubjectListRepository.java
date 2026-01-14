package rest.webservices.restfulwebservices.Students.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.SubjectInfo;

public interface SubjectListRepository extends JpaRepository<SubjectInfo, Integer> {

}
