package rest.webservices.restfulwebservices.Students.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import rest.webservices.restfulwebservices.Students.info.Admin;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;

@Component
public class JwtUtil {

	private static final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey12"; // 최소 32바이트
	private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간
	private static final long Hour24 = 1000 * 60 * 60 * 24;

	private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

	public String generateRefreshToken(StudentsInfo student, String roles) {
		return Jwts.builder().setSubject(String.valueOf(student.getStudentId())).claim("role", roles)
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))// 1일
				.signWith(key, SignatureAlgorithm.HS256).compact();
	}

	public String generateRefreshProfessorToken(ProfessorInfo professor, String roles) {
		return Jwts.builder().setSubject(professor.getProfessorId()).claim("role", roles).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1일
				.signWith(key, SignatureAlgorithm.HS256).compact();
	}

	public String generateRefreshAdminToken(Admin Admin, String roles) {
		return Jwts.builder().setSubject(Admin.getId()).claim("role", roles).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1일
				.signWith(key, SignatureAlgorithm.HS256).compact();
	}

	public String generatedToken(StudentsInfo student, final long Time, String roles) {
		JwtBuilder builder = Jwts.builder().setSubject(String.valueOf(student.getStudentId()))
				.claim("studentId", student.getStudentId()).claim("studentName", student.getStudentName())
				.claim("roles", roles) // 👈 역할 부여
				.setIssuedAt(new Date())
				// .setExpiration(new Date(System.currentTimeMillis() + Time))
				.signWith(key, SignatureAlgorithm.HS256);
		if (Time > 0) {
			builder.setExpiration(new Date(System.currentTimeMillis() + Time));
		}
		return builder.compact();
	}

	public String generatedProfessorToken(ProfessorInfo Professor, final long Time, String roles) {
		JwtBuilder builder = Jwts.builder().setSubject(String.valueOf(Professor.getProfessorId()))
				.claim("professorId", Professor.getProfessorId()).claim("professorName", Professor.getProfessorName())
				.claim("roles", roles) // 👈 역할 부여
				.setIssuedAt(new Date())
				// .setExpiration(new Date(System.currentTimeMillis() + Time))
				.signWith(key, SignatureAlgorithm.HS256);
		if (Time > 0) {
			builder.setExpiration(new Date(System.currentTimeMillis() + Time));
		}
		return builder.compact();
	}

	// 어드민 토큰 기본 틀
	public String generatedAdminToken(Admin admin, final long Time, String roles) {
		JwtBuilder builder = Jwts.builder().setSubject(String.valueOf(admin.getId()))
				.claim("adminName", admin.getName())
				.claim("roles", roles) // 👈 역할 부여
				.setIssuedAt(new Date())
				// .setExpiration(new Date(System.currentTimeMillis() + Time))
				.signWith(key, SignatureAlgorithm.HS256);
		if (Time > 0) {
			builder.setExpiration(new Date(System.currentTimeMillis() + Time));
		}
		return builder.compact();
	}

	// 어드민 토큰 발급 생성
	public String generateTokenForAdmin(Admin admin) {
		return generatedAdminToken(admin, EXPIRATION_TIME, "ADMIN");
	}

	public String generateTokenProfessorMainHomePage(ProfessorInfo Professor) {
		return generatedProfessorToken(Professor, EXPIRATION_TIME, "PROFESSOR");
	}

	// 🔹 학생 메인 홈페이지 발급토큰 생성
	public String generateTokenStudentsMainHomePage(StudentsInfo student) {
		return generatedToken(student, EXPIRATION_TIME, "STUDENT");
	}


	// 수강신청 사이트 발급토큰 생성
	public String generateTokenSubjectRegister(StudentsInfo student) {
		return generatedToken(student, Hour24, "SUBJECT_REGISTER");
	}

	// 🔹 토큰에서 기본키 추출
	public String extractUsername(String token) {
		return parseClaims(token).getSubject();
	}

	// 🔹 토큰 유효성 검사
	public boolean validateToken(String token) {
		try {
			parseClaims(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	// 🔹 Claims 추출 (재사용)
	private Claims parseClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	}

	public int extractStudentId(String token) {
		return parseClaims(token).get("studentId", Integer.class);
	}

	public String extractStudentName(String token) {
		return parseClaims(token).get("studentName", String.class);
	}

	public String extractSubject(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
	}


//					StdentsInfo student = studentsRepository.findById(Integer.parseInt(request.getUsername())).get();
//토큰 생성시 사용예 	String token = jwtUtil.generateToken(student);
}