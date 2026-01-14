package rest.webservices.restfulwebservices.Students.dto.Subject;

import java.time.LocalDateTime;

import rest.webservices.restfulwebservices.Students.info.SubjectPost;
public class SubjectPostDTO {

	private Long postId;
	private String title;
	private String category;
	private String content;
	private LocalDateTime createdDate;
	private String authorName;
	private String authorId;
	private String role; // 🔹 추가

	public SubjectPostDTO(SubjectPost post) {
		this.postId = post.getPostId();
		this.title = post.getTitle();
		this.category = post.getCategory();
		this.content = post.getContent();
		this.createdDate = post.getCreatedDate();

		if (post.getAuthor() != null) {
			this.authorId = String.valueOf(post.getAuthor().getId());
			this.authorName = post.getAuthor().getName();
			this.role = "STUDENT";
		} else if (post.getProfessorAuthor() != null) {
			this.authorId = String.valueOf(post.getProfessorAuthor().getProfessorId());
			this.authorName = post.getProfessorAuthor().getProfessorName();
			this.role = "PROFESSOR";
		} else if (post.getAdministratorid() != null) {
			this.authorId = String.valueOf(post.getAdministratorid());
			this.authorName = post.getAdministratorid();
			this.role = "ADMINISTRATOR";
		} else {
			this.authorName = "알 수 없음";
			this.role = "UNKNOWN";
		}
	}

	public Long getPostId() {
		return postId;
	}

	public void setPostId(Long postId) {
		this.postId = postId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	// Getter / Setter 생략
}


