package rest.webservices.restfulwebservices.Students.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import rest.webservices.restfulwebservices.Students.info.PostCommentInfo;

public interface PostCommentRepository extends JpaRepository<PostCommentInfo, Long> {
	List<PostCommentInfo> findByPost_PostId(Long postId); // 게시글 ID로 댓글 조회
}
