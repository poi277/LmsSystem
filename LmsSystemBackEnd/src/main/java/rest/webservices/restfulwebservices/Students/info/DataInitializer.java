package rest.webservices.restfulwebservices.Students.info;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import rest.webservices.restfulwebservices.Students.repository.GradeRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;

//@Configuration
public class DataInitializer {

	@Bean
	@Transactional // 트랜잭션 보장 필수!
	public CommandLineRunner initData(StudentsRepository studentRepository, SubjectListRepository subjectRepository,
			GradeRepository gradeRepository) {
		return args -> {
			Optional<StudentsInfo> studentOpt = studentRepository.findById("1");
			if (studentOpt.isPresent()) {
				StudentsInfo student = studentOpt.get();

				// 1) 학생의 studentsGrade 컬렉션 강제 초기화 (세션 안에서)
				Hibernate.initialize(student.getStudentsGrade());

				// 2) 기존 성적 삭제
				gradeRepository.deleteAll(student.getStudentsGrade());
				student.getStudentsGrade().clear();

				// 3) 과목 불러오기 및 학생 과목 세팅
				List<SubjectInfo> subjects = subjectRepository.findAllById(Arrays.asList(1, 2));
				student.getSubjects().clear();
				student.getSubjects().addAll(subjects);
				studentRepository.save(student);

				// 4) 새 성적 생성 및 저장
				for (SubjectInfo subject : subjects) {
					StudentsGrade grade = new StudentsGrade(subject.getSubject(), 0f, null, subject.getGradeHour());
					grade.setStdentsInfo(student);
					grade.setSubjectInfo(subject);
					gradeRepository.save(grade);
					student.getStudentsGrade().add(grade);
				}

				System.out
						.println("Student 1's subjects and grades initialized with " + subjects.size() + " subjects.");
			} else {
				System.out.println("Student with id 1 not found.");
			}
		};
	}
}