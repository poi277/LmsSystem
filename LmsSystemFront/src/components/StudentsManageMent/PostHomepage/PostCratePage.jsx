import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { PostRegisterdApi,fileUploadapi } from '../api/ApiService';
import { useRef } from "react";
import axios from 'axios';
import StudentAuthContext from "../api/StudentsAuthProvider";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "../UI/AuthHeader";
import PostHomePageSidebar from "../UI/PostHomePageSidebar";

export default function PostCratePage({ role }) {
  const { subjectId,subjectCategory } = useParams();
  const navigate = useNavigate();

  const studentContext = useContext(StudentAuthContext);
  const professorContext = useContext(ProfessorAuthContext);
  const adminContext = useContext(AdministratorAuthContext);

  const context =
    role === 'STUDENT'
      ? studentContext
      : role === 'PROFESSOR'
      ? professorContext
      : adminContext;

    const categoryMap = {
      classroom: '강의실',
      freepost: '자유게시판',
      notice: '공지사항',
      QnA: '질문과 답변',
      acaive: '자료실',
      assignment: '과제제출',
    };

    const createcategory = categoryMap[subjectCategory] || '';


  const {
    studentsAccessToken,
    professorAccessToken,
    administratorToken,
    getUserIdFromToken,
  } = context;

  const accessToken =
    role === 'STUDENT'
      ? studentsAccessToken
      : role === 'PROFESSOR'
      ? professorAccessToken
      : administratorToken;

  const userId = getUserIdFromToken(accessToken);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('1주차');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  
      useEffect(() => {
      if (subjectCategory !== 'classroom') {
        setCategory(createcategory);
      }
    }, [subjectCategory]);


      const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);

      // 기존 files에 누적 (중복 제거는 필요시 추가)
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      // input 초기화: 동일 파일 다시 선택 가능하도록
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

      const handleRemoveFile = (index) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);

      // 선택된 파일 중 마지막 하나를 삭제하면 input도 초기화
      if (newFiles.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };


  const uploadFiles = async (postId) => {
  const uploadPromises = files.map(async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", postId);
      return await fileUploadapi(role, formData);
    } catch (error) {
      console.error(`파일 업로드 실패: ${file.name}`, error);
      throw error; // 전체 Promise.all 실패를 위해 던짐
    }
  });

  return Promise.all(uploadPromises); // 여기서 전부 실패/성공 감지
};


  const handleSubmit = async () => {
  const confirmSubmit = window.confirm("정말로 글을 등록하시겠습니까?");
  if (!confirmSubmit) return;

  try {
    const postData = {
      title,
      category,
      content,
      createdDate: new Date().toISOString(),
      subjectId,
      role,
      [`${role.toLowerCase()}Id`]: userId
    };

    const response = await PostRegisterdApi(role, postData);    
    const postId = response.data.postId;

    if (files.length > 0) {
      await uploadFiles(postId);
    }

    alert("글이 성공적으로 저장되었습니다!");
    navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}`);
  } catch (error) {
    console.error("등록 실패:", error);
    alert(error.response?.data || "에러 발생");
  }
};
const handleBack = () => {
  const confirmBack = window.confirm("정말로 뒤로 가시겠습니까? 작성한 내용은 저장되지 않습니다.");
  if (confirmBack) {
    navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}`);
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
        <div style={{ padding: '20px' }}>
          <h2>글 작성</h2>

          <div>
            <label>카테고리: </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '200px', padding: '5px', marginBottom: '10px' }}
            >
              {subjectCategory === 'classroom' ? (
                // classroom일 경우 여러 주차 옵션 제공
                <>
                  <option value="1주차">1주차</option>
                  <option value="2주차">2주차</option>
                  <option value="3주차">3주차</option>
                  <option value="4주차">4주차</option>
                  <option value="5주차">5주차</option>
                  {/* 필요에 따라 더 추가 가능 */}
                </>
              ) : (
                // 그 외 카테고리는 하나의 기본 옵션만 제공
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
                style={{ width: '400px', padding: '8px', marginBottom: '15px', fontSize: '16px' }}
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
              style={{ resize: 'none', padding: '10px', fontSize: '16px' }}
            />
          </div>

          {/* 숨겨진 실제 input */}
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {/* 커스텀 버튼 역할의 label */}
        <label
          htmlFor="file-upload"
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          📎 파일 선택
        </label>


        {files.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <ul>
              {files.map((file, index) => (
                <li key={index} style={{ marginTop: '5px' }}>
                  {file.name}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    style={{
                      marginLeft: '10px',
                      color: 'white',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}


          
          <button onClick={handleSubmit} style={{ marginTop: '15px' }}> 글 등록</button>
          <button onClick={handleBack} style={{ marginTop: '20px', padding: '8px 12px' }}> 뒤로가기</button>

        </div>
      </div>
    </div>
  );
}
