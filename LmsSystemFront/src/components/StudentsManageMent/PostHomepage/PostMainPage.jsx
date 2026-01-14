import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostSubjectHomePageFindByidApi, PostAlldApi } from '../api/ApiService';
import { useEffect, useState, useContext } from 'react';
import StudentAuthContext from '../api/StudentsAuthProvider';
import ProfessorAuthContext from '../api/ProfessorAuthProvider';
import AdministratorAuthContext from "../api/AdministratorAuthProvider";
import AuthHeader from "../UI/AuthHeader";
import PostHomePageSidebar from "../UI/PostHomePageSidebar";
import '../css/PostMainPageCss.css';

export default function PostMainPage({ role }) {
  const { subjectId, subjectCategory } = useParams();
  const navigate = useNavigate();

  // 역할에 따른 Context 선택
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

  // 역할에 따른 토큰 선택
  const accessToken =
    role === 'STUDENT'
      ? studentsAccessToken
      : role === 'PROFESSOR'
      ? professorAccessToken
      : administratorToken;

  // 카테고리 매핑
  const categoryMap = {
    classroom: ['1주차', '2주차', '3주차'],
    freepost: '자유게시판',
    notice: '공지사항',
    QnA: '질문과 답변',
    acaive: '자료실',
    assignment: '과제제출',
  };

  // 현재 선택된 카테고리 (useParams에 따른 기본 필터링용)
  const targetCategory = categoryMap[subjectCategory];

  const userId = getUserIdFromToken(accessToken);
  const username = getUsernameFromToken(accessToken);

  const [subject, setSubject] = useState(null);
  const [subjectPosts, setSubjectPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('전체');

  // subjectId가 바뀔 때 데이터 불러오기
  useEffect(() => {
    PostSubjectHomePageFindByidApi(role, subjectId)
      .then((res) => setSubject(res.data))
      .catch(console.error);

    PostAlldApi(role, subjectId)
      .then((res) => setSubjectPosts(res.data))
      .catch(console.error);
  }, [role, subjectId]);

  // subjectCategory가 바뀔 때 필터 초기화
  useEffect(() => {
    if (subjectCategory === 'classroom') {
      setFilterCategory('전체'); // classroom은 전체 또는 주차별 필터 가능
    } else {
      const category = categoryMap[subjectCategory];
      if (Array.isArray(category)) {
        setFilterCategory('전체');
      } else {
        setFilterCategory(category); // notice 같은 단일 문자열은 그걸 기본 필터로 설정
      }
    }
  }, [subjectCategory]);

  // 게시글 필터링 로직
  const filteredPosts = subjectPosts.filter((post) => {
    // subjectCategory 별로 targetCategory가 배열이면 포함 여부 체크, 아니면 단순 비교
    const categoryFilter = Array.isArray(targetCategory)
      ? targetCategory.includes(post.category)
      : post.category === targetCategory;

    // 그리고 filterCategory가 '전체'면 전체 포함, 아니면 필터 조건 추가
    const finalFilter =
      filterCategory === '전체' ? categoryFilter : post.category === filterCategory;

    return finalFilter;
  });

  return subject ? (
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

        <h2>
          {subject.subject} 과목 페이지
          {subject.professorName && (
            <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#666' }}>
              (담당 교수: {subject.professorName})
            </span>
          )}
        </h2>

        <h3>📌 게시글 목록</h3>

        {/* classroom 카테고리일 때만 주차별 필터 버튼 표시 */}
        {subjectCategory === 'classroom' && (
          <div>
            <button
              onClick={() => setFilterCategory('전체')}
              className={filterCategory === '전체' ? 'active' : ''}
            >
              전체
            </button>
            <button
              onClick={() => setFilterCategory('1주차')}
              className={filterCategory === '1주차' ? 'active' : ''}
            >
              1주차
            </button>
            <button
              onClick={() => setFilterCategory('2주차')}
              className={filterCategory === '2주차' ? 'active' : ''}
            >
              2주차
            </button>
            <button
              onClick={() => setFilterCategory('3주차')}
              className={filterCategory === '3주차' ? 'active' : ''}
            >
              3주차
            </button>
            <button
              onClick={() => setFilterCategory('4주차')}
              className={filterCategory === '4주차' ? 'active' : ''}
            >
              4주차
            </button>
          </div>
        )}

        <ul>
          {filteredPosts.length === 0 ? (
            <p>게시글이 없습니다.</p>
          ) : (
            filteredPosts.map((post) => (
              <li key={post.postId} className="post-item">
                <div className="post-category">{post.category}</div>
                <div className="post-title">
                  <Link
                    to={`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}/post/${post.postId}`}
                    className="link-like-text"
                  >
                    {post.title}
                  </Link>
                </div>
                <div className="post-meta">
                  <span className="post-author">
                    {post.role === 'PROFESSOR'
                      ? '[교수] '
                      : post.role === 'ADMINISTRATOR'
                      ? '[관리자] '
                      : ''}
                    {post.authorName}
                  </span>
                  <span className="post-date">
                    {new Date(post.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>

        {!(
          role === 'STUDENT' &&
          (subjectCategory === 'classroom' || subjectCategory === 'notice')
        ) && (
          <button
            onClick={() =>
              navigate(`/${role.toLowerCase()}/subject/${subjectCategory}/${subjectId}/post`)
            }
          >
            글쓰기
          </button>
        )}
      </div>
    </div>
  ) : (
    <p>로딩 중...</p>
  );
}
