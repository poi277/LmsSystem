import { useContext, useEffect, useState } from 'react';
import { SubjectListApi, SubjectPostApi, SubjectDeleteApi,SubjectstudentFindByidApi} from '../api/ApiService';
import SubjectAuthContext from '../api/SubjectAuthProvider';

 function getStudentIdFromToken(token) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1]; // payload 부분
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    return payload.studentId;
  } catch (e) {
    console.error("토큰 파싱 오류:", e);
    return null;
  }
}

export default function SubjectList() {
  const { AuthId,handleSubjectTokenRefresh, logout,subjectToken,
    getTokenExpiration,getRemainingTime,getUserIdFromToken,getUsernameFromToken
   }= useContext(SubjectAuthContext);
  const studentId = getStudentIdFromToken(subjectToken); // 로그인한 학생 ID라고 가정
  const [remainingTime, setRemainingTime] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [registerSubject,setRegisterSubject] = useState([]);
  const [selectedSubjectName, setSelectedSubjectName] = useState("전체");
  const [sumGrade , setSumGrade] = useState(0);
  const [name,setName] = useState();
  const [studentClass,setstudentClass] = useState();
  const [maxGradeHour,setMaxGradeHour] = useState();



    function StudentsInfomation() {
      SubjectstudentFindByidApi(studentId)
        .then((response) => {
          const student = response.data;
          setName(student.studentName);
          setstudentClass(student.studentClass);
          setMaxGradeHour(student.maxGradeHour);
        })
        .catch((error) => console.error("학생 정보 오류:", error));
    }


  // 과목 리스트 불러오기
  const loadSubjects = () => {
  SubjectListApi(studentId)
    .then(response => {
      const subjects = response.data;
      setSubjectList(subjects);

      // ✅ 등록된 과목 중 상태가 OPEN인 것만 등록과목으로 인정
      const registeredOpenSubjects = subjects.filter(
        subject => subject.registered === true && subject.subjectStatus === "OPEN"
      );
      setRegisterSubject(registeredOpenSubjects);

      // ✅ 학점 총합 계산
      const totalGrade = registeredOpenSubjects.reduce((sum, subj) => sum + subj.gradeHour, 0);
      setSumGrade(totalGrade);
    })
    .catch(error => console.error("과목 불러오기 오류:", error));
};


  useEffect(() => {
    if (!subjectToken) return;

    const exp = getTokenExpiration(subjectToken);
    if (!exp) return;

    setRemainingTime(getRemainingTime(exp));

    const interval = setInterval(() => {
      const timeLeft = getRemainingTime(exp);
      setRemainingTime(timeLeft);

      if (timeLeft === "00:00") {
        clearInterval(interval);
        alert("로그인 시간이 만료되었습니다")
        logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [subjectToken, logout]);


  useEffect(() => {
    StudentsInfomation();
    loadSubjects();
  }, []);

  // 과목 필터링
  const filteredSubjects =
    !selectedSubjectName || selectedSubjectName === "전체"
      ? subjectList
      : subjectList.filter(subject => subject.subject === selectedSubjectName);

  // 신청/취소 버튼 클릭
 const toggleRegistration = (subject) => {
  const subjectId = subject.subjectid

  // 👉 최대 학점 초과 확인
  if (!subject.registered && sumGrade + subject.gradeHour > maxGradeHour) {
    alert("최대 수강 가능 학점을 초과했습니다!");
    return;
  }

  const action = subject.registered ? SubjectDeleteApi : SubjectPostApi;

  action(studentId, subjectId)
    .then(() => {
      alert(subject.registered ? "수강신청이 취소되었습니다." : "수강신청이 완료되었습니다.");
      loadSubjects();
      StudentsInfomation();
    })
    .catch(error => {
      console.error("신청/취소 실패:", error);
      alert(error.response.data);
    });
};

  return (
    <div>
      {/* ✅ 학생 정보 표시 */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid lightgray', paddingBottom: '10px' }}>
        남은 로그인 시간: {remainingTime}
        <button onClick={handleSubjectTokenRefresh}>로그인 연장</button>
        <h2>학생 정보</h2>
        <p>이름: {name}</p>
        <p>반: {studentClass}</p>
        <p>최대 수강가능 학점: {maxGradeHour}</p>
        <p>현재 수강 학점: {sumGrade}</p>
        <button onClick={()=> logout()}>로그아웃</button>
      </div>
      
      <h3>과목 선택</h3>
      <select onChange={(e) => setSelectedSubjectName(e.target.value)} value={selectedSubjectName}>
        <option value="전체">전체</option>
        {[...new Set(subjectList.map(s => s.subject))].map((subjectName, index) => (
          <option key={index} value={subjectName}>{subjectName}</option>
        ))}
      </select>

            {filteredSubjects.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4>📘 선택한 과목 정보</h4>
              <ul>
                {filteredSubjects.map((subject, idx) => (
                  <li key={idx}>
                    교과목명: {subject.subject}{" "}
                    학점: {subject.gradeHour}점{" "}
                    장소: {subject.departmentClass}{" "}
                    시간표: {subject.classday}{" "}
                    {subject.startHour}시 ~ {subject.endHour}시{" "}
                    현재 수강인원: {subject.currentStudentsCount}/
                    최대 수강인원: {subject.maximumStudentsCount}{" "}
                    담당교수: {subject.professorName}{" "}
                    {/* 🔽 조건부 렌더링 */}
                    {subject.registered ? (
                      <span style={{ color: 'green' }}>✔ 신청 완료</span>
                    ) : subject.currentStudentsCount >= subject.maximumStudentsCount ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>수강인원 초과</span>
                    ) : (
                      <button onClick={() => toggleRegistration(subject)}>
                        수강신청
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
      {/* ✅ 수강 신청한 과목 리스트 추가 위치 */}
        <div style={{ marginTop: '40px' }}>
          <h3>✅ 수강 신청한 과목 리스트</h3> 
          <ul>
            {registerSubject.map((subject, idx) => (
              <li key={idx}>
                교과목명: {subject.subject} / 학점: {subject.gradeHour}점 / 장소: {subject.departmentClass} / 시간표: {subject.classday} / 시간: {subject.startHour}시 ~ {subject.endHour}시
                현재 수강인원:{subject.currentStudentsCount}/
                최대 수강인원:{subject.maximumStudentsCount}
                <button onClick={() => toggleRegistration({ ...subject, registered: true })}>
                    수강취소
                  </button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}
