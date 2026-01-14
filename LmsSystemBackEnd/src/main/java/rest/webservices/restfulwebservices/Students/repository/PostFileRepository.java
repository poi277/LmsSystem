package rest.webservices.restfulwebservices.Students.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.PostFile;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;

public interface PostFileRepository extends JpaRepository<PostFile, Long> {
	List<PostFile> findByPost(SubjectPost post);
}
