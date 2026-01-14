import { useParams, useNavigate, Link } from 'react-router-dom';
import {GradeListApi,GradeUpdateApi} from '../api/ApiService'
import { useEffect, useState, useContext } from 'react';
import StudentAuthContext from '../api/StudentsAuthProvider';
import ProfessorAuthContext from '../api/ProfessorAuthProvider';
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "../UI/AuthHeader";
import PostHomePageSidebar from "../UI/PostHomePageSidebar";
import '../css/PostMainPageCss.css';

export default function StudentsGradeList({ role }) {

    const studentContext = useContext(StudentAuthContext);
  const professorContext = useContext(ProfessorAuthContext);
  const adminContext = useContext(AdministratorAuthContext);
  const context =
  role === 'STUDENT'
    ? studentContext
    : role === 'PROFESSOR'
    ? professorContext
    : adminContext;

    const {
    studentsAccessToken,
    professorAccessToken,
    administratorToken,
    getUserIdFromToken,
    getUsernameFromToken,
    getTokenExpiration,
    getRemainingTime,
    handleTokenRefresh,
    logout,
  } = context;

  const accessToken =
    role === 'STUDENT'
      ? studentsAccessToken
      : role === 'PROFESSOR'
      ? professorAccessToken
      : administratorToken;
  const userId = getUserIdFromToken(accessToken)

  const { subjectId } = useParams();
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editableGrades, setEditableGrades] = useState([]);


  function handleSubmit() {
  const dto = {
    subjectid: parseInt(subjectId),
    studentsGrade: editableGrades.map((student) => ({
      studentId: student.studentId,
      grades: [{
        studentGradeId: student.studentGradeId,
        grade: student.grade,
        gradeRank: student.gradeRank,
      }]
    }))
  };

  GradeUpdateApi(role, subjectId, dto)
    .then(() => {
      alert("성적이 성공적으로 수정되었습니다.");
      window.location.reload(); // F5 누른 것처럼 새로고침
    })
    .catch((err) => {
      console.error("수정 실패", err.response?.data || err.message);
      alert("수정 중 오류가 발생했습니다.");
    });
}




  useEffect(() => {
  GradeListApi(role, subjectId)
    .then(res => {
      setSubjectInfo(res.data);
      // 성적 편집용 상태 생성
      const mappedGrades = res.data.studentsGrade.map(student => ({
        studentId: student.studentId,
        studentName: student.studentName,
        department: student.department,
        studentGradeId: student.grades[0]?.studentGradeId || null,
        grade: student.grades[0]?.grade ?? "",
        gradeRank: student.grades[0]?.gradeRank || ""
      }));
      setEditableGrades(mappedGrades);
      setLoading(false);
    })
    .catch(err => {
      console.error("성적 정보 불러오기 실패", err);
      setLoading(false);
    });
}, [subjectId]);


  if (loading) return <div>로딩 중...</div>;
  if (!subjectInfo) return <div>정보를 불러올 수 없습니다.</div>;

  return (
     <div>
          <AuthHeader
            accessToken={accessToken}
            getTokenExpiration={getTokenExpiration}
            getRemainingTime={getRemainingTime}
            getUsernameFromToken={getUsernameFromToken}
            handleTokenRefresh={handleTokenRefresh}
            logout={logout}
          />
          <div>
            <PostHomePageSidebar role={role} subjectId={subjectId} />
    
    <div style={{ padding: '20px' }}>
      <h2>{subjectInfo.subjectName} 성적 목록</h2>
      <p>담당 교수: {subjectInfo.professorName}</p>
      <p>과목 코드: {subjectInfo.subjectid}</p>
      <hr />

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
            <tr>
                <th>학번</th>
                <th>이름</th>
                <th>학과</th>
                <th>성적</th>
                <th>학점</th>
                <th>수정</th>
            </tr>
            </thead>
                <tbody>
        {editableGrades.map((student, index) => (
            <tr key={index}>
            <td>{student.studentId}</td>
            <td>{student.studentName}</td>
            <td>{student.department}</td>
            <td>
                <input
                type="number"
                value={student.grade ?? ""}
                onChange={(e) => {
                    const newGrades = [...editableGrades];
                    const value = e.target.value;
                    newGrades[index].grade = value === "" ? null : parseFloat(value);
                    setEditableGrades(newGrades);
                }}
                />

            </td>
            <td>
            <select
                value={student.gradeRank}
                onChange={(e) => {
                    const newGrades = [...editableGrades];
                    newGrades[index].gradeRank = e.target.value;
                    setEditableGrades(newGrades);
                }}
                >
                <option value="">선택</option>
                <option value="미입력">미입력</option> {/* 이 줄을 추가 */}
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
                </select>

            </td>
            <td>-</td>
            </tr>
        ))}
        </tbody>
        </table>    
        <button onClick={ handleSubmit}>수정</button>
      </div>
       </div>
    </div>
  );
}
