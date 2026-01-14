package rest.webservices.restfulwebservices.Students.dto.File;

import java.time.LocalDateTime;

import rest.webservices.restfulwebservices.Students.info.PostFile;

public class PostFileDTO {

	private Long id;

	private String fileName; // 원본 파일명
	private String fileType; // MIME 타입 (예: image/png)
	private String fileUrl; // 저장된 서버 경로 또는 URL
	private Long fileSize; // 파일 크기 (바이트)
	private LocalDateTime uploadDate;

	private Long postId; // 연관된 게시글 ID만 전달

	public PostFileDTO() {
	}

	public PostFileDTO(PostFile postfile) {
		this.id = postfile.getId();
		this.fileName = postfile.getFileName();
		this.fileType = postfile.getFileType();
		this.fileUrl = postfile.getFileUrl();
		this.fileSize = postfile.getFileSize();
		this.uploadDate = postfile.getUploadDate();
		this.postId = postfile.getPost().getPostId();
	}

	public PostFileDTO(Long id, String fileName, String fileType, String fileUrl, Long fileSize,
			LocalDateTime uploadDate, Long postId) {
		this.id = id;
		this.fileName = fileName;
		this.fileType = fileType;
		this.fileUrl = fileUrl;
		this.fileSize = fileSize;
		this.uploadDate = uploadDate;
		this.postId = postId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public String getFileUrl() {
		return fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public LocalDateTime getUploadDate() {
		return uploadDate;
	}

	public void setUploadDate(LocalDateTime uploadDate) {
		this.uploadDate = uploadDate;
	}

	public Long getPostId() {
		return postId;
	}

	public void setPostId(Long postId) {
		this.postId = postId;
	}

}
