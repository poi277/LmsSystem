import React, { useState } from 'react';
import { sendPasswordResetCodeApi, verifyPasswordResetCodeApi, resetPasswordApi } from "../api/ApiService";
import GuestHeader from '../UI/GuestHeader'; 
import { useNavigate } from "react-router-dom"

export default function PasswordResetWithEmailCode() {
  const [Id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 입력, 2: 코드 인증, 3: 비밀번호 재설정
  const [message, setMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
     if (!Id || !email) {
    setMessage("아이디와 이메일을 모두 입력해주세요.");
    return;
  }
    try {
      await sendPasswordResetCodeApi(Id, email);
      setStep(2);
      setMessage("이메일로 인증 코드를 보냈습니다.");
    } catch (err) {
      setMessage(err.response?.data || "코드 전송 실패"); 
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyPasswordResetCodeApi(Id, email, code);
      setStep(3);
      setMessage("인증 성공! 비밀번호를 재설정하세요.");
    } catch (err) {
      setMessage(err.response?.data || "인증 코드가 일치하지 않습니다.");
    }
  };

      const handleResetPassword = async () => {
      if (newPassword !== confirmPassword) {
        setMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      try {
        await resetPasswordApi(Id, newPassword,confirmPassword);
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate('/student/login');
      } catch (err) {
        setMessage(err.response?.data || "비밀번호 변경 실패");
      }
    };


  return (
    <div>
       <GuestHeader />

      <h2>비밀번호 찾기</h2>

      {step === 1 && (
        <>
          <input placeholder="아이디" value={Id} onChange={e => setId(e.target.value)} />
          <input placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={handleSendCode}>인증 코드 보내기</button>
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="인증 코드" value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleVerifyCode}>인증 확인</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>
            비밀번호 재설정
          </button>
        </>
      )}



      {message && <p>{message}</p>}
    </div>
  );
}
