package rest.webservices.restfulwebservices.Students.dto.students;

//StudentSignupDTO.java
public class StudentSignupDTO {
	private String studentId;
	private String studentName;
	private String department;
	private String password;
	private String phoneNumber;
	private String email;
	private int maxGradeHour;

	public StudentSignupDTO(String studentId, String studentName, String department, String password,
			String phoneNumber, String email, int maxGradeHour) {
		super();
		this.studentId = studentId;
		this.studentName = studentName;
		this.department = department;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.maxGradeHour = maxGradeHour;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public int getMaxGradeHour() {
		return maxGradeHour;
	}

	public void setMaxGradeHour(int maxGradeHour) {
		this.maxGradeHour = maxGradeHour;
	}

	// Getter, Setter
}
