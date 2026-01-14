import { Routes, Route } from "react-router-dom";
import StudentsLogin from "../Students/StudentsLogin";
import StudentsMain from "../Students/StudentsMain";
import StudentGradeList from "../Students/StudentsGradeListPage"
import StudentsMyInfomation from "../Students/StudentsMyInfomation"
import StudentsPasswordChange from "../Students/StudentsPasswordChange"
import { PostCommonRoutes } from "./PostCommonRoutes";
export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="login" element={<StudentsLogin />} />
      <Route path="main" element={<StudentsMain role="STUDENT"  />} />
      <Route path="myinfo" element={<StudentsMyInfomation role="STUDENT"  />} />
      <Route path="grades" element={<StudentGradeList role="STUDENT" />} />
      <Route path="passwordChange" element={<StudentsPasswordChange role="STUDENT" />} />
      {PostCommonRoutes("STUDENT")}
      
    </Routes>
  );
}
