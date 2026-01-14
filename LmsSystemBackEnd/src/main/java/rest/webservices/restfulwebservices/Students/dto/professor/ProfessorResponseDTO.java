package rest.webservices.restfulwebservices.Students.dto.professor;

import java.util.List;
import java.util.stream.Collectors;

import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectResponseDTO;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;

public class ProfessorResponseDTO {
    private String professorId;
    private String professorName;
    private String department;
    // 기타 교수 정보 필드

	private List<SubjectResponseDTO> subjects; // 담당 과목 리스트

    public ProfessorResponseDTO(ProfessorInfo professor) {
        this.professorId = professor.getProfessorId();
        this.professorName = professor.getProfessorName();
        this.department = professor.getDepartment();

        this.subjects = professor.getSubjects().stream()
            .map(subject -> new SubjectResponseDTO(subject))
            .collect(Collectors.toList());
    }

	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorId) {
		this.professorId = professorId;
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

	public List<SubjectResponseDTO> getSubjects() {
		return subjects;
	}

	public void setSubjects(List<SubjectResponseDTO> subjects) {
		this.subjects = subjects;
	}

}