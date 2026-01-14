import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { executeBasicAuthenticationService } from "./ApiService";

export const AdministratorAuthContext = createContext(null);
export const useAdministratorAuth = () => useContext(AdministratorAuthContext);
export function AdministratorAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [administratorName, setAdministratorName] = useState('');
  const [administratorId, setAdministratorId] = useState(
    localStorage.getItem("administratorId") || ''
  );
  const [administratorToken, setAdministratorToken] = useState(
    localStorage.getItem("administratorToken")
  );
  const [authId, setAuthId] = useState(null);
  const navigate = useNavigate();
  
  const login = async (id, password) => {
  const baToken = "Basic " + window.btoa(id + ":" + password);
  console.log("setAdministrator Basic Token:", baToken);

  try {
    const response = await executeBasicAuthenticationService(baToken);
    console.log("관리자 로그인 응답:", response.data);  // 👈 추가
    if (response.status === 200) {
      const { name, id: adminId } = response.data;
      console.log("관리자 이름:", name, "관리자 ID:", adminId); 
      localStorage.setItem("administratorToken", baToken);
      localStorage.setItem("administratorId", adminId); // 추가
      setAdministratorToken(baToken);
      setAdministratorName(name); 
      setAdministratorId(adminId); 
      setAuthId(adminId);
      setAuthenticated(true);
      navigate("/Administrator/userlist");
    } else {
      logout();
    }
  } catch (error) {
    console.error("관리자 로그인 실패", error);
    logout();
  }
};

  function getUsernameFromToken() {
  return administratorName 
}

function getUserIdFromToken() {
  return administratorId || localStorage.getItem("administratorId");
}


  const logout = () => {
    setAuthenticated(false);
    setAuthId(null);
    setAdministratorToken(null);
    localStorage.removeItem("administratorId");
    localStorage.removeItem("administratorToken");
    
    navigate("/student/login");
    console.log("교수 로그아웃 완료");
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
        getUserIdFromToken   
      }}
    >
      {children}
    </AdministratorAuthContext.Provider>
  );
}

export default AdministratorAuthContext;