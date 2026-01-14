package rest.webservices.restfulwebservices.Students.dto.Subject;

import java.time.LocalDateTime;

public class SubjectPostSaveDTO {

	private Long postId;
	private String title;
	private String category;
	private String content;
	private LocalDateTime createdDate;
	private String authorId;
	private int subjectId;
	private String role;
	private String studentId;
	private String professorId;
	private String administratorId;
	public SubjectPostSaveDTO() {

	}

	public SubjectPostSaveDTO(Long postId, String title, String category, String content, LocalDateTime createdDate,
			String authorId, int subjectId, String role, String studentId, String professorId, String administratorId) {
		super();
		this.postId = postId;
		this.title = title;
		this.category = category;
		this.content = content;
		this.createdDate = createdDate;
		this.authorId = authorId;
		this.subjectId = subjectId;
		this.role = role;
		this.studentId = studentId;
		this.professorId = professorId;
		this.administratorId = administratorId;
	}


	public String getAdministratorId() {
		return administratorId;
	}

	public void setAdministratorId(String administratorId) {
		this.administratorId = administratorId;
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

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}

	public int getSubjectId() {
		return subjectId;
	}

	public void setSubjectId(int subjectId) {
		this.subjectId = subjectId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorId) {
		this.professorId = professorId;
	}
}
