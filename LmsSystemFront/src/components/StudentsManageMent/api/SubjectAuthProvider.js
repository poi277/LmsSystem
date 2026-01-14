import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudentsSubjectRegisterLoginApi, SubjectTokenRefreshApi } from "./ApiService";

const SubjectAuthContext = createContext();
export const useSubjectAuth = () => useContext(SubjectAuthContext);

export function SubjectAuthProvider({ children }) {
  const [subjectToken, setSubjectToken] = useState(localStorage.getItem("subjectToken"));
  const [authenticated, setAuthenticated] = useState(false);
  const [authId, setAuthId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (subjectToken) {
      SubjectTokenRefreshApi(subjectToken)
        .then((response) => {
          const rawNewToken = response.data.accessToken;
          const bearerToken = "Bearer " + rawNewToken;
          localStorage.setItem("subjectToken", bearerToken);
          setSubjectToken(bearerToken);
          setAuthenticated(true);
          console.log("🔄 수강신청 accessToken 자동 재발급 완료");
        })
        .catch((error) => {
          console.warn("❌ 수강신청 토큰 재발급 실패:", error);
        });
    }
  }, []);

  const login = async (id, password) => {
  try {
    const accessToken = await StudentsSubjectRegisterLoginApi(id, password);
    const jwtToken = "Bearer " + accessToken;
    localStorage.setItem("subjectToken", jwtToken);
    setSubjectToken(jwtToken);
    setAuthId(id);
    setAuthenticated(true);
    navigate("/subject/register");
  } catch (error) {
    console.error("수강신청 로그인 실패:", error);
    logout(); // 실패 시 안전하게 로그아웃
    throw error;
  }
};


  const logout = () => {
    setSubjectToken(null);
    localStorage.removeItem("subjectToken");
    setAuthenticated(false);
    setAuthId(null);
    navigate("/subject/login");
  };
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


  return (
    <SubjectAuthContext.Provider value={{ subjectToken, authenticated, login, logout, authId,
      getUsernameFromToken,getUserIdFromToken,getRemainingTime,getTokenExpiration,handleSubjectTokenRefresh
     }}>
      {children}
    </SubjectAuthContext.Provider>
  );
}

export default SubjectAuthContext;
