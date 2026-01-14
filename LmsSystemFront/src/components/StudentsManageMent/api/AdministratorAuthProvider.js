import { createContext, useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLoginApi,AdministratorTokenRefreshApi } from "./ApiService";

export const AdministratorAuthContext = createContext(null);
export const useAdministratorAuth = () => useContext(AdministratorAuthContext);
export function AdministratorAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [administratorToken, setAdministratorToken] = useState(
    localStorage.getItem("administratorToken")
  );
  const [authId, setAuthId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      if (administratorToken) {

        AdministratorTokenRefreshApi(administratorToken)
          .then((response) => {
            const rawNewToken = response.data.accessToken;
            const bearerToken = "Bearer " + rawNewToken;
            localStorage.setItem("administratorToken", bearerToken);
            setAdministratorToken(bearerToken);
            setAuthenticated(true);
            console.log("🔄 관리자 accessToken 자동 재발급 완료");
          })
          .catch((error) => {
            console.warn("❌ 자동 토큰 재발급 실패:", error);
          });
      }
    }, []);
  
  
  const login = async (id, password) => {
  try {
    const accessToken = await AdminLoginApi(id, password); // 이게 { accessToken, name, id } 를 반환해야 함
    const jwtToken = "Bearer " + accessToken;
    localStorage.setItem("administratorToken", jwtToken);
    setAdministratorToken(jwtToken);
    setAuthenticated(true);
    setAuthId(id);
    const roles = getRolesFromToken(jwtToken);
     console.log("✅ 로그인한 사람의 roles:", roles);
    navigate("/Administrator/userlist");
  } catch (error) {
    console.error("관리자 로그인 실패", error);
    logout();

    throw error;
  }
};


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
function handleTokenRefresh() {
  const oldToken = localStorage.getItem("administratorToken");

  if (!oldToken) {
    alert("토큰이 없습니다. 다시 로그인해주세요.");
    logout();
    return;
  }
  AdministratorTokenRefreshApi(oldToken)
    .then((response) => {
      const rawNewToken = response.data.accessToken;  // 백엔드에 맞게 조절
      const bearerNewToken = "Bearer " + rawNewToken;
      localStorage.setItem("administratorToken", bearerNewToken);  // 키 통일
      setAdministratorToken(bearerNewToken);
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
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = exp - now;

    if (remainingSeconds <= 0) return "00:00";

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }



 function getUsernameFromToken(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = decodeJwtPayload(payloadBase64);
    return payload.adminName  || payload.username || null;
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


  const logout = () => {
    setAuthenticated(false);
    setAuthId(null);
    setAdministratorToken(null);
    localStorage.removeItem("administratorToken");
    
    
    navigate("/Administrator/login");
    console.log("어드민 로그아웃 완료");
  };

  return (
    <AdministratorAuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        authId,
        setAuthId,
        administratorToken,
        setAdministratorToken,
        login,
        logout,
        getUsernameFromToken, 
        getUserIdFromToken,
        handleTokenRefresh,
        getRolesFromToken,
        getTokenExpiration,
        getRemainingTime
      }}
    >
      {children}
    </AdministratorAuthContext.Provider>
  );
}

export default AdministratorAuthContext;