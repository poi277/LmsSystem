package rest.webservices.restfulwebservices.Students.dto.post;

import java.time.LocalDateTime;

public class PostCommentResponseDTO {
	private Long id;
	private String content;
	private String authorName;
	private LocalDateTime createdDate;
	// 작성자 종류에 따라 필요한 필드들
	private String authorType;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public String getAuthorType() {
		return authorType;
	}

	public void setAuthorType(String authorType) {
		this.authorType = authorType;
	}

}
