package rest.webservices.restfulwebservices.Students.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.Admin;

public interface AdminRepository extends JpaRepository<Admin, String> {

}
