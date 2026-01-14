// src/components/AdminSidebar.jsx
import { Link } from "react-router-dom";

export default function ProfessorSidebar() {
  return (
    <div style={{
      width: '200px',
      borderRight: '1px solid #ccc',
      padding: '10px'
    }}>
      <h3>📁 카테고리</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        <li><Link to="/professor/main"> 메인 홈페이지</Link></li>
        <li><Link to="/professor/myinfo"> 내 정보</Link></li>
        <li><Link to="/professor/passwordChange"> 비밀번호 변경</Link></li>
      </ul>
    </div>
  );
}
