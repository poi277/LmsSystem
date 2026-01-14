import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfessorLoginApi, ProfessorTokenRefreshApi } from "./ApiService";

const ProfessorAuthContext = createContext();
export const useProfessorAuth = () => useContext(ProfessorAuthContext);

export function ProfessorAuthProvider({ children }) {
  const [professorAccessToken, setProfessorAccessToken] = useState(localStorage.getItem("professorToken"));
  const [authenticated, setAuthenticated] = useState(false);
  const [authId, setAuthId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (professorAccessToken) {
      ProfessorTokenRefreshApi(professorAccessToken)
        .then((response) => {
          const rawNewToken = response.data.accessToken;
          const bearerToken = "Bearer " + rawNewToken;
          localStorage.setItem("professorToken", bearerToken);
          setProfessorAccessToken(bearerToken);
          setAuthenticated(true);
          console.log("🔄 교수 accessToken 자동 재발급 완료");
        })
        .catch((error) => {
          console.warn("❌ 자동 토큰 재발급 실패:", error);
        });
    }
  }, []);

  const login = async (id, password) => {
    try {
      const accessToken = await ProfessorLoginApi(id, password);
      const jwtToken = "Bearer " + accessToken;
      localStorage.setItem("professorToken", jwtToken);
      setProfessorAccessToken(jwtToken);
      setAuthId(id);
      setAuthenticated(true);
      navigate("/professor/main");
      const roles = getRolesFromToken(jwtToken);
      console.log("✅ 로그인한 교수의 roles:", roles);
    } catch (error) {
      console.error("교수 로그인 실패:", error);
      logout(); // 로그인 실패 시 로그아웃 처리
      throw error;
    }
  };

  const logout = () => {
    setProfessorAccessToken(null);
    localStorage.removeItem("professorToken")
    setAuthenticated(false);
    setAuthId(null);
    navigate("/professor/login");
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
    const oldToken = localStorage.getItem("professorToken");

    if (!oldToken) {
      alert("토큰이 없습니다. 다시 로그인해주세요.");
      logout();
      return;
    }
    ProfessorTokenRefreshApi(oldToken)
      .then((response) => {
        const rawNewToken = response.data.accessToken;
        const bearerNewToken = "Bearer " + rawNewToken;
        localStorage.setItem("professorToken", bearerNewToken);
        setProfessorAccessToken(bearerNewToken);
        alert("로그인이 연장되었습니다!");
      })
      .catch((error) => {
        console.error("연장 실패:", error);
        alert("로그인 연장 실패! 다시 로그인해주세요.");
        logout();
      });
  }

  function getRemainingTime(exp) {
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = exp - now;

    if (remainingSeconds <= 0) return "00:00";

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }


  function decodeJwtPayload(base64) {
  try {
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("디코딩 오류:", e);
    return {};
  }
}
function getUsernameFromToken(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = decodeJwtPayload(payloadBase64);
    return payload.professorName || payload.username || null;
  } catch {
    return null;
  }
}
  function getUserIdFromToken(token) {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload.sub || payload.id || null;
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
    <ProfessorAuthContext.Provider
      value={{
        professorAccessToken,
        authenticated,
        handleTokenRefresh,
        login,
        logout,
        authId,
        getUserIdFromToken,
        getUsernameFromToken,
        getRemainingTime,
        getTokenExpiration,
      }}
    >
      {children}
    </ProfessorAuthContext.Provider>
  );
}

export default ProfessorAuthContext;
