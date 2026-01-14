package rest.webservices.restfulwebservices.Students.info
;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import rest.webservices.restfulwebservices.Students.dto.Author;

@Entity
public class StudentsInfo implements Author {
	@Id
	String studentId;
	String password;
	String studentName;
	String department;
	String phoneNumber;
	String email;
	int maxGradeHour;


	// @OneToMany(mappedBy = "stdentsInfo", fetch = FetchType.EAGER)
	@OneToMany(mappedBy = "stdentsInfo") // 기본은 lazy이고 datainiazatilon때문에 eagar로 바꿈
	@JsonIgnore
	private List<StudentsGrade> studentsGrade;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "students_subjects", // 중간 테이블 이름
			joinColumns = @JoinColumn(name = "student_id"), // 현재 테이블(Student)의 키
			inverseJoinColumns = @JoinColumn(name = "subject_id") // 연결 대상 테이블(Subject)의 키
	)
	private List<SubjectInfo> subjects = new ArrayList<>();

	@OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
	@JsonIgnore // 순환참조 방지
	private List<SubjectPost> posts = new ArrayList<>();


	StudentsInfo() {

	}

	public StudentsInfo(String studentId, String password, String studentName, String department, int maxGradeHour,
			String phoneNumber, String email) {
		super();
		this.studentId = studentId;
		this.studentName = studentName;
		this.department = department;
		this.maxGradeHour = maxGradeHour;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.email = email;
	}

	public List<SubjectInfo> getSubjects() {
		return subjects;
	}

	public void setSubjects(List<SubjectInfo> subjects) {
		this.subjects = subjects;
	}

	public List<StudentsGrade> getStudentsGrade() {
		return studentsGrade;
	}

	public void setStudentsGrade(List<StudentsGrade> studentsGrade) {
		this.studentsGrade = studentsGrade;
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

	public int getMaxGradeHour() {
		return maxGradeHour;
	}

	public void setMaxGradeHour(int maxGradeHour) {
		this.maxGradeHour = maxGradeHour;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
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

	@Override
	public String getName() {
		return this.studentName;
	}
	@Override
	public String getId() {
		return this.studentId;
	}



}
