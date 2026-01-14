import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudentsLoginApi, StudentsTokenRefreshApi } from "./ApiService";

const StudentAuthContext = createContext();
export const useStudentAuth = () => useContext(StudentAuthContext);

export function StudentAuthProvider({ children }) {
  const [studentsAccessToken, setStudentsAccessToken] = useState(localStorage.getItem("studentToken"));
  const [authenticated, setAuthenticated] = useState(false);
  const [authId, setAuthId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (studentsAccessToken) {
      StudentsTokenRefreshApi(studentsAccessToken)
        .then((response) => {
          const rawNewToken = response.data.accessToken;
          const bearerToken = "Bearer " + rawNewToken;
          localStorage.setItem("studentToken", bearerToken);
          setStudentsAccessToken(bearerToken);
          setAuthenticated(true);
          console.log("🔄 학생 accessToken 자동 재발급 완료");
        })
        .catch((error) => {
          console.warn("❌ 자동 토큰 재발급 실패:", error);
        });
    }
  }, []);

  const login = async (id, password) => {
  try {
    const accessToken = await StudentsLoginApi(id, password);
    const jwtToken = "Bearer " + accessToken;
    localStorage.setItem("studentToken", jwtToken);
    setStudentsAccessToken(jwtToken);
    setAuthId(id);
    setAuthenticated(true);
    const roles = getRolesFromToken(jwtToken);
    navigate("/student/main");
  } catch (error) {
    console.error("학생 로그인 실패:", error);
    logout(); // 로그인 실패 시 로그아웃 처리
     throw error; // 이게 에러를 throw 하지 않으면 try문을 지나감
  }
};

  const logout = () => {
    setStudentsAccessToken(null);
    localStorage.removeItem("studentToken");
    setAuthenticated(false);
    setAuthId(null);
    navigate("/student/login");
  };
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
      setStudentsAccessToken(bearerNewToken);
      alert("로그인이 연장되었습니다!");
    })
    .catch((error) => {
      console.error("연장 실패:", error);
      alert("로그인 연장 실패! 다시 로그인해주세요.");
      logout();
    });
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

function getRolesFromToken(token) {

  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const jsonStr = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonStr);
    return payload.roles || payload.role || null;  // 배열이든 문자열이든 대응 가능
  } catch (e) {
    console.error("역할 추출 실패:", e);
    return null;
  }
}


  return (
    <StudentAuthContext.Provider value={{ studentsAccessToken, authenticated,handleTokenRefresh,login, logout, authId,getUserIdFromToken,getUsernameFromToken,getRemainingTime,getTokenExpiration }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export default StudentAuthContext;