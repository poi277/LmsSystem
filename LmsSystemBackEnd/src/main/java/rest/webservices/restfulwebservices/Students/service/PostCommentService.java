package rest.webservices.restfulwebservices.Students.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.dto.post.PostCommentDTO;
import rest.webservices.restfulwebservices.Students.info.PostCommentInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;
import rest.webservices.restfulwebservices.Students.repository.AdminRepository;
import rest.webservices.restfulwebservices.Students.repository.PostCommentRepository;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectPostRepository;

@Service
public class PostCommentService {

	@Autowired
	private PostCommentRepository commentRepository;

	@Autowired
	private SubjectPostRepository postRepository;

	@Autowired
	private StudentsRepository studentsRepository;

	@Autowired
	private ProfessorRepository professorRepository;

	@Autowired
	private AdminRepository adminRepository;

	public void addComment(PostCommentDTO dto) {
		SubjectPost post = postRepository.findById(dto.getPostId())
				.orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

		PostCommentInfo comment = new PostCommentInfo();
		comment.setContent(dto.getContent());
		comment.setCreatedDate(LocalDateTime.now());
		comment.setPost(post);

		if ("STUDENT".equals(dto.getAuthorType())) {
			comment.setStudent(studentsRepository.findById(dto.getAuthorId())
					.orElseThrow(() -> new RuntimeException("학생이 존재하지 않습니다.")));
		} else if ("PROFESSOR".equals(dto.getAuthorType())) {
			comment.setProfessor(professorRepository.findById(dto.getAuthorId())
					.orElseThrow(() -> new RuntimeException("교수가 존재하지 않습니다.")));
		} else if ("ADMIN".equals(dto.getAuthorType())) {
			comment.setAdministratorId(dto.getAuthorId()); // 직접 ID만 저장
		}

		commentRepository.save(comment);
	}

	public List<PostCommentDTO> getCommentsForPost(Long postId) {
		List<PostCommentInfo> comments = commentRepository.findByPost_PostId(postId);

		return comments.stream().map(comment -> {
			PostCommentDTO dto = new PostCommentDTO();
			dto.setId(comment.getId());
			dto.setContent(comment.getContent());
			dto.setCreatedDate(comment.getCreatedDate());

			if (comment.getStudent() != null) {
				dto.setAuthorName(comment.getStudent().getName());
				dto.setAuthorId(comment.getStudent().getId());
				dto.setAuthorType("STUDENT");
			} else if (comment.getProfessor() != null) {
				dto.setAuthorName(comment.getProfessor().getName());
				dto.setAuthorId(comment.getProfessor().getId());
				dto.setAuthorType("PROFESSOR");
			} else if (comment.getAdministratorId() != null) {
				dto.setAuthorId(comment.getAdministratorId()); // 관리자 ID
				dto.setAuthorName(comment.getAdministratorId()); // 관리자 ID
				dto.setAuthorType("ADMIN");
			} else {
				dto.setAuthorName("알 수 없음");
				dto.setAuthorType("UNKNOWN");
			}

			return dto;
		}).collect(Collectors.toList());
	}

	public void deleteComment(Long commentId) {
		PostCommentInfo comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

		commentRepository.delete(comment);
	}




	public List<PostCommentDTO> updateComment(PostCommentDTO dto) {
		PostCommentInfo comment = commentRepository.findById(dto.getId())
				.orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

		// 권한 체크: 작성자만 수정할 수 있도록
		if ("STUDENT".equals(dto.getAuthorType()) && comment.getStudent() != null
				&& !comment.getStudent().getId().equals(dto.getAuthorId())) {
			throw new RuntimeException("댓글 작성자만 수정할 수 있습니다.");
		} else if ("PROFESSOR".equals(dto.getAuthorType()) && comment.getProfessor() != null
				&& !comment.getProfessor().getId().equals(dto.getAuthorId())) {
			throw new RuntimeException("댓글 작성자만 수정할 수 있습니다.");
		} else if ("ADMIN".equals(dto.getAuthorType()) && comment.getAdministratorId() != null
				&& !comment.getAdministratorId().equals(dto.getAuthorId())) {
			throw new RuntimeException("댓글 작성자만 수정할 수 있습니다.");
		}

		comment.setContent(dto.getContent());
		commentRepository.save(comment);

		return getCommentsForPost(comment.getPost().getPostId());
	}

}

