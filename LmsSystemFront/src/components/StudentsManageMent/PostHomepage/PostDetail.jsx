import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { PostOneApi, PostDeleteApi,getCommentsApi,addCommentApi,updatePostCommentApi,deletePostCommentApi,filePostFindApi,filedownloadApi } from "../api/ApiService";
import StudentAuthContext from "../api/StudentsAuthProvider";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "../UI/AuthHeader";
import PostHomePageSidebar from "../UI/PostHomePageSidebar";
export default function PostDetail({ role }) {
  const { postId, subjectId,subjectCategory } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);

  // 역할 기반으로 context 선택
  const studentContext = useContext(StudentAuthContext);
  const professorContext = useContext(ProfessorAuthContext);
  const adminContext = useContext(AdministratorAuthContext);
  const context =
  role === 'STUDENT'
    ? studentContext
    : role === 'PROFESSOR'
    ? professorContext
    : adminContext;

  const {
    studentsAccessToken,
    professorAccessToken,
    administratorToken,
    getUserIdFromToken
  } = context;

  const accessToken =
    role === 'STUDENT'
      ? studentsAccessToken
      : role === 'PROFESSOR'
      ? professorAccessToken
      : administratorToken;
  const userId = getUserIdFromToken(accessToken);

  const [post, setPost] = useState(null);

  useEffect(() => {
    PostOneApi(role, postId)
      .then((res) => { setPost(res.data);
      })
      .catch(console.error);
    getCommentsApi(role, postId)
    .then(res => {
      console.log("댓글 API 응답:", res.data);
      setComments(res.data);
    })
     filePostFindApi(role,postId)
    .then(res => setAttachedFiles(res.data))
    .catch(err => console.error("파일 조회 실패:", err));
  }, [postId]);

  const handleDelete = async () => {
    const confirmed = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await PostDeleteApi(role, postId);
      alert("글이 삭제되었습니다.");
      navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}`);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDownload = async (fileId, fileName) => {
  try {
    const response = await filedownloadApi(role, fileId, accessToken);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // 다운로드될 파일명 지정
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
  }
};



  const handleUpdate = () => {
    navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}/post/${postId}/update`);
  };

  const handleBack = () => {
    navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}`);
  };

  const handleCommentSubmit = async () => {
  if (!newComment.trim()) return alert("댓글을 입력해주세요.");
  try {
    await addCommentApi(role, postId, {
      content: newComment,
      authorId: userId,
      authorType: role,
    });
    setNewComment("");
    const res = await getCommentsApi(role, postId);
    console.log("댓글 API 응답:", res.data);
    setComments(res.data); 
  } catch (error) {
    console.error("댓글 등록 또는 조회 실패:", error);
    alert("댓글 처리 중 오류가 발생했습니다.");
  }
};
const handleCommentEdit = (commentId, currentContent) => {
  const updated = prompt("댓글을 수정하세요", currentContent);
  if (updated && updated.trim()) {
    // 댓글 수정 API 호출
    updatePostCommentApi(role, commentId, {
      content: updated,
      authorId: userId,
      authorType: role,
      id : commentId,
    })
    .then(() => getCommentsApi(role, postId))
    .then(res => setComments(res.data))
    .catch(err => {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 중 오류 발생");
    });
  }
};

const handleCommentDelete = (commentId) => {
  const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
  if (!confirmed) return;

  deletePostCommentApi(role, commentId)
    .then(() => getCommentsApi(role, postId))
    .then(res => setComments(res.data))
    .catch(err => {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제 중 오류 발생");
    });
};


  return post ? (
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
      <h2>{post.title}</h2> 
      {/* 파일 목록 출력 */}
            {attachedFiles.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4>첨부 파일</h4>
                <ul>
                  {attachedFiles.map((file) => (
                    <li key={file.id}>
                      <span
                        onClick={() => handleDownload(file.id, file.fileName)}
                        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {file.fileName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
      <p><strong>카테고리:</strong> {post.category}</p>
      <p>
          <strong>작성자:</strong>{" "}
          {post.role === 'PROFESSOR'
            ? '[교수] '
            : post.role === 'ADMINISTRATOR'
            ? '[관리자] '
            : ''}
          {post.authorName}
        </p>
      <p><strong>작성일:</strong> {new Date(post.createdDate).toLocaleString()}</p>
      <hr />
      <p>{post.content}</p>

      
      <hr />

      {/* 작성자 본인일 때만 버튼 노출 */}
              {post.authorId === userId && (
          <div>
            <button onClick={handleUpdate} style={{ marginTop: "20px", padding: "8px 12px" }}>
              수정
            </button>
            <button onClick={handleDelete} style={{ marginTop: "20px", padding: "8px 12px" }}>
              삭제
            </button>
          </div>
        )}


      <button onClick={handleBack} style={{ marginTop: "20px", padding: "8px 12px" }}>
        뒤로가기
      </button>

        <hr />
       <h3>댓글</h3>
            <div>
              {comments.map((c) => (
                <div key={c.id} style={{ marginBottom: "12px", borderBottom: "1px solid #ccc", paddingBottom: "8px" }}>
                  <strong>
                  {c.authorType === 'PROFESSOR' ? '[교수] ' : c.authorType === 'ADMINISTRATOR' ? '[관리자] ' : ''}
                  {c.authorName}
                </strong> 
                <small>{new Date(c.createdDate).toLocaleString()}</small>

                  <p>{c.content}</p>  

                  {/* 댓글 작성자 본인일 때만 수정/삭제 버튼 보이게 */}
                  {Number(c.authorId) === Number(userId) && (
                    <div>
                      <button onClick={() => handleCommentEdit(c.id, c.content)} style={{ marginRight: "8px" }}>수정</button>
                      <button onClick={() => handleCommentDelete(c.id)}>삭제</button>
                    </div>
                  )}
                </div>
              ))}

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                rows="3"
                style={{ width: "100%", marginTop: "10px" }}
              />
              <button onClick={handleCommentSubmit} style={{ marginTop: "8px" }}>
                댓글 작성
              </button>
            </div>
    </div>
    </div>
     </div>
  ) : (
    <p>로딩 중...</p>
  );
}
