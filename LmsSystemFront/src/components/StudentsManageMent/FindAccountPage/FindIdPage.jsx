import React, { useState } from 'react';
import axios from 'axios';
import {SendMailCodeApi,GetMailCodeApi} from "../api/ApiService"
import GuestHeader from '../UI/GuestHeader'; 

export default function FindIdPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [foundId, setFoundId] = useState('');

  // 1단계: 이메일로 인증 코드 요청
  const requestVerificationCode = async (e) => {
    e.preventDefault();
    try {
      await SendMailCodeApi(email);
      setMessage('인증 코드가 이메일로 발송되었습니다.');
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data || '코드 전송 실패');
    }
  };

  // 2단계: 인증 코드 입력 후 검증 및 아이디 가져오기
  const verifyCodeAndFindId = async (e) => {
    e.preventDefault();
    try {
      const res = await GetMailCodeApi(email, code);
      setFoundId(res.data); // 서버에서 아이디 문자열을 바로 응답
      setMessage('');
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data || '인증 실패');
    }
  };

  return (
    <div>
        <GuestHeader />

    <div style={{ padding: '20px' }}>
      <h2>아이디 찾기</h2>

      {step === 1 && (
        <form onSubmit={requestVerificationCode}>
          <input
            type="email"
            placeholder="가입한 이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">인증 코드 발송</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyCodeAndFindId}>
          <input
            type="text"
            placeholder="이메일로 받은 인증 코드 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit">코드 인증</button>
        </form>
      )}

      {step === 3 && (
        <div>
          <p>당신의 아이디는 <strong>{foundId}</strong> 입니다.</p>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
   </div>
  );
}
