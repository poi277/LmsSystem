package rest.webservices.restfulwebservices.Students.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.dto.professor.ProfessorRegisterDto;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;

@Service
public class ProfessorService {
	private PasswordEncoder passwordEncoder;
	private ProfessorRepository professorRepository;

	public ProfessorService(ProfessorRepository professorRepository, PasswordEncoder passwordEncoder) {
		this.professorRepository = professorRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<ProfessorInfo> findProfessorById(String professorId) {
		return professorRepository.findById(professorId);
	}

	public void createProfessor(ProfessorRegisterDto dto) {
		if (professorRepository.existsById(dto.getProfessorId())) {
			throw new IllegalArgumentException("이미 존재하는 교수 ID입니다.");
		}

		ProfessorInfo professor = new ProfessorInfo(dto.getProfessorId(), passwordEncoder.encode(dto.getPassword()), // 암호화
																														// 적용
				dto.getProfessorName(), dto.getDepartment(), dto.getEmail(), dto.getPhoneNumber(),
				dto.getOfficeLocation(), dto.getPosition());

		professorRepository.save(professor);
	}

	public boolean professorExists(String professorId) {
		return professorRepository.existsById(professorId);
	}

	public ProfessorInfo updateProfessor(ProfessorInfo professor) {
		return professorRepository.save(professor);
	}

	public boolean existsByEmail(String email) {
		return professorRepository.existsByEmail(email);
	}

	public String findIdByEmail(String email) {
		Optional<ProfessorInfo> studentOpt = professorRepository.findByEmail(email);
		return studentOpt.map(ProfessorInfo::getProfessorId).orElse(null);
	}
}
