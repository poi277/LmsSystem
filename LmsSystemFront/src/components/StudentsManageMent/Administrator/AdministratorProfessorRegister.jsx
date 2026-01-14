import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCreateProfessorApi } from "../api/ApiService"; // 🔸 API 따로 구현 필요
import AdminSidebar from '../UI/AdminSidebar'
import AdminHeader from '../UI/AdministratorHeader'

export default function AdministratorProfessorRegister() {
  const [formData, setFormData] = useState({
  professorId: '',
  password: '',
  professorName: '',
  department: '',
  email: '',
  phoneNumber: '',
  position: '',
  officeLocation: '',
  role: 'PROFESSOR', // 필요하다면
});


  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // 필수 값 확인
    const { professorId, password, professorName, department } = formData;
        if (!professorId || !password || !professorName || !department) {
        setMessage("아이디, 비밀번호, 이름, 학과는 필수입니다.");
        return;
        }


    adminCreateProfessorApi(formData)
      .then(() => {
        setMessage("교수 등록이 완료되었습니다.");
        navigate("/Administrator/userlist"); // 등록 후 목록으로 이동
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data || "교수 등록 실패");
      });
  };

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

      {/* 오른쪽 콘텐츠 영역 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2>교수 등록</h2>
        {message && <div>{message}</div>}
        <div>
          <div>아이디: <input name="professorId" value={formData.professorId} onChange={handleChange} /></div>
          <div>비밀번호: <input name="password" type="password" value={formData.password} onChange={handleChange} /></div>
          <div>이름: <input name="professorName" value={formData.professorName} onChange={handleChange} /></div>
          <div>학과: <input name="department" value={formData.department} onChange={handleChange} /></div>
          <div>이메일: <input name="email" value={formData.email} onChange={handleChange} /></div>
          <div>전화번호: <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /></div>
          <div>직책: <input name="position" value={formData.position} onChange={handleChange} /></div>
          <div>사무실 위치: <input name="officeLocation" value={formData.officeLocation} onChange={handleChange} /></div>

          <button onClick={handleSubmit}>등록</button>
          <button onClick={() => navigate("/Administrator/userlist")}>취소</button>
        </div>
      </div>
    </div>
  </div>
  );
}
