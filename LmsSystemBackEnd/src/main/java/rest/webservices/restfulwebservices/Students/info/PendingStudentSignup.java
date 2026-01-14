package rest.webservices.restfulwebservices.Students.info;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class PendingStudentSignup {

	@Id
	private String token; // UUID

	private String studentId;
	private String studentName;
	private String department;
	private String password;
	private String phoneNumber;
	private String email;
	private int maxGradeHour;

	private LocalDateTime expireAt; // 유효 시간

	public PendingStudentSignup() {

	}

	public PendingStudentSignup(String token, String studentId, String studentName, String department, String password,
			String phoneNumber, String email, int maxGradeHour, LocalDateTime expireAt) {
		super();
		this.token = token;
		this.studentId = studentId;
		this.studentName = studentName;
		this.department = department;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.maxGradeHour = maxGradeHour;
		this.expireAt = expireAt;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getMaxGradeHour() {
		return maxGradeHour;
	}

	public void setMaxGradeHour(int maxGradeHour) {
		this.maxGradeHour = maxGradeHour;
	}

	public LocalDateTime getExpireAt() {
		return expireAt;
	}

	public void setExpireAt(LocalDateTime expireAt) {
		this.expireAt = expireAt;
	}

	// 생성자, getter/setter
}
