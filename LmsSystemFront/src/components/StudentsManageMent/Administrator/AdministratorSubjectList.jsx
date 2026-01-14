import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminSubjectListApi,adminSubjectListUpdateApi } from '../api/ApiService';
import AdminSidebar from '../UI/AdminSidebar';
import AdminHeader from '../UI/AdministratorHeader';

import "../css/AdministratorSubjectDetailsCss.css";

export default function AdministratorSubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState('');


  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const navigate = useNavigate();

  function handleupdateSubmit(status) {
    const updatedSubjects = filteredSubjects.map(subject => ({
      ...subject,
      subjectStatus: status
    }));

    const count = updatedSubjects.length;

    const confirmMessage = `${count}개 과목을 정말 "${statusMap[status]}" 상태로 변경하시겠습니까?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    adminSubjectListUpdateApi(updatedSubjects)
      .then(() => {
        alert("상태가 성공적으로 변경되었습니다.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("수정 실패", err.response?.data || err.message);
        alert("수정 중 오류가 발생했습니다.");
      });
  }




  const handleDetail = (subjectid) => {
    navigate(`/Administrator/subjectlist/${subjectid}`);
  };

  const semesterMap = {
  FIRST: '1학기',
  SECOND: '2학기'
};

const statusMap = {
  OPEN: '개설중',
  CLOSED:'종강',
  CANCELLED: '폐강',
  PAUSED: '휴강'
};

  useEffect(() => {
    adminSubjectListApi()
      .then((response) => {
        setSubjects(response.data);
        setFilteredSubjects(response.data); // 초기엔 전체 목록 표시
        setLoading(false);
      })
      .catch((error) => {
        setError('과목 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

    useEffect(() => {
  let filtered = subjects;

  if (selectedYear) {
    filtered = filtered.filter((subject) => subject.subjectYear === parseInt(selectedYear));
  }

  if (selectedSemester) {
    filtered = filtered.filter((subject) => subject.semester === selectedSemester);
  }

  if (selectedStatus) {
    filtered = filtered.filter((subject) => subject.subjectStatus === selectedStatus);
  }

  if (subjectSearch) {
    filtered = filtered.filter((subject) =>
      subject.subject.toLowerCase().includes(subjectSearch.toLowerCase())
    );
  }

  setFilteredSubjects(filtered);
}, [selectedYear, selectedSemester, selectedStatus, subjectSearch, subjects]);



  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: '0 0 60px' }}>
        <AdminHeader />
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '200px' }}>
          <AdminSidebar />
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {/* 테이블 아래 필터 드롭다운 */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <label>과목명:</label>
          <input
            type="text"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            placeholder="과목명을 입력하세요"
          />
        </div>

          <div>
            <label>년도:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">전체</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

            <div>
              <label>학기:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">전체</option>
                <option value="FIRST">1학기</option>
                <option value="SECOND">2학기</option>
              </select>
            </div>

            <div>
              <label>상태:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">전체</option>
                <option value="OPEN">개설중</option>
                <option value="CLOSED">종강</option>
                <option value="CANCELLED">폐강</option>
                <option value="PAUSED">휴강</option>
              </select>
            </div>

            {/* 상태 일괄 변경 버튼들은 유지 */}
            <button onClick={() => handleupdateSubmit("OPEN")}>검색리스트 개설</button>
            <button onClick={() => handleupdateSubmit("CLOSED")}>검색리스트 종강</button>
            <button onClick={() => handleupdateSubmit("PAUSED")}>검색리스트 휴강</button>
          </div>
                <table>
            <thead>
              <tr>
                <th>과목명</th>
                <th>ID</th>
                <th>교수</th>
                <th>분반</th>
                <th>시간</th>
                <th>요일</th>
                <th>수업시간</th>
                <th>인원</th>
                <th>년도</th>
                <th>학기</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, index) => (
                <tr
                  key={index}
                  className="subject-row"
                  onClick={() => handleDetail(subject.subjectid)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{subject.subject}</td>
                  <td>{subject.subjectid}</td>
                  <td>{subject.professorName}</td>
                  <td>{subject.departmentClass}</td>
                  <td>{subject.startHour}시~{subject.endHour}시</td>
                  <td>{subject.classday}</td>
                  <td>{subject.gradeHour}시간</td>
                  <td>{subject.currentStudentsCount}/{subject.maximumStudentsCount}</td>
                  <td>{subject.subjectYear}</td>
                  <td>{semesterMap[subject.semester] || '학기 정보 없음'}</td>
                  <td>{statusMap[subject.subjectStatus] || '상태 정보 없음'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
