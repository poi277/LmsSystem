import React, { useState, useEffect } from 'react';
import { adminresetPasswordApi } from "../api/ApiService";
import { useParams } from 'react-router-dom';
import AdminSidebar from '../UI/AdminSidebar'

export default function AdminPasswordReset() {
  const { id, role } = useParams(); // URL에서 id, role 가져오기
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await adminresetPasswordApi(id, role, newPassword);
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    } catch (err) {
      setMessage(err.response?.data || "비밀번호 변경 실패");
    }
  };

  return (
    <div>
          <AdminSidebar />
          
      <h2>비밀번호 초기화</h2>
      <p><strong>대상 ID:</strong> {id}</p>
      <p><strong>역할:</strong> {role}</p>

      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>비밀번호 변경</button>

      {message && <p>{message}</p>}
    </div>
  );
}
