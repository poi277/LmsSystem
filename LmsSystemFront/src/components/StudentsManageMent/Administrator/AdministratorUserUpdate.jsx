import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetUserDetailApi,
  adminUserUpdateApi,
} from '../api/ApiService';
import AdminSidebar from '../UI/AdminSidebar'

export default function AdministratorUserUpdate() {
  const { id, role } = useParams(); // id와 role 추출
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    position: '',
    phoneNumber: '',
    email: '',
    officeLocation: '',
    maxGradeHour: '',
    role: '',
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // 🔹 정보 불러오기
  useEffect(() => {
    adminGetUserDetailApi(id, role)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("사용자 정보를 불러오지 못했습니다.");
      });
  }, [id, role]);

  // 🔹 input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 업데이트 처리
  const handleUpdate = () => {
    if (!formData.name || !formData.department || !formData.role) {
      setMessage("필수 항목을 모두 입력해주세요.");
      return;
    }

    adminUserUpdateApi(formData)
      .then(() => {
        setMessage("수정이 완료되었습니다.");
        navigate(`/Administrator/userdetail/${formData.role.toLowerCase()}/${formData.id}`)
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data || "수정 실패");
      });
  };

  return (
    <div>
       <AdminSidebar />

      <h2>User Update</h2>
      {message && <div>{message}</div>}
      <div>
        <div>아이디: <input name="id" value={formData.id} disabled /></div>
        <div>이름: <input name="name" value={formData.name} onChange={handleChange} /></div>
        <div>학과: <input name="department" value={formData.department} onChange={handleChange} /></div>
        <div>전화번호: <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /></div>
        <div>이메일: <input name="email" value={formData.email} onChange={handleChange} /></div>
        <div>직책:
          <input
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={formData.role === "STUDENT"} // 학생이면 비활성화
          />
        </div>
        <div>사무실 위치:
          <input
            name="officeLocation"
            value={formData.officeLocation}
            onChange={handleChange}
            disabled={formData.role === "STUDENT"} // 학생이면 비활성화
          />
        </div>
        <div>최대학점:
          <input
            name="maxGradeHour"
            value={formData.maxGradeHour}
            onChange={handleChange}
            disabled={formData.role === "PROFESSOR"} // 교수면 비활성화
          />
        </div>

        <div>역할: <input name="role" value={formData.role} disabled /></div>

        <button onClick={handleUpdate}>수정</button>
        <button onClick={() => navigate(`/Administrator/userdetail/${formData.role.toLowerCase()}/${formData.id}`)}>뒤로</button>
      </div>
    </div>
  );
}
