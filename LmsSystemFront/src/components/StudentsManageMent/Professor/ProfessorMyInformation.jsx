// src/components/ProfessorMyInformation.jsx
import { useContext, useEffect, useState } from "react";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import {
  ProfessorFindByidDetailApi,
  registersubmitApi,
  registerGetemailsubmitApi,
  ProfessorUpdateApi
} from "../api/ApiService";
import ProfessorSidebar from "../UI/ProfessorSidebar";
import ProfessorHeader from "../UI/ProfessorHeader";

export default function ProfessorMyInformation() {
  const { professorAccessToken, getUserIdFromToken } = useContext(ProfessorAuthContext);
  const [formData, setFormData] = useState({
    professorId: "",
    professorName: "",
    department: "",
    phoneNumber: "",
    email: "",
    password:""
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [originalEmail, setOriginalEmail] = useState("");

  const professorId = getUserIdFromToken(professorAccessToken);

  useEffect(() => {
    if (!professorAccessToken || !professorId) return;

    ProfessorFindByidDetailApi(professorId)
      .then((res) => {
        setFormData(res.data);
        setOriginalEmail(res.data.email);
      })
      .catch((err) => {
        console.error("교수 정보 불러오기 실패:", err);
        setError("교수 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [professorAccessToken, professorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (value !== originalEmail) {
        setEmailVerified(false);
        setCodeSent(false);
      } else {
        setEmailVerified(true);
      }
    }
  };

  const sendCode = async () => {
    try {
      await registersubmitApi(formData.email);
      setCodeSent(true);
      setMessage("인증 코드가 이메일로 전송되었습니다.");
    } catch (err) {
      setMessage(err.response?.data || "인증 코드 전송 실패");
    }
  };

  const verifyCode = async () => {
    try {
      await registerGetemailsubmitApi(formData.email, emailCode);
      setEmailVerified(true);
      setMessage("이메일 인증이 완료되었습니다.");
    } catch (err) {
      setMessage(err.response?.data || "인증 코드가 올바르지 않습니다.");
    }
  };

  const handleSave = async () => {
    if (formData.email !== originalEmail && !emailVerified) {
      setMessage("이메일이 변경되었습니다. 인증을 완료해주세요.");
      return;
    }

    try {
      await ProfessorUpdateApi(formData);
      alert("정보가 성공적으로 저장되었습니다.");
      setOriginalEmail(formData.email);
      setEmailVerified(true);
      window.location.reload();
    } catch (err) {
      setMessage(err.response?.data || "정보 저장 실패");
    }
  };

  return (
    <div>
      <ProfessorHeader />
      <div style={{ display: "flex" }}>
        <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
          <ProfessorSidebar />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>📄 내 정보</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <label>
              교번
              <input name="professorId" value={formData.professorId} disabled />
            </label>
            <label>
              이름
              <input name="professorName" value={formData.professorName} disabled />
            </label>
            <label>
              학과
              <input name="department" value={formData.department} disabled />
            </label>
            <label>
              전화번호
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
              이메일
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailVerified}
                />
                <button type="button" onClick={sendCode} disabled={emailVerified}>
                  인증 코드 발송
                </button>
              </div>
            </label>
            {codeSent && !emailVerified && (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  placeholder="인증 코드 입력"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <button type="button" onClick={verifyCode}>인증 확인</button>
              </div>
            )}
            {emailVerified && <p style={{ color: "green" }}>✅ 이메일 인증 완료</p>}
            <button type="button" onClick={handleSave}>변경사항 저장</button>
          </form>

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}