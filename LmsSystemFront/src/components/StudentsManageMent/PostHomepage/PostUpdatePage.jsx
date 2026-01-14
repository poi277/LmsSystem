import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { PostOneApi, PostUpdateApi, fileUploadapi,filePostFindApi,fileDeleteApi  } from "../api/ApiService";
import StudentAuthContext from "../api/StudentsAuthProvider";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "../UI/AuthHeader";
import PostHomePageSidebar from "../UI/PostHomePageSidebar";

export default function PostUpdatePage({ role }) {
  const { postId, subjectId, subjectCategory } = useParams();
  const navigate = useNavigate();

  const studentContext = useContext(StudentAuthContext);
  const professorContext = useContext(ProfessorAuthContext);
  const adminContext = useContext(AdministratorAuthContext);
  const context =
    role === "STUDENT"
      ? studentContext
      : role === "PROFESSOR"
      ? professorContext
      : adminContext;

  const {
    studentsAccessToken,
    professorAccessToken,
    administratorToken,
    getUserIdFromToken,
  } = context;

  const accessToken =
    role === "STUDENT"
      ? studentsAccessToken
      : role === "PROFESSOR"
      ? professorAccessToken
      : administratorToken;
  const userId = getUserIdFromToken(accessToken);

  // 카테고리 맵 (필요하면 추가)
  const categoryMap = {
    classroom: "강의실",
    freepost: "자유게시판",
    notice: "공지사항",
    QnA: "질문과 답변",
    acaive: "자료실",
    assignment: "과제제출",
  };
  const createcategory = categoryMap[subjectCategory] || "";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(subjectCategory === "classroom" ? "1주차" : createcategory);
  const [content, setContent] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);

  // 기존 글 데이터 불러오기
  useEffect(() => {
  PostOneApi(role, postId)
    .then((res) => {
      const post = res.data;
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setCreatedDate(post.createdDate);
    })
    .catch(console.error);

  // 📁 기존 첨부파일 목록 불러오기
  filePostFindApi(role, postId)
    .then(res => {
      setExistingFiles(res.data); // 기존 첨부 파일 목록 저장
    })
    .catch(err => console.error("기존 파일 불러오기 실패:", err));  
}, [postId, role]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
    const handleMarkFileForDeletion = (fileId) => {
    // 삭제 목록에 추가
    setFilesToDelete((prev) => [...prev, fileId]);
    // UI에서도 미리 제거된 것처럼 보이게
    setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  

  // 파일 삭제 핸들러
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  // 파일 업로드 함수
  const uploadFiles = async (postId) => {
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("postId", postId);
        return await fileUploadapi(role, formData);
      } catch (error) {
        console.error(`파일 업로드 실패: ${file.name}`, error);
        throw error;
      }
    });
    return Promise.all(uploadPromises);
  };

      // 수정 완료 핸들러
      const handleUpdate = async () => {
      const confirmed = window.confirm("정말로 이 글을 수정하시겠습니까?");
      if (!confirmed) return;
      const postData = {
        postId,title, category,content,createdDate,subjectId,[`${role.toLowerCase()}Id`]: userId,};
      try {
        // 게시글 수정
        await PostUpdateApi(role, postData);
        // ✅ 삭제 예약된 파일 삭제 실행
        for (const fileId of filesToDelete) {
          await fileDeleteApi(role, fileId);
        }
        // ✅ 새 파일 업로드
        if (files.length > 0) {
          await uploadFiles(postId);
        }
        alert("글이 수정되었습니다.");
        navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}/post/${postId}`);
      } catch (err) {
        alert(err.response?.data || "에러 발생");
        console.error(err);
      }
    };



  const handleCancel = () => {
    const confirmed = window.confirm("수정을 취소하시겠습니까?");
    if (confirmed) {
      navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}/post/${postId}`);
    }
  };

  return (
    <div>
      <AuthHeader
        accessToken={accessToken}
        getTokenExpiration={context.getTokenExpiration}
        getRemainingTime={context.getRemainingTime}
        getUsernameFromToken={context.getUsernameFromToken}
        handleTokenRefresh={context.handleTokenRefresh}
        logout={context.logout}
      />
      <div>
        <PostHomePageSidebar role={role} subjectId={subjectId} />
        <div style={{ padding: "20px" }}>
          <h2>글 수정</h2>

          <div>
            <label>카테고리: </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "200px", padding: "5px", marginBottom: "10px" }}
            >
              {subjectCategory === "classroom" ? (
                <>
                  <option value="1주차">1주차</option>
                  <option value="2주차">2주차</option>
                  <option value="3주차">3주차</option>
                  <option value="4주차">4주차</option>
                  <option value="5주차">5주차</option>
                </>
              ) : (
                <option value={createcategory}>{createcategory}</option>
              )}
            </select>
          </div>

          <div>
            <label>제목: </label>
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요..."
              style={{ width: "400px", padding: "8px", marginBottom: "15px", fontSize: "16px" }}
            />
          </div>

          <div>
            <label>내용: </label>
            <br />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              cols={60}
              placeholder="내용을 입력하세요..."
              style={{ resize: "none", padding: "10px", fontSize: "16px" }}
            />
          </div>

          {/* 기존 첨부 파일 리스트 */}
          {existingFiles.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>📂 기존 첨부 파일</h4>
              <ul>
                {existingFiles.map((file) => (
                  <li key={file.id}>
                    <span>{file.fileName}</span>
                <button
                onClick={() => handleMarkFileForDeletion(file.id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
                  </li>
                ))}
              </ul>
            </div>
            )}

          {/* 숨겨진 실제 파일 input */}
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {/* 커스텀 파일 선택 버튼 */}
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >📎 파일 선택</label>

          {/* 선택한 파일 리스트 */}
          {files.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <ul>
                {files.map((file, index) => (
                  <li key={index} style={{ marginTop: "5px" }}>
                    {file.name}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        marginLeft: "10px",
                        color: "white",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleUpdate} style={{ marginTop: "15px" }}>
            수정 완료
          </button>
          <button
            onClick={handleCancel}
            style={{ marginTop: "20px", padding: "8px 12px" }}
          >
            수정 취소
          </button>
        </div>
      </div>
    </div>
  );
}
