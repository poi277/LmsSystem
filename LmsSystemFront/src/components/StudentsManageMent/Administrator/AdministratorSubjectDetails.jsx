import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../UI/AdminSidebar";
import { adminSubjectDetailApi,adminSubjectDeleteApi } from "../api/ApiService"; 
import AdminHeader from "../UI/AdministratorHeader";
export default function AdministratorSubjectDetails() {
  const { subjectId } = useParams(); // URL에서 subjectid 추출
  const [subjectInfo, setSubjectInfo] = useState(null);
  const navigate = useNavigate(); 

  const handleEdit = () => { 
      navigate(`/Administrator/subjectlist/update/${subjectId}`);
    };
  const handlePost = (id) => {
    navigate(`/Administrator/subject/classroom/${id}`);
  };
  
    const handleDelete = (subjectInfo) => {
      if (window.confirm(`${subjectInfo.professorName} (${subjectInfo.subject}) 을 정말 삭제하시겠습니까?`)) {
        adminSubjectDeleteApi(subjectInfo.subjectid)
          .then(() => {
            alert("삭제되었습니다.");
            navigate("/Administrator/subjectlist"); 
          })
          .catch(err => {
            alert("삭제 실패");
            console.error(err);
          });
      }
    };


  useEffect(() => {
    adminSubjectDetailApi(subjectId)
      .then((response) => {
        setSubjectInfo(response.data);
      })
      .catch((error) => {
        console.error("과목 정보 조회 실패:", error);
      });
  }, [subjectId]);

  if (!subjectInfo) return <div>로딩 중...</div>;

  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    {/* 상단 헤더 */}
    <div style={{ flex: '0 0 60px' }}>
      <AdminHeader />
    </div>

    {/* 본문: 좌측 사이드바 + 오른쪽 콘텐츠 */}
    <div style={{ flex: 1, display: 'flex' }}>
      {/* 좌측 사이드바 */}
      <div style={{ width: '200px' }}>
        <AdminSidebar />
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2>과목 상세 정보</h2>
        <p> 과목명: {subjectInfo.subject}</p>
        <p> 과목 ID: {subjectInfo.subjectid}</p>
        <p> 학과/분반: {subjectInfo.departmentClass}</p>
        <p> 수업 시간: {subjectInfo.startHour}시 ~ {subjectInfo.endHour}시</p>
        <p> 요일: {subjectInfo.classday}</p>
        <p> 수업 시간(단위): {subjectInfo.gradeHour}시간</p>
        <p> 담당 교수: {subjectInfo.professorName}</p>
        <p> 수강 인원: {subjectInfo.currentStudentsCount} / {subjectInfo.maximumStudentsCount}</p>
        <p> 개설 연도: {subjectInfo.subjectYear}</p>
        <p> 학기: {
          subjectInfo.semester === 'FIRST' ? '1학기' :
          subjectInfo.semester === 'SECOND' ? '2학기' :
          '학기 정보 없음'
        }</p>
        <p> 상태: {
          subjectInfo.subjectStatus === 'OPEN' ? '개설중' :
          subjectInfo.subjectStatus === 'CANCELLED' ? '폐강' :
          subjectInfo.subjectStatus === 'PAUSED' ? '휴강' :
          '상태 정보 없음'
        }</p>

        <div>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(subjectInfo); }}
            style={{ marginRight: '5px' }}
          >
            ✏ 수정
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handlePost(subjectInfo.subjectid); }}
            style={{ marginRight: '5px' }}
          >
            ✏ 게시판 
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(subjectInfo); }}
            style={{ color: 'red' }}
          >
            🗑 삭제
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
