package rest.webservices.restfulwebservices.Students.info;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class StudentsGrade {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer studentGradeId;
	String subject;
	float grade;
	String gradeRank;
	int gradeHour;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	private StudentsInfo stdentsInfo;
	@ManyToOne(fetch = FetchType.LAZY)
	private SubjectInfo subjectInfo;

	public StudentsGrade() {

	}

	public StudentsGrade(String subject, float grade, String gradeRank, int gradeHour) {
		super();
		this.subject = subject;
		this.grade = grade;
		this.gradeRank = gradeRank;
		this.gradeHour = gradeHour;
	}

	public SubjectInfo getSubjectInfo() {
		return subjectInfo;
	}

	public void setSubjectInfo(SubjectInfo subjectInfo) {
		this.subjectInfo = subjectInfo;
	}

	public Integer getStudentGradeId() {
		return studentGradeId;
	}

	public void setStudentGradeId(Integer studentGradeId) {
		this.studentGradeId = studentGradeId;
	}

	public StudentsInfo getStdentsInfo() {
		return stdentsInfo;
	}

	public void setStdentsInfo(StudentsInfo stdentsInfo) {
		this.stdentsInfo = stdentsInfo;
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

	@Override
	public String toString() {
		return "StudentsGrade [studentId=" + studentGradeId + ", subject=" + subject + ", grade=" + grade
				+ ", gradeRank=" + gradeRank + ", gradeHour=" + gradeHour + "]";
	}

	public Integer getSubjectId() {
		return subjectInfo != null ? subjectInfo.getSubjectid() : null;
	}

}

