import { Link } from "react-router-dom";

export default function PostHomePageSidebar({ role,subjectId }) {

  const prefix = role === "STUDENT"
  ? "/student"
  : role === "PROFESSOR"
    ? "/professor"
    : "/Administrator";

  return (
    <div style={{
      width: '200px',
      borderRight: '1px solid #ccc',
      padding: '10px'
    }}>
      <h3>📁 카테고리</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {role === "STUDENT" && (
          <li><Link to="/student/main">학생 홈페이지로 돌아가기</Link></li>
        )}
        {role === "ADMINISTRATOR" && (
           <>
          <li><Link to="/Administrator/userlist">관리자 홈페이지로 돌아가기</Link></li>
          <li><Link to={`/Administrator/Grade/${subjectId}`}>학생 성적 관리</Link></li>
          </>
        )}
        {role === "PROFESSOR" && (
          <>
            <li><Link to="/professor/main">교수 홈페이지로 돌아가기</Link></li>
            <li><Link to={`/professor/Grade/${subjectId}`}>학생 성적 관리</Link></li>
          </>
        )}

        {/* 공통 메뉴 */}
          <li>{<Link to={`${prefix}/subject/classroom/${subjectId}`}>강의실</Link>}</li>
          <li>{<Link to={`${prefix}/subject/freepost/${subjectId}`}>자유게시판</Link>}</li>
          <li> {<Link to={`${prefix}/subject/notice/${subjectId}`}>공지사항</Link>}</li>
          <li> {<Link to={`${prefix}/subject/QnA/${subjectId}`}>질문과 답변</Link>}</li>
          <li> {<Link to={`${prefix}/subject/acaive/${subjectId}`}>자료실</Link>}</li>
          <li> {<Link to={`${prefix}/subject/assignment/${subjectId}`}>과제제출</Link>}</li>
      </ul>
    </div>
  );
}
