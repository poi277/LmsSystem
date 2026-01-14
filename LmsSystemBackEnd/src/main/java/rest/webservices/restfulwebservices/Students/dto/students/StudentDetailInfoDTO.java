package rest.webservices.restfulwebservices.Students.dto.students;

import java.util.List;
import java.util.stream.Collectors;

import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;

public class StudentDetailInfoDTO {
	String studentId;
	String studentName;
	String department;
	String phoneNumber;
	String email;
	String password;
	int maxGradeHour;

	private List<SubjectResponseDTO> subjects;
	private List<StudentsGradeDTO> grades;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public int getMaxGradeHour() {
		return maxGradeHour;
	}

	public void setMaxGradeHour(int maxGradeHour) {
		this.maxGradeHour = maxGradeHour;
	}

	public List<SubjectResponseDTO> getSubjects() {
		return subjects;
	}

	public void setSubjects(List<SubjectResponseDTO> subjects) {
		this.subjects = subjects;
	}

	public List<StudentsGradeDTO> getGrades() {
		return grades;
	}

	public void setGrades(List<StudentsGradeDTO> grades) {
		this.grades = grades;
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

	public StudentDetailInfoDTO(StudentsInfo student) {
		this.studentId = student.getStudentId();
		this.studentName = student.getStudentName();
		this.department = student.getDepartment();
		this.maxGradeHour = student.getMaxGradeHour();
		this.email = student.getEmail();
		this.phoneNumber = student.getPhoneNumber();
		this.password = student.getPassword();
		this.subjects = student.getSubjects().stream().map(SubjectResponseDTO::new).collect(Collectors.toList());
		this.grades = student.getStudentsGrade().stream().map(StudentsGradeDTO::new).collect(Collectors.toList());
	}
}
