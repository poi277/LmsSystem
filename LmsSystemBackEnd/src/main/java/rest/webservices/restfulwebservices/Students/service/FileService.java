package rest.webservices.restfulwebservices.Students.service;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Service;

import rest.webservices.restfulwebservices.Students.info.PostFile;
import rest.webservices.restfulwebservices.Students.info.SubjectPost;
import rest.webservices.restfulwebservices.Students.repository.PostFileRepository;
import rest.webservices.restfulwebservices.Students.repository.SubjectPostRepository;

@Service
public class FileService {

	private final PostFileRepository postFileRepository;
	private final SubjectPostRepository subjectPostRepository;

	public FileService(PostFileRepository postFileRepository, SubjectPostRepository subjectPostRepository) {
		this.postFileRepository = postFileRepository;
		this.subjectPostRepository = subjectPostRepository;
	}

	public void moveFilesToRecycleAndDeleteRecords(List<PostFile> files) {
		File recycleDir = new File(System.getProperty("user.dir") + "/recycle");
		if (!recycleDir.exists()) {
			recycleDir.mkdirs();
		}

		for (PostFile file : files) {
			try {
				File originalFile = new File(file.getFileUrl());
				String recycledFileName = System.currentTimeMillis() + "_" + file.getFileName();
				File recycledFile = new File(recycleDir, recycledFileName);

				boolean moved = originalFile.renameTo(recycledFile);
				if (moved) {
					System.out.println("파일 이동 완료: " + recycledFile.getAbsolutePath());
				} else {
					System.err.println("파일 이동 실패: " + file.getFileUrl());
				}

			} catch (Exception e) {
				System.err.println("파일 이동 중 오류: " + e.getMessage());
			}

			postFileRepository.delete(file);
		}
	}

	public void moveFilesBySubjectIdAndDelete(Long subjectId) {
		// 해당 과목의 모든 게시글을 가져오기
		List<SubjectPost> posts = subjectPostRepository.findBySubjectSubjectid(subjectId);

		for (SubjectPost post : posts) {
			List<PostFile> files = postFileRepository.findByPost(post);
			moveFilesToRecycleAndDeleteRecords(files); // 기존 메서드 재사용
		}
	}

	public void moveFilesByPostsAndDelete(List<SubjectPost> posts) {
		for (SubjectPost post : posts) {
			List<PostFile> files = postFileRepository.findByPost(post);
			moveFilesToRecycleAndDeleteRecords(files);
		}
		}
}
