package rest.webservices.restfulwebservices.Students.Mapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectInfoDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectPostDTO;
import rest.webservices.restfulwebservices.Students.dto.Subject.SubjectPostSaveDTO;
import rest.webservices.restfulwebservices.Students.info.PostFile;
import rest.webservices.restfulwebservices.Students.info.ProfessorInfo;
import rest.webservices.restfulwebservices.Students.info.StudentsInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectInfo;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;
import rest.webservices.restfulwebservices.Students.repository.PostFileRepository;
import rest.webservices.restfulwebservices.Students.repository.ProfessorRepository;
import rest.webservices.restfulwebservices.Students.repository.StudentsRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectListRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectPostRepository;
import rest.webservices.restfulwebservices.Students.service.FileService;
import rest.webservices.restfulwebservices.Students.service.StudentsService;

@RestController
public class SubjectHomePageController {
	StudentsService studentsService;
	SubjectInfo subjectInfo;
	SubjectListRepository subjectListRepository;
	SubjectPostRepository subjectPostRepository;
	StudentsRepository studentsRepository;
	ProfessorRepository professorRepository;
	PostFileRepository postFileRepository;

	private final FileService fileService;


	public SubjectHomePageController(SubjectListRepository subjectListRepository,
			SubjectPostRepository subjectPostRepository, StudentsRepository studentsRepository,
			ProfessorRepository professorRepository, PostFileRepository postFileRepository, FileService fileService) {
		this.subjectListRepository = subjectListRepository;
		this.subjectPostRepository = subjectPostRepository;
		this.studentsRepository = studentsRepository;
		this.professorRepository = professorRepository;
		this.postFileRepository = postFileRepository;
		this.fileService = fileService;
	}

	@GetMapping("/subject/subject/{id}")
	public ResponseEntity<?> SubjectInfomation(@PathVariable int id) {
		SubjectInfo subject = subjectListRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 과목이 존재하지 않습니다."));
		SubjectInfoDTO dto = new SubjectInfoDTO(subject);
		return ResponseEntity.ok(dto);
	}


	@GetMapping("/subject/subject/post/{id}")
	public ResponseEntity<?> PostOne(@PathVariable Long id) {
		SubjectPost post = subjectPostRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 글을 찾을 수 없습니다."));

		SubjectPostDTO dto = new SubjectPostDTO(post);
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/subject/subject/postsAll/{id}")
	public ResponseEntity<?> PostList(@PathVariable Long id) {
		// 특정 과목 ID에 해당하는 글만 가져옴
		List<SubjectPost> posts = subjectPostRepository.findBySubjectSubjectid(id);

		// 그 글들을 DTO로 변환
		List<SubjectPostDTO> dtoList = posts.stream().map(SubjectPostDTO::new).collect(Collectors.toList());

		return ResponseEntity.ok(dtoList);
	}

	@DeleteMapping("/subject/subject/post/{id}")
	public ResponseEntity<?> PostDelete(@PathVariable Long id) {
		SubjectPost post = subjectPostRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 글을 찾을 수 없습니다."));

		// 🔍 관련 파일 조회
		List<PostFile> files = postFileRepository.findByPost(post);

		// 🔧 파일 서비스로 이동 및 DB 삭제
		fileService.moveFilesToRecycleAndDeleteRecords(files);

		// 🗑 게시글 삭제
		subjectPostRepository.delete(post);

		return ResponseEntity.noContent().build();
	}






	@PostMapping("/subject/subject/post")
	public ResponseEntity<?> Postregister(@RequestBody SubjectPostSaveDTO dto) {
		// 👇 제목, 카테고리, 내용이 비어 있는지 검사
		if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("제목을 입력해주세요.");
		}

		if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("내용을 입력해주세요.");
		}

		SubjectPost post = new SubjectPost();
		post.setTitle(dto.getTitle());
		post.setCategory(dto.getCategory());
		post.setContent(dto.getContent());
		post.setCreatedDate(dto.getCreatedDate());

		SubjectInfo subject = subjectListRepository.findById(dto.getSubjectId())
				.orElseThrow(() -> new RuntimeException("과목 정보 없음"));
		post.setSubject(subject);

		if ("STUDENT".equals(dto.getRole())) {
			StudentsInfo author = studentsRepository.findById(dto.getStudentId())
					.orElseThrow(() -> new RuntimeException("학생 정보 없음"));
			post.setAuthor(author);
		} else if ("PROFESSOR".equals(dto.getRole())) {
			ProfessorInfo professor = professorRepository.findById(dto.getProfessorId())
					.orElseThrow(() -> new RuntimeException("교수 정보 없음"));
			post.setProfessorAuthor(professor);
		} else if ("ADMINISTRATOR".equals(dto.getRole())) {
			post.setAdministratorid((dto.getAdministratorId()));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("작성자 정보가 유효하지 않습니다.");
		}

		subjectPostRepository.save(post);

		return ResponseEntity.ok(Map.of("message", "글이 성공적으로 등록되었습니다.", "postId", post.getPostId()));
	}



	@PutMapping("/subject/subject/update")
	public ResponseEntity<?> PostUpdate(@RequestBody SubjectPostSaveDTO dto) {
		// 제목, 카테고리, 내용 검증
		if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("제목을 입력해주세요.");
		}
		if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("내용을 입력해주세요.");
		}
		SubjectPost post = subjectPostRepository.findById(dto.getPostId())
				.orElseThrow(() -> new RuntimeException("글이 존재하지 않습니다."));
		post.setTitle(dto.getTitle());
		post.setCategory(dto.getCategory());
		post.setContent(dto.getContent());
		subjectPostRepository.save(post);

		return ResponseEntity.ok("글이 성공적으로 수정되었습니다.");
	}




}
