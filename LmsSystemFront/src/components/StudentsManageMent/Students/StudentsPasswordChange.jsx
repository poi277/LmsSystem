import { useContext, useState } from "react";
import StudentAuthContext from "../api/StudentsAuthProvider";
import { resetPasswordApi } from "../api/ApiService";
import StudentsHeader from "../UI/StudentsHeader";
import StudentsSidebar from "../UI/StudentsSidebar";

export default function StudentsPasswordChange() {
  const { studentsAccessToken, getUserIdFromToken } = useContext(StudentAuthContext);
  const studentId = getUserIdFromToken(studentsAccessToken);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!newPassword) {
      setMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await resetPasswordApi(studentId, newPassword,confirmPassword);
      setMessage("✅ 비밀번호가 성공적으로 변경되었습니다.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "비밀번호 변경 실패"));
    }
  };

  return (
    <div>
      <StudentsHeader />
      <div style={{ display: "flex" }}>
        <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
          <StudentsSidebar />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>🔐 비밀번호 변경</h2>
          {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px", gap: "10px" }}>
            <label>
              새 비밀번호:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
            <label>
              비밀번호 확인:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
            <button
              onClick={handleResetPassword}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
