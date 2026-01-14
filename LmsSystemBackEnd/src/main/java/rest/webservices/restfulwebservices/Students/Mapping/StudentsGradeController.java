package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.students.StudentInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.students.StudentsGradeDTO;
import rest.webservices.restfulwebservices.Students.info.StudentsGrade;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.repository.GradeRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;
import rest.webservices.restfulwebservices.Students.service.GradeService;
import rest.webservices.restfulwebservices.Students.service.StudentsService;

@RequestMapping("/grade")
@RestController
public class StudentsGradeController {

	private final StudentsService studentsService;
	private final GradeService gradeService;
	private final SubjectListRepository subjectListRepository;
	private final GradeRepository gradeRepository;

	public StudentsGradeController(StudentsService studentsService, GradeService gradeService,
			SubjectListRepository subjectListRepository, GradeRepository gradeRepository) {
		this.studentsService = studentsService;
		this.gradeService = gradeService;
		this.subjectListRepository = subjectListRepository;
		this.gradeRepository = gradeRepository;
	}

	@GetMapping("/{id}")
	public ResponseEntity<SubjectInfoDTO> GetSubjectGradeList(@PathVariable Integer id) {
	    Optional<SubjectInfo> subjectInfoOpt = subjectListRepository.findById(id);
	    if (subjectInfoOpt.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }
	    SubjectInfo subjectInfo = subjectInfoOpt.get();
	    SubjectInfoDTO dto = new SubjectInfoDTO(subjectInfo);

	    // 성적 정보 세팅
	    List<StudentInfoDTO> studentsWithGrades = gradeService.getStudentsWithGradesBySubject(subjectInfo);
	    dto.setStudentsGrade(studentsWithGrades);
	    return ResponseEntity.ok(dto);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateGrades(@RequestBody SubjectInfoDTO dto) {
		for (StudentInfoDTO student : dto.getStudentsGrade()) {
			for (StudentsGradeDTO grade : student.getGrades()) {
				int gradeId = grade.getStudentGradeId();
				float score = grade.getGrade();
				String rank = grade.getGradeRank();

				StudentsGrade entity = gradeRepository.findById(gradeId)
						.orElseThrow(() -> new RuntimeException("성적 ID " + gradeId + "를 찾을 수 없습니다."));

				entity.setGrade(score);
				entity.setGradeRank(rank);
				gradeRepository.save(entity); // ✅ 실제 DB 업데이트
			}
		}
		return ResponseEntity.ok("업데이트 완료");
	}

}
