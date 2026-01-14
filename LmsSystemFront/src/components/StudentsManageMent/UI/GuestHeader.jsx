// src/components/StudentsHeader.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

export default function GuestHeader() {
  const navigate = useNavigate();

  function StudentLink() {
    navigate('/student/login');
  }

  function ProfessorLink() {
    navigate('/professor/login');
  }

  function AdminLink() {
    navigate('/Administrator/login');
  }

  function SubjectLink() {
    navigate('/subject/login');
  }

  function RegisterLink() {
    navigate('/register/signup');
  }

  function FindAccountLink() {
    navigate('/find/select');
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#f0f0f0",
      borderBottom: "1px solid #ccc"
    }}>
      <div>
        <button onClick={AdminLink} style={{ marginLeft: "10px" }}>관리자로그인</button>
        <button onClick={StudentLink} style={{ marginLeft: "10px" }}>학생로그인</button>
        <button onClick={ProfessorLink} style={{ marginLeft: "10px" }}>교수로그인</button>
        <button onClick={SubjectLink} style={{ marginLeft: "10px" }}>수강신청 로그인</button>
        <button onClick={RegisterLink} style={{ marginLeft: "10px" }}>회원가입</button>
        <button onClick={FindAccountLink} style={{ marginLeft: "10px" }}>아이디 비밀번호 찾기</button>
      </div>
    </div>
  );
}
