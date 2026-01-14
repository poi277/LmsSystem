package rest.webservices.restfulwebservices.Students.info;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;

@Entity
@Table(name = "SUBJECT_INFO")
public class SubjectInfo {

	public enum SubjectStatus {
		OPEN, // 개설
		CLOSED, // 종강
		CANCELLED, // 폐강
		PAUSED, // 휴강
	}

	public enum Semester {
		FIRST, SECOND
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer subjectid;
	String departmentClass;
	private String subject;
	private int gradeHour;
	private String classday;
	private int startHour;
	private int endHour;
	private int currentStudentsCount;
	private int maximumStudentsCount;
	private Integer subjectYear;
	@Enumerated(EnumType.STRING) // DB에 "FIRST", "SECOND"로 저장됨
	private Semester semester;
	@Enumerated(EnumType.STRING) // DB에 "OPEN", "CANCELLED"로 저장됨
	private SubjectStatus subjectStatus;

	@ManyToMany(mappedBy = "subjects")
	@JsonIgnore
	private List<StudentsInfo> students = new ArrayList<StudentsInfo>();

	@OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
	private List<SubjectPost> subjectPost;
	
	@ManyToOne
	@JoinColumn(name = "professor_id") // 외래키 이름
	private ProfessorInfo professor;

	public SubjectInfo() {

	}
	public SubjectInfo(Integer subjectid, String departmentClass, String subject, int gradeHour, String classday,
			int startHour, int endHour, int currentStudentsCount, int maximumStudentsCount, Integer subjectYear,
			Semester semester, SubjectStatus subjectStatus, List<StudentsInfo> students, List<SubjectPost> subjectPost,
			ProfessorInfo professor) {
		super();
		this.subjectid = subjectid;
		this.departmentClass = departmentClass;
		this.subject = subject;
		this.gradeHour = gradeHour;
		this.classday = classday;
		this.startHour = startHour;
		this.endHour = endHour;
		this.currentStudentsCount = currentStudentsCount;
		this.maximumStudentsCount = maximumStudentsCount;
		this.subjectYear = subjectYear;
		this.semester = semester;
		this.subjectStatus = subjectStatus;
		this.students = students;
		this.subjectPost = subjectPost;
		this.professor = professor;
	}



	public SubjectInfo(SubjectResponseDTO Dto) {
		super();
		this.subjectid = Dto.getSubjectid();
		this.departmentClass = Dto.getDepartmentClass();
		this.subject = Dto.getSubject();
		this.gradeHour = Dto.getGradeHour();
		this.classday = Dto.getClassday();
		this.startHour = Dto.getStartHour();
		this.endHour = Dto.getEndHour();
		this.currentStudentsCount = Dto.getCurrentStudentsCount();
		this.maximumStudentsCount = Dto.getMaximumStudentsCount();
		this.subjectYear = Dto.getSubjectYear();
		try {
			this.semester = Semester.valueOf(Dto.getSemester());
		} catch (IllegalArgumentException | NullPointerException e) {
			this.semester = null;
		}

		try {
			this.subjectStatus = SubjectStatus.valueOf(Dto.getSubjectStatus());
		} catch (IllegalArgumentException | NullPointerException e) {
			this.subjectStatus = null;
		}
	}



	public void increMentsCurrentStudentsCount() {
		currentStudentsCount += 1;
	}

	public void decreMentsCurrentStudentsCount() {
		currentStudentsCount -= 1;
	}

	public boolean isFullStudents() {
		if (currentStudentsCount >= maximumStudentsCount) {
			return true;
		} else {
			return false;
		}
	}
	public static boolean canRegister(SubjectInfo newSubject, List<SubjectInfo> registeredSubjects) {
		for (SubjectInfo existing : registeredSubjects) {
			if (newSubject.overlapsWith(existing)) {
				return false; // 겹치는 시간대 있음
			}
		}
		return true; // 겹치지 않음
	}

	public boolean overlapsWith(SubjectInfo other) {
		return this.classday.equals(other.classday) && this.startHour < other.endHour && other.startHour < this.endHour;
	}

	public Integer getSubjectid() {
		return subjectid;
	}

	public void seSubjectid(Integer subjectid) {
		this.subjectid = subjectid;
	}
	public String getDepartmentClass() {
		return departmentClass;
	}
	public void setDepartmentClass(String departmentClass) {
		this.departmentClass = departmentClass;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public int getGradeHour() {
		return gradeHour;
	}
	public void setGradeHour(int gradeHour) {
		this.gradeHour = gradeHour;
	}
	public String getClassday() {
		return classday;
	}

	public void setClassday(String classday) {
		this.classday = classday;
	}
	public int getStartHour() {
		return startHour;
	}
	public void setStartHour(int startHour) {
		this.startHour = startHour;
	}
	public int getEndHour() {
		return endHour;
	}
	public void setEndHour(int endHour) {
		this.endHour = endHour;
	}

	public List<StudentsInfo> getStudents() {
		return students;
	}

	public void setStudents(List<StudentsInfo> students) {
		this.students = students;
	}


	public int getCurrentStudentsCount() {
		return currentStudentsCount;
	}

	public void setCurrentStudentsCount(int currentStudentsCount) {
		this.currentStudentsCount = currentStudentsCount;
	}

	public int getMaximumStudentsCount() {
		return maximumStudentsCount;
	}

	public void setMaximumStudentsCount(int maximumStudentsCount) {
		this.maximumStudentsCount = maximumStudentsCount;
	}

	public List<SubjectPost> getSubjectPost() {
		return subjectPost;
	}

	public void setSubjectPost(List<SubjectPost> subjectPost) {
		this.subjectPost = subjectPost;
	}

	public ProfessorInfo getProfessor() {
		return professor;
	}

	public void setProfessor(ProfessorInfo professor) {
		this.professor = professor;
	}

	public void setSubjectid(Integer subjectid) {
		this.subjectid = subjectid;
	}

	public Integer getSubjectYear() {
		return subjectYear;
	}

	public void setSubjectYear(Integer subjectYear) {
		this.subjectYear = subjectYear;
	}


	public Semester getSemester() {
		return semester;
	}


	public void setSemester(Semester semester) {
		this.semester = semester;
	}
	
	public SubjectStatus getSubjectStatus() {
		return subjectStatus;
	}

	public void setSubjectStatus(SubjectStatus subjectStatus) {
		this.subjectStatus = subjectStatus;
	}
}
