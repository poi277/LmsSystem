// src/components/AdminSidebar.jsx
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div style={{
      width: '200px',
      borderRight: '1px solid #ccc',
      padding: '10px'
    }}>
      <h3>📁 카테고리</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        <li><Link to="/Administrator/userlist"> 유저</Link></li>
        <li><Link to="/Administrator/subjectlist">과목</Link></li>
        <li><Link to="/Administrator/professorregister">교수 생성</Link></li>
        <li><Link to="/Administrator/subjectregister">과목 생성</Link></li>
      </ul>
    </div>
  );
}
