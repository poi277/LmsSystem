import React, {useEffect, createContext,useContext, useState } from "react";
import { useNavigate,useParams } from 'react-router-dom';
import { apiClient } from './ApiClient'
import {executeBasicAuthenticationService,SubjectTokenRefreshApi,StudentsTokenRefreshApi,StudentsLoginApi,StudentsSubjectRegisterLoginApi  } from './ApiService'
import axios from "axios";
export const Authcontext = createContext(null);
export const useAuth = () => useContext(Authcontext)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [studentToken, setStudentToken] = useState(localStorage.getItem("studentToken"));
  const [professorToken, setProfessorToken] = useState(localStorage.getItem("professorToken"));
  const [subjectToken, setSubjectToken] = useState(localStorage.getItem("subjectToken"));
  const [accessToken, setAccessToken] = useState(null);
  const [AuthId,setAuthId] = useState("")


  const AuthenticatedOn = () => setAuthenticated(true);
  const AuthenticatedOff = () => setAuthenticated(false);
  const navigate = useNavigate();  // 1. 여기서 호출해서 함수 받기

     // Professorauthcation.js
  async function Professorauthcation(id, password) {
  const baToken = 'Basic ' + window.btoa(id + ":" + password);
  console.log("Basic Token:", baToken);

  try {
    // 인터셉터 대신 직접 헤더로 토큰 전달
    const response = await executeBasicAuthenticationService(baToken);

    if (response.status === 200) {
      localStorage.setItem("professorToken", baToken);
      setProfessorToken(baToken);
      setAuthId(id);
      AuthenticatedOn();
      navigate("/ProfessorMain");
    } else {
      Professorlogout();
    }
  } catch (error) {
    console.error("교수 로그인 실패", error);
    Professorlogout();
  }
}




//     async function handleLoginCommon({ id, password, loginApiFunc, redirectPath,tokenKey }) {
//   try {  
//     console.log("handleLoginCommon")
//     const response = await loginApiFunc(id, password);
//     const rawToken = response.data.token;
//     const jwtToken = "Bearer " + rawToken;
//     localStorage.setItem(tokenKey, jwtToken);
//     setAuthId(id);
//     AuthenticatedOn();
//     if (tokenKey === "studentToken") {
//       setStudentToken(jwtToken);
//     } else if (tokenKey === "subjectToken") {
//       setSubjectToken(jwtToken);
//     } else if (tokenKey === "professorToken") {
//       setProfessorToken(jwtToken);
//     } else {
//       console.warn("알 수 없는 tokenKey:", tokenKey);
//     }

//     navigate(redirectPath);
//   } catch (error) {
//     logout();
//   }
// }
async function handleLoginCommon({ id, password, loginApiFunc, redirectPath, tokenKey }) {
  try {
    const accessToken = await loginApiFunc(id, password); // accessToken 문자열 직접 반환되도록 설정됨
    const jwtToken = "Bearer " + accessToken;

    localStorage.setItem(tokenKey, jwtToken); // ✅ 로컬스토리지 저장
    setAuthId(id);
    AuthenticatedOn();

    // ✅ 역할별 토큰 상태 관리
    if (tokenKey === "studentToken") {
      setStudentToken(jwtToken);
    } else if (tokenKey === "subjectToken") {
      setSubjectToken(jwtToken);
    } else if (tokenKey === "professorToken") {
      setProfessorToken(jwtToken);
    }

    navigate(redirectPath);
  } catch (error) {
    logout();
  }
}

function authcation(id, password) {
  return handleLoginCommon({
    id,
    password,
    loginApiFunc: StudentsLoginApi,
    redirectPath: "/StudentsMain",
    tokenKey: "studentToken"      // ✅ 학생 홈페이지
  });
}

function Subjectauthcation(id, password) {
  return handleLoginCommon({
    id,
    password,
    loginApiFunc: StudentsSubjectRegisterLoginApi,
    redirectPath: "/SubjectRegister",
    tokenKey: "subjectToken"      // ✅ 수강 신청
  });
}

function handleTokenRefresh() {
  const oldToken = localStorage.getItem("studentToken");

  if (!oldToken) {
    alert("토큰이 없습니다. 다시 로그인해주세요.");
    logout();
    return;
  }
  StudentsTokenRefreshApi(oldToken)
    .then((response) => {
      const rawNewToken = response.data.accessToken;  // 백엔드에 맞게 조절
      const bearerNewToken = "Bearer " + rawNewToken;
      localStorage.setItem("studentToken", bearerNewToken);  // 키 통일
      setStudentToken(bearerNewToken);
      alert("로그인이 연장되었습니다!");
    })
    .catch((error) => {
      console.error("연장 실패:", error);
      alert("로그인 연장 실패! 다시 로그인해주세요.");
      logout();
    });
}

function handleSubjectTokenRefresh() {
  const oldToken = localStorage.getItem("subjectToken");

  if (!oldToken) {
    alert("토큰이 없습니다. 다시 로그인해주세요.");
    logout();
    return;
  }
  SubjectTokenRefreshApi(oldToken)
    .then((response) => {
      const rawNewToken = response.data.accessToken;  // 백엔드에 맞게 조절
      const bearerNewToken = "Bearer " + rawNewToken;
      localStorage.setItem("subjectToken", bearerNewToken);  // 키 통일
      setSubjectToken(bearerNewToken);
      alert("로그인이 연장되었습니다!");
    })
    .catch((error) => {
      console.error("연장 실패:", error);
      alert("로그인 연장 실패! 다시 로그인해주세요.");
      logout();
    });
}


  function StudentsLogout()
    {
        logout()
        setStudentToken(null)
        localStorage.removeItem('studentToken');// 로컬스토리지에 있는 토큰 삭제
        navigate('/login')
    }
    function Professorlogout()
    {
        logout()
        setProfessorToken(null)
        localStorage.removeItem('professorToken');// 로컬스토리지에 있는 토큰 삭제
        navigate('/login')
    }
    function SubjectRegisterlogout()
    {
        logout()
        localStorage.removeItem('subjectToken');
        navigate('/SubjectLogin')
    }

  function logout()
    {  // localStorage.clear();
         setAccessToken(null);
        AuthenticatedOff()
        setAuthId(null)
        console.log("로그아웃 되셨습니다.")
    } 
    
    function getTokenExpiration(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.exp; // 초 단위 UNIX timestamp
  } catch (e) {
    return null;
  }
} 

function getRemainingTime(exp) {
  const now = Math.floor(Date.now() / 1000); // 현재 시간 (초)
  const remainingSeconds = exp - now;

  if (remainingSeconds <= 0) return "00:00";

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// 토큰에서 학생 ID 추출 함수 (필요에 따라 클레임명 변경)
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.sub || payload.id || null; // JWT 구조에 따라 맞게 바꾸세요
  } catch {
    return null;
  }
}
function getUsernameFromToken(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.studentName || payload.username || null; // JWT 구조에 맞게 수정
  } catch {
    return null;
  }
}
// useEffect(() => {
//   const storedToken = localStorage.getItem("studentToken");

//   if (!storedToken && !setAuthenticated) {
//     // studentToken 없으면 refresh 요청 시도
//     TokenRefreshApi()
//       .then((response) => {
//         const rawNewToken = response.data.accessToken;
//         const bearerToken = "Bearer " + rawNewToken;
//         localStorage.setItem("studentToken", bearerToken);
//         setStudentToken(bearerToken);
//         setAuthenticated(true);
//         console.log("🔄 학생 accessToken 자동 재발급 완료");
//       })
//       .catch((error) => {
//         console.warn("❌ 자동 토큰 재발급 실패:", error);
//         // 실패 시 logout 하거나 무시 가능
//       });
//   }
// }, []);

// useEffect(() => {
//   const storedToken = localStorage.getItem("subjectToken");

//   if (!storedToken) {
//     SubjectTokenRefreshApi()
//       .then((response) => {
//         const rawNewToken = response.data.accessToken;
//         const bearerToken = "Bearer " + rawNewToken;
//         localStorage.setItem("subjectToken", bearerToken);
//         setSubjectToken(bearerToken);
//         setAuthenticated(true);
//         console.log("🔄 수강신청 accessToken 자동 재발급 완료");
//       })
//       .catch((error) => {
//         console.warn("❌ 수강신청 토큰 재발급 실패:", error);
//       });
//   }
// }, []);

  return (
  <Authcontext.Provider
    value={{
      getTokenExpiration,
      getRemainingTime,
      getUserIdFromToken,
      getUsernameFromToken,
      AuthId,
      SubjectRegisterlogout,
      setAuthId,
      Subjectauthcation,
      Professorauthcation,
      Professorlogout,
      authenticated,
      AuthenticatedOn,
      AuthenticatedOff,
      setAuthenticated,
      authcation,
      studentToken,
      professorToken,
      subjectToken,
      StudentsLogout,
      handleTokenRefresh,
      handleSubjectTokenRefresh,
    }}
  >
    {children}
  </Authcontext.Provider>
);
}

export default Authcontext;
