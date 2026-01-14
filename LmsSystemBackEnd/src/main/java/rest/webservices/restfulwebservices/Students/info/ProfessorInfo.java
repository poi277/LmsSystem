package rest.webservices.restfulwebservices.Students.info;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import rest.webservices.restfulwebservices.Students.dto.Author;

@Entity
public class ProfessorInfo implements Author {

	@OneToMany(mappedBy = "professorAuthor", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<SubjectPost> posts = new ArrayList<>();

	@OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<SubjectInfo> subjects = new ArrayList<>();

	@Id
	private String professorId; // 교수 고유 ID
	private String password; // 교수 고유 ID
	private String professorName;
	private String department;
	private String email;
	private String phoneNumber;
	private String officeLocation;
	private String position;

	public ProfessorInfo() {
	}

	public ProfessorInfo(String professorId, String password,
			String professorName, String department, String email, String phoneNumber, String officeLocation,
			String position) {
		this.professorId = professorId;
		this.password = password;
		this.professorName = professorName;
		this.department = department;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.officeLocation = officeLocation;
		this.position = position;
	}


	public List<SubjectPost> getPosts() {
		return posts;
	}

	public void setPosts(List<SubjectPost> posts) {
		this.posts = posts;
	}

	public List<SubjectInfo> getSubjects() {
		return subjects;
	}

	public void setSubjects(List<SubjectInfo> subjects) {
		this.subjects = subjects;
	}

	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorId) {
		this.professorId = professorId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getProfessorName() {
		return professorName;
	}

	public void setProfessorName(String professorName) {
		this.professorName = professorName;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getOfficeLocation() {
		return officeLocation;
	}

	public void setOfficeLocation(String officeLocation) {
		this.officeLocation = officeLocation;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	@Override
	public String getName() {
		return this.professorName;
	}

	@Override
	public String getId() {
		return this.professorId;
	}

}
