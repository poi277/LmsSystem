package rest.webservices.restfulwebservices.Students.info;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import rest.webservices.restfulwebservices.Students.dto.Author;

@Entity
public class Admin implements Author {
	@Id
	private String id;

	private String password;

	private String name;

	@Override
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}


}
