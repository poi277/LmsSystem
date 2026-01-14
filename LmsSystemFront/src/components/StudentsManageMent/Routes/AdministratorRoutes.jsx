import { Routes, Route } from "react-router-dom";
import AdministratorLogin from "../Administrator/AdministratorLogin";
import AdministratorUserList from "../Administrator/AdministratorUserList";
import AdministratorUserDetails from "../Administrator/AdministratorUserDetails";
import AdminPasswordReset from "../Administrator/AdminPasswordReset";
import AdministratorUserUpdate from "../Administrator/AdministratorUserUpdate";
import AdministratorSubjectList from "../Administrator/AdministratorSubjectList";
import AdministratorSubjectDetails from "../Administrator/AdministratorSubjectDetails";
import AdministratorSubjectUpdate from "../Administrator/AdministratorSubjectUpdate"
import AdministratorProfessorRegister from "../Administrator/AdministratorProfessorRegister"
import AdministratorSubjectRegister from "../Administrator/AdministratorSubjectRegister"
import StudentsGradeList from "../StudentGrade/StudentsGradeList"
import { PostCommonRoutes } from "./PostCommonRoutes";
export default function AdministratorRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdministratorLogin />} />
      <Route path="userlist" element={<AdministratorUserList />} />
      <Route path="userdetail/:role/:id" element={<AdministratorUserDetails />} />
      <Route path="useredit/:role/:id" element={<AdministratorUserUpdate />} />
       <Route path="passwordedit/:role/:id" element={<AdminPasswordReset />} />
      <Route path="subjectlist" element={<AdministratorSubjectList />} />
      <Route path="subjectlist/:subjectId" element={<AdministratorSubjectDetails />} />
      <Route path="subjectlist/update/:subjectId" element={<AdministratorSubjectUpdate />} />
      {PostCommonRoutes("ADMINISTRATOR")}
      <Route path="professorregister" element={<AdministratorProfessorRegister role="ADMINISTRATOR" />} />
      <Route path="subjectregister" element={<AdministratorSubjectRegister role="ADMINISTRATOR" />} />
      <Route path="Grade/:subjectId" element={<StudentsGradeList role="ADMINISTRATOR" />} />
    </Routes>
  );
} 
