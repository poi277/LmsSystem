import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminGetUserDetailApi, adminUserDeleteApi } from '../api/ApiService';
import AdminSidebar from '../UI/AdminSidebar'
import AdminHeader from "../UI/AdministratorHeader";
export default function AdministratorUserDetails() {
  const { role, id } = useParams();
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState(null);

  const handleEdit = (user) => {
    navigate(`/Administrator/useredit/${role.toLowerCase()}/${id}`);
  };

  const handlepasswordEdit = (user) => {
    navigate(`/Administrator/passwordedit/${role.toLowerCase()}/${id}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`${user.name} (${user.role}) 을 정말 삭제하시겠습니까?`)) {
      adminUserDeleteApi(user.id, user.role)
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/Administrator/userlist"); 
        })
        .catch(err => {
          alert("삭제 실패");
          console.error(err);
        });
    }
  };

  useEffect(() => {
    adminGetUserDetailApi(id, role)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("유저 정보 조회 실패:", error);
      });
  }, [id, role]);

  if (!userInfo) return <div>Loading...</div>;

  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    {/* 헤더 */}
    <div style={{ flex: '0 0 60px' }}>
      <AdminHeader />
    </div>

    {/* 본문: 사이드바 + 오른쪽 정보 영역 */}
    <div style={{ flex: 1, display: 'flex' }}>
      {/* 사이드바 */}
      <div style={{ width: '200px' }}>
        <AdminSidebar />
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2>{userInfo.role} 정보</h2>
        <p>ID: {userInfo.id}</p>
        <p>이름: {userInfo.name}</p>
        <p>학과: {userInfo.department}</p>
        <p>연락처: {userInfo.phoneNumber}</p>
        <p>이메일: {userInfo.email}</p>
        <p>직위: {userInfo.position ?? ""}</p>
        <p>연구실 위치: {userInfo.officeLocation ?? ""}</p>
        <p>최대 수강 가능 시간: {userInfo.maxGradeHour !== 0 ? userInfo.maxGradeHour : ""}</p>

        <div>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(userInfo); }}
            style={{ marginRight: '5px' }}
          >
            ✏ 수정
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handlepasswordEdit(userInfo); }}
            style={{ color: 'red' }}
          >
            비밀번호 변경
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(userInfo); }}
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
