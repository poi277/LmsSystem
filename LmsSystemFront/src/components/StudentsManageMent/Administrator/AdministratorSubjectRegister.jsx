import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCreateSubjectApi, adminfindProfessorApi } from "../api/ApiService";

import AdminSidebar from '../UI/AdminSidebar';
import AdminHeader from '../UI/AdministratorHeader';

export default function AdministratorSubjectRegister() {
  const [formData, setFormData] = useState({
    subject: '',
    departmentClass: '',
    gradeHour: '',
    classday: '',
    startHour: '',
    endHour: '',
    professorId: '',
    maximumStudentsCount: '',
    subjectYear: '',       
   semester: '',       
   subjectStatus: '',  
  });

  const [message, setMessage] = useState(null);
  const [professors, setProfessors] = useState([]); // 🔹 교수 리스트 저장
  const navigate = useNavigate();

  useEffect(() => {
    adminfindProfessorApi()
      .then((res) => {
        setProfessors(res.data);
      })
      .catch((err) => {
        console.error("교수 목록 불러오기 실패:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const {
      subject, departmentClass, gradeHour,
      classday, startHour, endHour, professorId,
      maximumStudentsCount
    } = formData;

    if (!subject || !departmentClass || !professorId || !formData.subjectYear || !formData.semester || !formData.subjectStatus) {
      setMessage("과목명, 분반, 교수, 년도, 학기, 상태는 필수입니다.");
      return;
    }

    adminCreateSubjectApi(formData)
      .then(() => {
        setMessage("과목 등록이 완료되었습니다.");
        navigate("/Administrator/subjectlist");
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data || "과목 등록 실패");
      });
  };

  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    {/* 헤더 영역 */}
    <div style={{ flex: '0 0 60px' }}>
      <AdminHeader />
    </div>

    {/* 본문 영역: 사이드바 + 콘텐츠 */}
    <div style={{ flex: 1, display: 'flex' }}>
      {/* 좌측 사이드바 */}
      <div style={{ width: '200px' }}>
        <AdminSidebar />
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2>과목 등록</h2>
        {message && <div>{message}</div>}

        <div>
          <div>과목명: <input name="subject" value={formData.subject} onChange={handleChange} /></div>
          <div>학과: <input name="departmentClass" value={formData.departmentClass} onChange={handleChange} /></div>
          <div>학점: <input name="gradeHour" type="number" value={formData.gradeHour} onChange={handleChange} /></div>

          {/* 요일 선택 */}
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

          {/* 시작 시간 선택 */}
          <div>시작 시간:
            <select name="startHour" value={formData.startHour} onChange={handleChange}>
              <option value="">-- 시작 교시 선택 --</option>
              {[...Array(16)].map((_, i) => {
                const hour = i + 9;
                return <option key={hour} value={hour}>{hour}</option>;
              })}
            </select>
          </div>

          {/* 종료 시간 선택 */}
          <div>종료 시간:
            <select name="endHour" value={formData.endHour} onChange={handleChange}>
              <option value="">-- 종료 교시 선택 --</option>
              {[...Array(16)].map((_, i) => {
                const hour = i + 9;
                return <option key={hour} value={hour}>{hour}</option>;
              })}
            </select>
          </div>

          <div>최대 수강 인원: <input name="maximumStudentsCount" type="number" value={formData.maximumStudentsCount} onChange={handleChange} /></div>

          {/* 담당 교수 선택 */}
          <div>
            담당 교수:
            <select name="professorId" value={formData.professorId} onChange={handleChange}>
              <option value="">-- 교수 선택 --</option>
              {professors.map((prof) => (
                <option key={prof.professorId} value={prof.professorId}>
                  ({prof.professorId}) {prof.professorName}
                </option>
              ))}
            </select>
          </div>

                    {/* 년도 입력 */}
          <div>년도: <input name="subjectYear" type="number" value={formData.subjectYear} onChange={handleChange} /></div>

          {/* 학기 선택 */}
          <div>학기:
            <select name="semester" value={formData.semester} onChange={handleChange}>
              <option value="">-- 학기 선택 --</option>
              <option value="FIRST">1학기</option>
              <option value="SECOND">2학기</option>
            </select>
          </div>

          {/* 상태 선택 */}
          <div>상태:
            <select name="subjectStatus" value={formData.subjectStatus} onChange={handleChange}>
              <option value="">-- 상태 선택 --</option>
              <option value="OPEN">개설됨</option>
              <option value="CLOSED">종강</option>
              <option value="CANCELLED">폐강</option>
              <option value="PAUSED">휴강</option>
            </select>
          </div>


          <div>
            <button onClick={handleSubmit}>등록</button>
            <button onClick={() => navigate("/Administrator/subjectlist")}>취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

