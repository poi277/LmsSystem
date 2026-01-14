package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.post.PostCommentDTO;
import rest.webservices.restfulwebservices.Students.service.PostCommentService;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
	private PostCommentService commentService;

	@PostMapping("/{postId}")
	public ResponseEntity<?> createComment(@PathVariable Long postId, @RequestBody PostCommentDTO dto) {
		try {
			dto.setPostId(postId);
			commentService.addComment(dto);
			return ResponseEntity.ok("댓글 등록 성공");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/{postId}")
	public ResponseEntity<List<PostCommentDTO>> getComments(@PathVariable Long postId) {
		List<PostCommentDTO> dtos = commentService.getCommentsForPost(postId);
		return ResponseEntity.ok(dtos);
	}

	@PutMapping("/{commentId}")
	public ResponseEntity<?> updateComments(@PathVariable Long commentId, @RequestBody PostCommentDTO dto) {
		try {
			List<PostCommentDTO> dtos = commentService.updateComment(dto);
			return ResponseEntity.ok(dtos);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@DeleteMapping("/{commentId}")
	public ResponseEntity<?> deleteComments(@PathVariable Long commentId) {
		try {
			commentService.deleteComment(commentId);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}


}

