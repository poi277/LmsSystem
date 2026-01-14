import { useParams, useNavigate } from "react-router-dom";


export default function DataRoom({ role }) {
  const { subjectId } = useParams();
  console.log("subjectId:", subjectId); // 👈 이거 찍어보세요!

  return (
    <div>
      데이터 룸입니다. 과목 ID: {subjectId}
    </div>
  );
}
