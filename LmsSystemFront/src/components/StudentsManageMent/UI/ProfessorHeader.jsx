// src/components/ProfessorHeader.jsx
import { useContext } from "react";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import AuthHeader from "./AuthHeader";

export default function ProfessorHeader() {
  const {
    professorAccessToken,
    getTokenExpiration,
    getRemainingTime,
    getUsernameFromToken,
    handleTokenRefresh,
    logout
  } = useContext(ProfessorAuthContext);

  return (
    <AuthHeader
      accessToken={professorAccessToken}
      getTokenExpiration={getTokenExpiration}
      getRemainingTime={getRemainingTime}
      getUsernameFromToken={getUsernameFromToken}
      handleTokenRefresh={handleTokenRefresh}
      logout={logout}
    />
  );
}
