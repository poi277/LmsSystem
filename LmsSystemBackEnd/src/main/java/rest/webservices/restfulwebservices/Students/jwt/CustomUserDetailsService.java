package rest.webservices.restfulwebservices.Students.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import rest.webservices.restfulwebservices.Students.repository.AdminRepository;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private StudentsRepository studentsRepository;
	@Autowired
	private ProfessorRepository professorRepository;
	@Autowired
	private AdminRepository adminRepository;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    System.out.println("CustomUserDetailsService 호출됨: " + username);

	    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
	    String authHeader = request.getHeader("Authorization");
	    System.out.println("Authorization 헤더: " + authHeader);

		// ✅ Basic 인증인 경우 (관리자 전용)
	    if (authHeader != null && authHeader.startsWith("Basic ")) {
	        if ("poi".equals(username)) {
	            return User.builder()
	                    .username("poi")
	                    .password("$2a$10$iEha8WnqgiKOeHoVzxiQ7.ovy1dC.OMLLwOv8TPicJ3n7hg9b1/u6") // 123
						.roles("ADMIN")
	                    .build();
	        } else {
				throw new UsernameNotFoundException("Basic 인증은 관리자만 허용됩니다.");
	        }
	    }

		// ✅ JWT 인증 흐름: 학생 또는 교수
	    try {
			String id = username;
			// 0.관리자부터 검색

			var AdminOpt = adminRepository.findById(id);
			if (AdminOpt.isPresent()) {
				var Admin = AdminOpt.get();
				return User.builder().username(String.valueOf(Admin.getId())).password(Admin.getPassword())
						.roles("ADMIN").build();
			}

			var studentOpt = studentsRepository.findById(id);
			if (studentOpt.isPresent()) {
				var student = studentOpt.get();
				return User.builder().username(String.valueOf(student.getStudentId())).password(student.getPassword())
						.roles("STUDENT").build();
			}

			// 1. 학생 먼저 탐색

			// 2. 학생이 아니면 교수 탐색
			var professorOpt = professorRepository.findById(id);
			if (professorOpt.isPresent()) {
				var professor = professorOpt.get();
				return User.builder().username(String.valueOf(professor.getProfessorId()))
						.password(professor.getPassword()).roles("PROFESSOR").build();
			}

			// 3. 아무것도 못 찾은 경우
			throw new UsernameNotFoundException("해당 ID의 사용자(Student/Professor)를 찾을 수 없습니다.");

		} catch (Exception e) {
			throw new UsernameNotFoundException("로그인 오류: " + e.getMessage());
	    }
	}

}
