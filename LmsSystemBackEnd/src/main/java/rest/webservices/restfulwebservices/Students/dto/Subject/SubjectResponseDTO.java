package rest.webservices.restfulwebservices.Students.dto.Subject;

import rest.webservices.restfulwebservices.Students.info.SubjectInfo;

public class SubjectResponseDTO {
	private Integer subjectid;
	private String professorId;
	private String subject;
	private String departmentClass;
	private Integer gradeHour;
	private String classday;
	private Integer startHour;
	private Integer endHour;
	private boolean registered;
	private String professorName;
	private Integer maximumStudentsCount; // ✅ 추가
	private Integer currentStudentsCount; // ✅ 추가
	private Integer subjectYear; // 2025
	private String semester; // FIRST or SECOND
	private String subjectStatus; // OPEN, CANCELLED, PAUSED

	public SubjectResponseDTO() {

	}

	public SubjectResponseDTO(SubjectInfo subject, boolean registered) {
		this.subjectid = subject.getSubjectid();
		this.subject = subject.getSubject();
		this.departmentClass = subject.getDepartmentClass();
		this.gradeHour = subject.getGradeHour();
		this.classday = subject.getClassday();
		this.startHour = subject.getStartHour();
		this.endHour = subject.getEndHour();
		this.registered = registered;
		this.maximumStudentsCount = subject.getMaximumStudentsCount();
		this.currentStudentsCount = subject.getCurrentStudentsCount();
		this.subjectYear = subject.getSubjectYear();
		this.semester = subject.getSemester() != null ? subject.getSemester().name() : "정보 없음";
		this.subjectStatus = subject.getSubjectStatus() != null ? subject.getSubjectStatus().name() : "정보 없음";

		if (subject.getProfessor() != null) {
			this.professorName = subject.getProfessor().getProfessorName(); // 교수 이름 필드명 확인
		} else {
			this.professorName = "정보 없음";
		}
	}

	public SubjectResponseDTO(SubjectInfo subject) {
		this.subjectid = subject.getSubjectid();
		this.subject = subject.getSubject();
		this.departmentClass = subject.getDepartmentClass();
		this.gradeHour = subject.getGradeHour();
		this.classday = subject.getClassday();
		this.startHour = subject.getStartHour();
		this.endHour = subject.getEndHour();
		this.maximumStudentsCount = subject.getMaximumStudentsCount();
		this.currentStudentsCount = subject.getCurrentStudentsCount();
		this.subjectYear = subject.getSubjectYear();
		this.semester = subject.getSemester() != null ? subject.getSemester().name() : "정보 없음";
		this.subjectStatus = subject.getSubjectStatus() != null ? subject.getSubjectStatus().name() : "정보 없음";

		if (subject.getProfessor() != null) {
			this.professorName = subject.getProfessor().getProfessorName(); // 교수 이름 필드명 확인
			this.professorId = subject.getProfessor().getProfessorId();
		} else {
			this.professorName = "정보 없음";
		}
	}
	// Getters & Setters

	public Integer getSubjectid() {
		return subjectid;
	}

	public void setSubjectid(Integer classid) {
		this.subjectid = classid;
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

	public void setGradeHour(int gradeHour) {
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

	public void setStartHour(int startHour) {
		this.startHour = startHour;
	}

	public Integer getEndHour() {
		return endHour;
	}

	public void setEndHour(int endHour) {
		this.endHour = endHour;
	}

	public boolean isRegistered() {
		return registered;
	}

	public void setRegistered(boolean registered) {
		this.registered = registered;
	}

	public Integer getMaximumStudentsCount() {
		return maximumStudentsCount;
	}

	public void setMaximumStudentsCount(int maximumStudentsCount) {
		this.maximumStudentsCount = maximumStudentsCount;
	}

	public Integer getCurrentStudentsCount() {
		return currentStudentsCount;
	}

	public void setCurrentStudentsCount(int currentStudentsCount) {
		this.currentStudentsCount = currentStudentsCount;
	}

	public String getProfessorName() {
		return professorName;
	}

	public void setProfessorName(String professorName) {
		this.professorName = professorName;
	}

	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorid) {
		this.professorId = professorid;
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
