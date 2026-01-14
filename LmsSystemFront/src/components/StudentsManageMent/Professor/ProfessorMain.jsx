import { useEffect, useState, useContext } from "react";
import ProfessorAuthContext from "../api/ProfessorAuthProvider";
import { ProfessorSubjectAllApi } from '../api/ApiService';
import { useNavigate } from "react-router-dom";
import ProfessorSidebar from "../UI/ProfessorSidebar";
import ProfessorHeader from "../UI/ProfessorHeader";

export default function ProfessorsMain() {
  const {
    logout,
    handleTokenRefresh,
    professorAccessToken,
    getTokenExpiration,
    getRemainingTime,
    getUserIdFromToken,
    getUsernameFromToken,
  } = useContext(ProfessorAuthContext);

  const [subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 년도와 학기 필터 상태 추가
  const [filterYear, setFilterYear] = useState('2025');
  const [filterSemester, setFilterSemester] = useState('SECOND');

  const navigate = useNavigate();

  const userId = getUserIdFromToken(professorAccessToken);

  useEffect(() => {
    if (!professorAccessToken || !userId) {
      console.log("No token or userId, skipping subject fetch.");
      return;
    }
    setLoading(true);
    setError(null);

    ProfessorSubjectAllApi(userId)
      .then((res) => {
        console.log(res.data)
        setSubject(res.data.subjects);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        setError("과목 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [professorAccessToken, userId]);

  return (
    <div>
      <div>
        <ProfessorHeader />
        <div style={{ display: "flex" }}>
          <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
            <ProfessorSidebar />
          </div>
          <div style={{ flex: 1, padding: "20px" }}>
            {/* 기존 본문 내용 */}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>년도:
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </label>
        <label style={{ marginLeft: '20px' }}>학기:
          <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
            <option value="FIRST">1학기</option>
            <option value="SECOND">2학기</option>
          </select>
        </label>
      </div>

      <div>
        <h3>당신이 담당 중인 과목</h3>
        {loading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {subject.length === 0 ? (
              <li>담당 중인 과목이 없습니다.</li>
            ) : (
              subject
                .filter(sub => {
                  const matchYear = filterYear === '' || sub.subjectYear === parseInt(filterYear);
                  const matchSemester = filterSemester === '' || sub.semester === filterSemester;
                  return matchYear && matchSemester;
                })
                .map((sub) => (
                  <li
                    key={sub.subjectid}
                    style={{ marginBottom: '12px' }}
                  >
                    <button
                      onClick={() => navigate(`/professor/subject/classroom/${sub.subjectid}`)}
                      style={{
                        display: 'block',
                        width: 'auto',
                        maxWidth: '500px',
                        padding: '10px 15px',
                        textAlign: 'left',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      <strong>{sub.subject}</strong><br />
                      개설장소: {sub.departmentClass}<br />
                      구분: {sub.subjectCategory} / {sub.gradeHour}학점<br />
                      담당 교수명: {sub.professorName}
                    </button>
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
