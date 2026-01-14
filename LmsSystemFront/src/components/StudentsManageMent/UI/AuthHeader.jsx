// src/components/AuthHeader.jsx
import { useEffect, useState } from "react";

export default function AuthHeader({
  accessToken,
  getTokenExpiration,
  getRemainingTime,
  getUsernameFromToken,
  handleTokenRefresh,
  logout
}) {
  const username = getUsernameFromToken(accessToken);
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const exp = getTokenExpiration(accessToken);
    if (!exp) return;

    setRemainingTime(getRemainingTime(exp));

    const interval = setInterval(() => {
      const timeLeft = getRemainingTime(exp);
      setRemainingTime(timeLeft);

      if (timeLeft === "00:00") {
        clearInterval(interval);
        alert("로그인 시간이 만료되었습니다.");
        logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [accessToken, logout]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#f0f0f0",
      borderBottom: "1px solid #ccc"
    }}>
      <div>
        안녕하세요 <strong>{username}</strong> 님!
      </div>
      <div>
        남은 로그인 시간: <strong>{remainingTime}</strong>
        <button onClick={handleTokenRefresh} style={{ marginLeft: "10px" }}>로그인 연장</button>
        <button onClick={logout} style={{ marginLeft: "10px" }}>로그아웃</button>
      </div>
    </div>
  );
}
