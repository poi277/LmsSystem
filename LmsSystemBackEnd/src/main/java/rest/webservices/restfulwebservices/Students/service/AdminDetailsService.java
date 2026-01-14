package rest.webservices.restfulwebservices.Students.service;

import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.repository.AdminRepository;

@Service
public class AdminDetailsService {

	private final AdminRepository adminRepository;

	public AdminDetailsService(AdminRepository adminRepository) {
		this.adminRepository = adminRepository;
	}

}
