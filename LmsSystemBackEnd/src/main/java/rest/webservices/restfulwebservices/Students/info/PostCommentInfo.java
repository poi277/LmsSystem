package rest.webservices.restfulwebservices.Students.info;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PostCommentInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String content;
	private LocalDateTime createdDate;

	// 댓글 작성자 (학생 or 교수 or 관리자 중 1명)
	@ManyToOne
	@JoinColumn(name = "student_id")
	private StudentsInfo student;

	@ManyToOne
	@JoinColumn(name = "professor_id")
	private ProfessorInfo professor;

	private String administratorId;

	// 어떤 게시물의 댓글인지
	@ManyToOne
	@JoinColumn(name = "post_id")
	private SubjectPost post;

	public PostCommentInfo() {
	}

	public PostCommentInfo(String content, LocalDateTime createdDate, SubjectPost post) {
        this.content = content;
        this.createdDate = createdDate;
        this.post = post;
    }

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

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public StudentsInfo getStudent() {
		return student;
	}

	public void setStudent(StudentsInfo student) {
		this.student = student;
	}

	public ProfessorInfo getProfessor() {
		return professor;
	}

	public void setProfessor(ProfessorInfo professor) {
		this.professor = professor;
	}

	public String getAdministratorId() {
		return administratorId;
	}

	public void setAdministratorId(String administratorId) {
		this.administratorId = administratorId;
	}

	public SubjectPost getPost() {
		return post;
	}

	public void setPost(SubjectPost post) {
		this.post = post;
	}

}
