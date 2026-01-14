package rest.webservices.restfulwebservices.Students.Mapping;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import rest.webservices.restfulwebservices.Students.dto.File.PostFileDTO;
import rest.webservices.restfulwebservices.Students.info.PostFile;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;
import rest.webservices.restfulwebservices.Students.repository.PostFileRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectPostRepository;
import rest.webservices.restfulwebservices.Students.service.FileService;

@RestController
@RequestMapping("/files")
public class FileUploadController {
	private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";
	// private static final String UPLOAD_DIR = "uploads"; 이건 오류가 떠
	private final PostFileRepository postFileRepository;
	private final SubjectPostRepository subjectPostRepository;
	private final FileService fileService;

	public FileUploadController(PostFileRepository postFileRepository, SubjectPostRepository subjectPostRepository,
			FileService fileService) {
		this.postFileRepository = postFileRepository;
		this.subjectPostRepository = subjectPostRepository;
		this.fileService = fileService;
	}

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam("postId") Long postId) {
		try {
			File directory = new File(UPLOAD_DIR);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// 💡 파일명 충돌 방지를 위한 고유 이름 생성
			String originalFileName = file.getOriginalFilename();
			String uniqueFileName = System.currentTimeMillis() + "_" + originalFileName;
			// String uniqueFileName = UUID.randomUUID().toString() + "_" +
			// originalFileName; 랜덤번호방식
			File saveFile = new File(UPLOAD_DIR, uniqueFileName);
			file.transferTo(saveFile);

			SubjectPost post = subjectPostRepository.findById(postId)
					.orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));

			PostFile postFile = new PostFile();
			postFile.setFileName(originalFileName); // 사용자에게 보여줄 이름
			postFile.setFileType(file.getContentType());
			postFile.setFileSize(file.getSize());
			postFile.setFileUrl(saveFile.getAbsolutePath()); // 실제 서버에 저장된 경로
			postFile.setUploadDate(LocalDateTime.now());
			postFile.setPost(post);

			postFileRepository.save(postFile);

			return ResponseEntity.ok("파일 업로드 및 DB 저장 성공: " + originalFileName);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패: " + e.getMessage());
		}
	}



	@GetMapping("/post/{postId}")
	public List<PostFileDTO> getFilesByPost(@PathVariable Long postId) {
		SubjectPost post = subjectPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글 없음"));

		List<PostFileDTO> dtoList = new ArrayList<>();
		for (PostFile file : post.getFiles()) {
			PostFileDTO dto = new PostFileDTO(file); // 생성자 이용
			dtoList.add(dto);
		}

		return dtoList;
	}


	@GetMapping("/download/{fileId}")
	public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws IOException {
		PostFile postFile = postFileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("파일 없음"));

		Path path = Paths.get(postFile.getFileUrl());
		Resource resource = new UrlResource(path.toUri());

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(postFile.getFileType()))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + postFile.getFileName() + "\"")
				.body(resource);
	}

	@DeleteMapping("/delete/{fileId}")
	public ResponseEntity<String> deleteFile(@PathVariable Long fileId) {
		PostFile postFile = postFileRepository.findById(fileId)
				.orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));
		try {
			// 파일 하나만 리스트로 감싸서 전달
			fileService.moveFilesToRecycleAndDeleteRecords(List.of(postFile));
			return ResponseEntity.ok("파일이 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 삭제 중 오류 발생: " + e.getMessage());
		}
	}


}

