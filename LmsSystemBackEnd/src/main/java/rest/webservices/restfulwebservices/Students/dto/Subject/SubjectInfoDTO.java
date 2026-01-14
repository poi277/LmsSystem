package rest.webservices.restfulwebservices.Students.dto.Subject;

import java.util.List;

import rest.webservices.restfulwebservices.Students.dto.students.StudentInfoDTO;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;

public class SubjectInfoDTO {
	    private int subjectid;
	    private String subject;
	    private String professorName;
		private List<StudentInfoDTO> studentsGrade;

		public SubjectInfoDTO() {

		}
	    public SubjectInfoDTO(SubjectInfo subjectInfo) {
	        this.subjectid = subjectInfo.getSubjectid();
	        this.subject = subjectInfo.getSubject();
	        this.professorName = subjectInfo.getProfessor() != null ? subjectInfo.getProfessor().getProfessorName() : null;
	    }

		public List<StudentInfoDTO> getStudentsGrade() {
			return studentsGrade;
		}

		public void setStudentsGrade(List<StudentInfoDTO> studentsGrade) {
			this.studentsGrade = studentsGrade;
		}

		public int getSubjectid() {
			return subjectid;
		}

		public void setSubjectid(int subjectid) {
			this.subjectid = subjectid;
		}

		public String getSubject() {
			return subject;
		}

		public void setSubject(String subject) {
			this.subject = subject;
		}

		public String getProfessorName() {
			return professorName;
		}

		public void setProfessorName(String professorName) {
			this.professorName = professorName;
		}

	    // Getter, Setter 생략
	}

