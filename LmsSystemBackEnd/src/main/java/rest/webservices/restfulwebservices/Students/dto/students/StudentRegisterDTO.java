package rest.webservices.restfulwebservices.Students.dto.students;

public class StudentRegisterDTO {
	private String studentId;
	private String password;
	private String confirmPassword;
	private String studentName;
	private String department;
	private int maxGradeHour;
	private String phoneNumber;
	private String email;

	// 기본 생성자
	public StudentRegisterDTO() {
	}

	// 모든 필드 생성자
	public StudentRegisterDTO(String studentId, String password, String studentName, String department,
			int maxGradeHour, String phoneNumber, String email, String confirmPassword) {
		this.studentId = studentId;
		this.password = password;
		this.studentName = studentName;
		this.department = department;
		this.maxGradeHour = maxGradeHour;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.confirmPassword = confirmPassword;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

}
