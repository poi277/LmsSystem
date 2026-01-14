import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminSubjectDetailApi,
  adminSubjectUpdateApi,
  adminfindProfessorApi,
} from "../api/ApiService";
import AdminSidebar from '../UI/AdminSidebar';
import AdminHeader from "../UI/AdministratorHeader";
export default function AdministratorSubjectUpdate() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

   // 🔹 formData에 필드 추가
  const [formData, setFormData] = useState({
    subjectid: "",
    subject: "",
    departmentClass: "",
    gradeHour: "",
    classday: "",
    startHour: "",
    endHour: "",
    maximumStudentsCount: "",
    currentStudentsCount: "",
    professorId: "",
    subjectYear: "",           // 🔸 개설 연도
    semester: "",       // 🔸 학기
    subjectStatus: ""      // 🔸 개설 여부
  });

  const [message, setMessage] = useState(null);
  const [professors, setProfessors] = useState([]);

  // 🔹 과목 정보 불러오기
  useEffect(() => { 
    adminSubjectDetailApi(subjectId)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("과목 정보를 불러오지 못했습니다.");
      });

    // 🔹 교수 목록 불러오기
    adminfindProfessorApi()
      .then((res) => setProfessors(res.data))
      
      .catch((err) => console.error("교수 목록 불러오기 실패:", err));
  }, [subjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
  const max = parseInt(formData.maximumStudentsCount);
  const current = parseInt(formData.currentStudentsCount);

  if (!formData.subject || !formData.departmentClass) {
    setMessage("필수 항목을 모두 입력해주세요.");
    return;
  }

  if (max < current) {
    setMessage("최대 수강 인원은 현재 수강 인원보다 적을 수 없습니다.");
    return;
  }

  // ✅ 수정 전 사용자 확인
  const confirmUpdate = window.confirm("정말로 수정하시겠습니까?");
  if (!confirmUpdate) return;

  adminSubjectUpdateApi(formData)
    .then(() => {
      setMessage("수정이 완료되었습니다.");
      navigate(`/Administrator/subjectlist/${subjectId}`);
    })
    .catch((err) => {
      console.error(err);
      setMessage(err.response?.data || "수정 실패");
    });
};

const handleBack = () => {
  const confirmBack = window.confirm("정말로 뒤로가시겠습니까?");
  if (confirmBack) {
    navigate(`/Administrator/subjectlist/${subjectId}`);
  }
};


 return (
  <div style={{ display: "flex" }}>
    <AdminSidebar />

    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AdminHeader />

      {/* 오른쪽 메인 콘텐츠 */}
      <div style={{ padding: "20px" }}>
        <h2>과목 정보 수정</h2>
        {message && <div>{message}</div>}

        <div>
          <div>과목 ID: <input name="subjectid" value={formData.subjectid} disabled /></div>
          <div>과목명: <input name="subject" value={formData.subject} onChange={handleChange} /></div>
          <div>학과반: <input name="departmentClass" value={formData.departmentClass} onChange={handleChange} /></div>
          <div>학점: <input name="gradeHour" type="number" value={formData.gradeHour} onChange={handleChange} /></div>

          <div>요일:
            <select name="classday" value={formData.classday} onChange={handleChange}>
              <option value="">-- 요일 선택 --</option>
              <option value="월">월</option>
              <option value="화">화</option>
              <option value="수">수</option>
              <option value="목">목</option>
              <option value="금">금</option>
            </select>
          </div>

          <div>시작 교시:
            <select name="startHour" value={formData.startHour} onChange={handleChange}>
              <option value="">-- 시작 교시 선택 --</option>
              {[...Array(16)].map((_, i) => {
                const hour = i + 9;
                return <option key={hour} value={hour}>{hour}</option>;
              })}
            </select>
          </div>

          <div>종료 교시:
            <select name="endHour" value={formData.endHour} onChange={handleChange}>
              <option value="">-- 종료 교시 선택 --</option>
              {[...Array(16)].map((_, i) => {
                const hour = i + 9;
                return <option key={hour} value={hour}>{hour}</option>;
              })}
            </select>
          </div>

          <div>최대 수강 인원: <input name="maximumStudentsCount" type="number" value={formData.maximumStudentsCount} onChange={handleChange} /></div>
          <div>현재 수강 인원: <input name="currentStudentsCount" type="number" value={formData.currentStudentsCount} onChange={handleChange} /></div>

          <div>담당 교수:
            <select name="professorId" value={formData.professorId} onChange={handleChange}>
              <option value="">-- 교수 선택 --</option>
              {professors.map((prof) => (
                <option key={prof.professorId} value={prof.professorId}>
                  ({prof.professorId}) {prof.professorName}
                </option>
              ))}
            </select>
          </div>

          <div>개설 연도:
            <input
              type="number"
              name="subjectYear"
              value={formData.subjectYear}
              onChange={handleChange}
              placeholder="예: 2025"
            />
          </div>

          <div>학기:
            <select name="semester" value={formData.semester} onChange={handleChange}>
              <option value="">-- 학기 선택 --</option>
              <option value="FIRST">1학기</option>
              <option value="SECOND">2학기</option>
            </select>
          </div>

          <div>상태:
            <select name="subjectStatus" value={formData.subjectStatus} onChange={handleChange}>
              <option value="">-- 상태 선택 --</option>
              <option value="OPEN">개설</option>
               <option value="CLOSED">종강</option>
              <option value="PAUSED">휴강</option>
              <option value="CANCELLED">폐강</option>
            </select>
          </div>

          <button onClick={handleUpdate}>수정</button>
          <button onClick={handleBack}>뒤로</button>
        </div>
      </div>
    </div>
  </div>
  );
}

