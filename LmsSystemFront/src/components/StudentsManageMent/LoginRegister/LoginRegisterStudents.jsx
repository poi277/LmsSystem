import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {registersubmitApi, registerGetemailsubmitApi, StudentsRegisterApi} from "../api/ApiService"
import GuestHeader from '../UI/GuestHeader';

export default function RegisterWithEmailCode() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    department: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 인증 코드 전송
  const sendCode = async () => {
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }
    try {
      await registersubmitApi(email);
      setCodeSent(true);
      setMessage('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
      setMessage(err.response?.data || '인증 코드 전송 실패');
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!code) {
      setMessage('인증 코드를 입력해주세요.');
      return;
    }
    try {
      await registerGetemailsubmitApi(email, code);
      setEmailVerified(true);
      setMessage('이메일 인증 성공! 회원가입을 진행해주세요.');
    } catch (err) {
      setMessage(err.response?.data || '인증 코드가 올바르지 않습니다.');
    }
  };

  // 회원가입
  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!emailVerified) {
        setMessage('이메일 인증을 먼저 완료해주세요.');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        await StudentsRegisterApi(formData, email);
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/student/login');
      } catch (err) {
        setMessage(err.response?.data || '회원가입 실패');
      }
    };



  return (
    <div>
       <GuestHeader />
      <h2>학생 회원가입 (이메일 인증 코드 방식)</h2>

      <form onSubmit={handleSubmit}>

        {/* 이메일 + 인증 코드 발송 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if(emailVerified) setEmailVerified(false); // 이메일 바뀌면 인증 초기화
            }}
            required
            style={{ flexGrow: 1, marginRight: '8px' }}
            disabled={emailVerified} // 인증되면 수정 불가
          />
          <button type="button" onClick={sendCode} disabled={emailVerified}>
            인증 코드 발송
          </button>
        </div>

        {/* 인증 코드 입력 및 인증 확인 버튼 (코드 발송 후에만 노출) */}
        {codeSent && !emailVerified && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="인증 코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ flexGrow: 1, marginRight: '8px' }}
              required
            />
            <button type="button" onClick={verifyCode}>인증 확인</button>
          </div>
        )}

        {/* 인증 완료 문구 */}
        {emailVerified && (
          <p style={{ color: 'green', marginBottom: '12px' }}>
            이메일 인증이 완료되었습니다.
          </p>
        )}

        {/* 나머지 회원가입 폼 */}
        <input name="studentId" placeholder="학번" onChange={handleChange} required />
        <input name="studentName" placeholder="이름" onChange={handleChange} required />
        <input name="department" placeholder="학과" onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="비밀번호 확인" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="전화번호" onChange={handleChange} required />
        <button type="submit" style={{ marginTop: '12px' }}>회원가입</button>
      </form>

      {/* 상태 메시지 */}
      {message && <p>{message}</p>}
    </div>
  );
}
