import { Routes, Route } from "react-router-dom";
import LoginRegisterStudents from "../LoginRegister/LoginRegisterStudents"
export default function LoginRegisterRoutes() {
  return (
    <Routes>
      <Route path="signup" element={<LoginRegisterStudents />} />
    </Routes>
  );
}