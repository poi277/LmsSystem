// src/components/StudentsHeader.jsx
import { useContext } from "react";
import StudentAuthContext from "../api/StudentsAuthProvider";
import AuthHeader from "./AuthHeader";

export default function StudentsHeader() {
  const {
    studentsAccessToken,
    getTokenExpiration,
    getRemainingTime,
    getUsernameFromToken,
    handleTokenRefresh,
    logout
  } = useContext(StudentAuthContext);

  return (
    <AuthHeader
      accessToken={studentsAccessToken}
      getTokenExpiration={getTokenExpiration}
      getRemainingTime={getRemainingTime}
      getUsernameFromToken={getUsernameFromToken}
      handleTokenRefresh={handleTokenRefresh}
      logout={logout}
    />
  );
}
