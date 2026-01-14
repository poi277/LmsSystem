import { Routes, Route } from "react-router-dom";
import ProfessorLogin from "../Professor/ProfessorLogin";
import ProfessorMain from "../Professor/ProfessorMain";
import ProfessorMyInfomation from "../Professor/ProfessorMyInformation"
import ProfessorPasswordChange from "../Professor/ProfessorPasswordChange"
import StudentsGradeList from "../StudentGrade/StudentsGradeList"
import { PostCommonRoutes } from "./PostCommonRoutes";

export default function ProfessorRoutes() {
  return (
    <Routes>
      <Route path="login" element={<ProfessorLogin />} />
      <Route path="main" element={<ProfessorMain role="PROFESSOR"  />} />
      <Route path="myinfo" element={<ProfessorMyInfomation role="PROFESSOR"  />} />

      <Route path="Grade/:subjectId" element={<StudentsGradeList role="PROFESSOR" />} />

      <Route path="passwordChange" element={<ProfessorPasswordChange role="PROFESSOR" />} />
      {PostCommonRoutes("PROFESSOR")}
    </Routes>
  );
}