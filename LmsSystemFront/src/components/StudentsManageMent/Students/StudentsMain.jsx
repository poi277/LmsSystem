import { useEffect, useState, useContext } from "react";
import StudentAuthContext from "../api/StudentsAuthProvider"
import StudentsSidebar from "../UI/StudentsSidebar";
import StudentsHeader from "../UI/StudentsHeader"; // 경로에 맞게 수정하세요
import axios from "axios";
import { apiClient } from "../api/ApiClient"
import { studentFindByidApi } from '../api/ApiService';
import { useNavigate, useParams } from "react-router-dom";
export default function StudentsMain() {
  
  const { AuthId, logout, handleTokenRefresh,studentsAccessToken,
    getTokenExpiration,getRemainingTime,getUserIdFromToken,getUsernameFromToken
   } = useContext(StudentAuthContext);
  const [subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {subjectCategory} = useParams()
  const [filterYear, setFilterYear] = useState('2025');
  const [filterSemester, setFilterSemester] = useState('SECOND');

  const navigate = useNavigate();
  // 토큰에서 학생 ID 얻기
  const userId = getUserIdFromToken(studentsAccessToken);

  // 학생 성적 불러오기
  useEffect(() => {
  if (!studentsAccessToken || !userId) {
    console.log("No token or userId, skipping grade fetch.");
    return;
  }
  setLoading(true);
  setError(null);
  studentFindByidApi(userId)
  .then(res => {
    console.log(res.data)
    setSubject(res.data.subjects);
    setLoading(false);
  })
  .catch(err => {
    console.error("Error fetching grades:", err);
    setError("성적 정보를 불러오는 중 오류가 발생했습니다.");
    setLoading(false);
  });
}, [studentsAccessToken, userId]);

  return (
    <div>
          <div>
            <StudentsHeader />
            <div style={{ display: "flex" }}>
              <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
                <StudentsSidebar />
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
        <h3>당신의 과목리스트</h3>
        {loading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',      // 가로 배치
            gap: '12px',          // 아이템 사이 간격
            flexWrap: 'wrap',     // 너비 부족시 다음 줄로 내려감
            justifyContent: 'center', // 전체 가로 중앙 정렬 (선택 사항)
          }}
        >
          {subject.length === 0 ? (
            <li>수강 중인 과목이 없습니다.</li>
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
                  // flex 아이템 기본값으로 놔둠
                  style={{ marginBottom: '12px' }}
                >
                  <button
                    onClick={() => navigate(`/student/subject/classroom/${sub.subjectid}`)}
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
                    교수명: {sub.professorName}<br />
                    구분: {sub.subjectCategory} / {sub.gradeHour}학점<br />
                    개설장소: {sub.departmentClass}
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
