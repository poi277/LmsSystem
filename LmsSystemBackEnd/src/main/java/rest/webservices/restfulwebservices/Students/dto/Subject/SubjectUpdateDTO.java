package rest.webservices.restfulwebservices.Students.dto.Subject;

import rest.webservices.restfulwebservices.Students.info.SubjectInfo;

public class SubjectUpdateDTO {
	private String professorId;
	private Integer subjectid;
	private String subject;
	private String departmentClass;
	private Integer gradeHour;
	private String classday;
	private Integer startHour;
	private Integer endHour;
	private Integer maximumStudentsCount;
	private Integer currentStudentsCount;
	private String professorName;
	private Integer subjectYear; // 2025
	private String semester; // FIRST or SECOND
	private String subjectStatus; // OPEN, CANCELLED, PAUSED

	public SubjectUpdateDTO() {
	}

	public SubjectUpdateDTO(SubjectInfo subject) {
		this.subjectid = subject.getSubjectid();
		this.subject = subject.getSubject();
		this.departmentClass = subject.getDepartmentClass();
		this.gradeHour = subject.getGradeHour();
		this.classday = subject.getClassday();
		this.startHour = subject.getStartHour();
		this.endHour = subject.getEndHour();
		this.maximumStudentsCount = subject.getMaximumStudentsCount();
		this.currentStudentsCount = subject.getCurrentStudentsCount();
		this.professorName = subject.getProfessor().getProfessorName();
		this.professorId = subject.getProfessor().getProfessorId();
		this.subjectYear = subject.getSubjectYear();
		this.semester = subject.getSemester() != null ? subject.getSemester().name() : "정보 없음";
		this.subjectStatus = subject.getSubjectStatus() != null ? subject.getSubjectStatus().name() : "정보 없음";
	}

	public SubjectUpdateDTO(String professorId, Integer subjectid, String subject, String departmentClass,
			Integer gradeHour, String classday, Integer startHour, Integer endHour, Integer maximumStudentsCount,
			Integer currentStudentsCount, String professorName, Integer subjectYear, String semester,
			String subjectStatus) {
		super();
		this.professorId = professorId;
		this.subjectid = subjectid;
		this.subject = subject;
		this.departmentClass = departmentClass;
		this.gradeHour = gradeHour;
		this.classday = classday;
		this.startHour = startHour;
		this.endHour = endHour;
		this.maximumStudentsCount = maximumStudentsCount;
		this.currentStudentsCount = currentStudentsCount;
		this.professorName = professorName;
		this.subjectYear = subjectYear;
		this.semester = semester;
		this.subjectStatus = subjectStatus;
	}

	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorId) {
		this.professorId = professorId;
	}

	public Integer getSubjectid() {
		return subjectid;
	}

	public void setSubjectid(Integer subjectid) {
		this.subjectid = subjectid;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getDepartmentClass() {
		return departmentClass;
	}

	public void setDepartmentClass(String departmentClass) {
		this.departmentClass = departmentClass;
	}

	public Integer getGradeHour() {
		return gradeHour;
	}

	public void setGradeHour(Integer gradeHour) {
		this.gradeHour = gradeHour;
	}

	public String getClassday() {
		return classday;
	}

	public void setClassday(String classday) {
		this.classday = classday;
	}

	public Integer getStartHour() {
		return startHour;
	}

	public void setStartHour(Integer startHour) {
		this.startHour = startHour;
	}

	public Integer getEndHour() {
		return endHour;
	}

	public void setEndHour(Integer endHour) {
		this.endHour = endHour;
	}

	public Integer getMaximumStudentsCount() {
		return maximumStudentsCount;
	}

	public void setMaximumStudentsCount(Integer maximumStudentsCount) {
		this.maximumStudentsCount = maximumStudentsCount;
	}

	public Integer getCurrentStudentsCount() {
		return currentStudentsCount;
	}

	public void setCurrentStudentsCount(Integer currentStudentsCount) {
		this.currentStudentsCount = currentStudentsCount;
	}

	public String getProfessorName() {
		return professorName;
	}

	public void setProfessorName(String professorName) {
		this.professorName = professorName;
	}

	public Integer getSubjectYear() {
		return subjectYear;
	}

	public void setSubjectYear(Integer subjectYear) {
		this.subjectYear = subjectYear;
	}

	public String getSemester() {
		return semester;
	}

	public void setSemester(String semester) {
		this.semester = semester;
	}

	public String getSubjectStatus() {
		return subjectStatus;
	}

	public void setSubjectStatus(String subjectStatus) {
		this.subjectStatus = subjectStatus;
	}

}
