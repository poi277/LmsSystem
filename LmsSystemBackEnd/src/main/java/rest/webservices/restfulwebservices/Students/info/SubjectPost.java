package rest.webservices.restfulwebservices.Students.info;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class SubjectPost {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long postId;

	private String title;
	private String category;
	private String content;
	private LocalDateTime createdDate;
	private String administratorid;
	@ManyToOne
	@JoinColumn(name = "subject_id")
	private SubjectInfo subject;

	@ManyToOne
	@JoinColumn(name = "student_Id")
	private StudentsInfo author;

	@ManyToOne
	@JoinColumn(name = "professor_id")
	private ProfessorInfo professorAuthor;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PostCommentInfo> comments = new ArrayList<>();

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PostFile> files = new ArrayList<>();
	public SubjectPost() {
	}


	public SubjectPost(Long postId, String title, String category, String content, LocalDateTime createdDate,
			SubjectInfo subject, StudentsInfo author, String administratorid) {
		super();
		this.postId = postId;
		this.title = title;
		this.category = category;
		this.content = content;
		this.createdDate = createdDate;
		this.subject = subject;
		this.author = author;
		this.administratorid = administratorid;
	}

	public List<PostFile> getFiles() {
		return files;
	}

	public void setFiles(List<PostFile> files) {
		this.files = files;
	}

	public String getAdministratorid() {
		return administratorid;
	}

	public void setAdministratorid(String administratorid) {
		this.administratorid = administratorid;
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

	public SubjectInfo getSubject() {
		return subject;
	}

	public void setSubject(SubjectInfo subject) {
		this.subject = subject;
	}

	public StudentsInfo getAuthor() {
		return author;
	}

	public void setAuthor(StudentsInfo author) {
		this.author = author;
	}

	public ProfessorInfo getProfessorAuthor() {
		return professorAuthor;
	}

	public void setProfessorAuthor(ProfessorInfo professorAuthor) {
		this.professorAuthor = professorAuthor;
	}

}
