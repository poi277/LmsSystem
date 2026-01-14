package rest.webservices.restfulwebservices.Students.dto;

public class UserInfoDTO {
	private String id;
	private String name;
	private String department;
	private String position;
	private String phoneNumber;
	private String email;
	private String officeLocation;
	private int maxGradeHour;
	private String role; // 👈 역할 구분 필드 추가


	public UserInfoDTO(String id, String name, String department, String position, String phoneNumber, String email,
			String officeLocation, int maxGradeHour, String role) {
		super();
		this.id = id;
		this.name = name;
		this.department = department;
		this.position = position;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.officeLocation = officeLocation;
		this.maxGradeHour = maxGradeHour;
		this.role = role;
	}

	// Getters & Setters

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
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

	public String getOfficeLocation() {
		return officeLocation;
	}

	public void setOfficeLocation(String officeLocation) {
		this.officeLocation = officeLocation;
	}

	public int getMaxGradeHour() {
		return maxGradeHour;
	}

	public void setMaxGradeHour(int maxGradeHour) {
		this.maxGradeHour = maxGradeHour;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}

