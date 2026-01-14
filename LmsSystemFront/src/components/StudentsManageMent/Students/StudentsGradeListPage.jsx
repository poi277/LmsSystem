import { useEffect, useState, useContext } from "react";
import StudentAuthContext from "../api/StudentsAuthProvider";
import StudentsSidebar from "../UI/StudentsSidebar";
import StudentsHeader from "../UI/StudentsHeader";
import { studentFindByidApi } from '../api/ApiService';

export default function StudentsGradeListPage() {
  const {
    studentsAccessToken,
    getUserIdFromToken,
  } = useContext(StudentAuthContext);

  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = getUserIdFromToken(studentsAccessToken);

  useEffect(() => {
    if (!studentsAccessToken || !userId) {
      return;
    }

    setLoading(true);
    studentFindByidApi(userId)
      .then((res) => {
        setStudentInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student grades:", err);
        setError("성적 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [studentsAccessToken, userId]);

  return (
    <div>
      <StudentsHeader />
      <div style={{ display: "flex" }}>
        <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
          <StudentsSidebar />
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          <h2> 이번 학기 성적 조회</h2>
          {loading && <p>불러오는 중...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && studentInfo && (
            <div>
              <p><strong>이름:</strong> {studentInfo.studentName}</p>
              <p><strong>학과:</strong> {studentInfo.department}</p>
              <p><strong>최대 이수 학점:</strong> {studentInfo.maxGradeHour}학점</p>

              <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: "20px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>과목명</th>
                    <th>이수 학점</th>
                    <th>성적</th>
                    <th>등급</th>
                  </tr>
                </thead>
                <tbody>
                  {studentInfo.grades.length === 0 ? (
                    <tr>
                      <td colSpan="4">성적 정보가 없습니다.</td>
                    </tr>
                  ) : (
                    studentInfo.grades.map((grade) => (
                      <tr key={grade.studentGradeId}>
                        <td>{grade.subject}</td>
                        <td>{grade.gradeHour}학점</td>
                        <td>{grade.grade}</td>
                        <td>{grade.gradeRank ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
