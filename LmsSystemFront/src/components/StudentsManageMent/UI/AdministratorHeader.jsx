import { useContext } from "react";
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "./AuthHeader";

export default function AdministratorHeader() {
  const {
    administratorToken,
    getTokenExpiration,
    getRemainingTime,
    getUsernameFromToken,
    handleTokenRefresh,
    logout
  } = useContext(AdministratorAuthContext);

  return (
    <AuthHeader
      accessToken={administratorToken}
      getTokenExpiration={getTokenExpiration}
      getRemainingTime={getRemainingTime}
      getUsernameFromToken={getUsernameFromToken}
      handleTokenRefresh={handleTokenRefresh}
      logout={logout}
    />
  );
}
