import { useContext, useEffect, useState } from "react";
import StudentAuthContext from "../api/StudentsAuthProvider";
import {
  studentFindByidDetailApi,
  registersubmitApi,
  registerGetemailsubmitApi,
  StudentsUpdateApi,
} from "../api/ApiService";
import StudentsSidebar from "../UI/StudentsSidebar";
import StudentsHeader from "../UI/StudentsHeader";

export default function StudentsMyInfomation() {
  const { studentsAccessToken, getUserIdFromToken } = useContext(StudentAuthContext);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    department: "",
    maxGradeHour: "",
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

  const studentId = getUserIdFromToken(studentsAccessToken);
  
useEffect(() => {
  if (!studentsAccessToken || !studentId) return;

  studentFindByidDetailApi(studentId)
    .then((res) => {
      setFormData(res.data);
      setOriginalEmail(res.data.email); // 원래 이메일 저장
    })
    .catch((err) => {
      console.error("학생 정보 불러오기 실패:", err);
      setError("학생 정보를 불러오는 중 오류가 발생했습니다.");
    });
}, [studentsAccessToken, studentId]);

  
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

    // 이메일이 변경되면 다시 인증해야 함
  if (name === "email") {
    // 이메일을 기존값에서 바꾼 경우에만 인증 필요
    if (value !== originalEmail) {
      setEmailVerified(false);
      setCodeSent(false);
    } else {
      setEmailVerified(true); // 기존 이메일로 되돌렸다면 인증 없이 저장 가능
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
  // 이메일이 기존과 다르게 바뀌었고, 아직 인증이 안 된 경우
  if (formData.email !== originalEmail && !emailVerified) {
    setMessage("이메일이 변경되었습니다. 인증을 완료해주세요.");
    return;
  }

  try {
    await StudentsUpdateApi(formData);
    alert("정보가 성공적으로 저장되었습니다.");
    setOriginalEmail(formData.email); // 저장 후 이메일 기준 업데이트
    setEmailVerified(true); // 저장 완료 후 인증 상태 유지
    window.location.reload(); // ✅ 새로고침
  } catch (err) {
    setMessage(err.response?.data || "정보 저장 실패");
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
          <h2>📄 내 정보</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <label>
              학번
              <input name="studentId" value={formData.studentId} disabled />
            </label>
            <label>
              이름
              <input name="studentName" value={formData.studentName} disabled />
            </label>
            <label>
              학과
              <input name="department" value={formData.department} disabled />
            </label>
            <label>
              최대 수강 가능 학점
              <input name="maxGradeHour" value={formData.maxGradeHour} disabled />
            </label>
            <label>
              전화번호
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </label>

            {/* 이메일 입력 + 코드 전송 */}
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

            {/* 인증 코드 입력 */}
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

            <button type="button" onClick={handleSave}>
                        변경사항 저장
                      </button>
          </form>

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
