import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link 추가
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import { adminUserListApi } from '../api/ApiService';
import AdminSidebar from '../UI/AdminSidebar'
import AdminHeader from '../UI/AdministratorHeader'
import '../css/AdministratoruserListCss.css';

export default function AdministratorUserList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentname, setStudentname] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const { logout } = useContext(AdministratorAuthContext);

  const handleDetail = (user) => {
    navigate(`/Administrator/userdetail/${user.role.toLowerCase()}/${user.id}`);
  };

  useEffect(() => {
    adminUserListApi()
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch(error => {
        console.error("에러 발생:", error);
        if (error.response?.status === 403) {
          alert("권한이 없습니다. 로그인 다시 시도하세요.");
          logout();
        }
      });
  }, []);

    useEffect(() => {
      let filtered = students;

      if (studentname) {
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(studentname.toLowerCase())
        );
      }

      if (selectedRole) {
        filtered = filtered.filter(user =>
          user.role === selectedRole
        );
      }
      setFilteredStudents(filtered);
    }, [studentname, selectedRole, students]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 헤더 */}
      <div style={{ flex: '0 0 60px' }}>
        <AdminHeader />
      </div>

      {/* 본문 (사이드바 + 콘텐츠) */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 사이드바 */}
        <div style={{ width: '200px' }}>
          <AdminSidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h2>📋 관리자 권한</h2>
          <p>🔎 등록되어있는 유저 목록</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="이름으로 검색"
              value={studentname}
              onChange={(e) => setStudentname(e.target.value)}
              style={{ padding: "5px", width: "200px" }}
            />
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ padding: "5px" }}
            >
              <option value="">전체</option>
              <option value="STUDENT">학생</option>
              <option value="PROFESSOR">교수</option>
            </select>
          </div>

          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>이름</th>
                <th>아이디</th>
                <th>역할</th>
                <th>학과</th>
                <th>직책</th>
                <th>이메일</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((user, index) => (
                <tr
                  key={index}
                  className="user-row"
                  onClick={() => handleDetail(user)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.role}</td>
                  <td>{user.department || '-'}</td>
                  <td>{user.position || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phoneNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
