package rest.webservices.restfulwebservices.Students.dto.students;

import rest.webservices.restfulwebservices.Students.info.StudentsGrade;

public class StudentsGradeDTO {
	private Integer studentGradeId;
	private String subject;
	private float grade;
	private String gradeRank;
	private int gradeHour;
	private String studentId;

	public StudentsGradeDTO() {

	}
	public StudentsGradeDTO(StudentsGrade grade) {
		this.studentGradeId = grade.getStudentGradeId();
		this.subject = grade.getSubject();
		this.grade = grade.getGrade();
		this.gradeRank = grade.getGradeRank();
		this.gradeHour = grade.getGradeHour();
		this.studentId = grade.getStdentsInfo() != null ? grade.getStdentsInfo().getStudentId() : null;
	}

	public Integer getStudentGradeId() {
		return studentGradeId;
	}

	public void setStudentGradeId(Integer studentGradeId) {
		this.studentGradeId = studentGradeId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public float getGrade() {
		return grade;
	}

	public void setGrade(float grade) {
		this.grade = grade;
	}

	public String getGradeRank() {
		return gradeRank;
	}

	public void setGradeRank(String gradeRank) {
		this.gradeRank = gradeRank;
	}

	public int getGradeHour() {
		return gradeHour;
	}

	public void setGradeHour(int gradeHour) {
		this.gradeHour = gradeHour;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	// 기본 생성자와 Getter/Setter 추가
}