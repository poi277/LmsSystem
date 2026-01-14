package rest.webservices.restfulwebservices.Students.dto.professor;

public class ProfessorRegisterDto {
	private String professorId;
	private String password;
	private String professorName;
	private String department;
	private String email;
	private String phoneNumber;
	private String officeLocation;
	private String position;

	// 기본 생성자
	public ProfessorRegisterDto() {
	}

	// 모든 필드 생성자
	public ProfessorRegisterDto(String professorId, String password, String professorName, String department,
			String email, String phoneNumber, String officeLocation, String position) {
		this.professorId = professorId;
		this.password = password;
		this.professorName = professorName;
		this.department = department;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.officeLocation = officeLocation;
		this.position = position;
	}

	// Getters & Setters
	public String getProfessorId() {
		return professorId;
	}

	public void setProfessorId(String professorId) {
		this.professorId = professorId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getOfficeLocation() {
		return officeLocation;
	}

	public void setOfficeLocation(String officeLocation) {
		this.officeLocation = officeLocation;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}
}
