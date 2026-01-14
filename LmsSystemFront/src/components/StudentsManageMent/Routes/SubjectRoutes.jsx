import { Routes, Route } from "react-router-dom";
import SubjectLogin from "../Students/SubjectLogin";
import SubjectRegister from "../Students/SubjectRegister";

export default function SubjectRoutes() {
  return (
    <Routes>
      <Route path="login" element={<SubjectLogin />} />
      <Route path="register" element={<SubjectRegister />} />
    </Routes>
  );
}
