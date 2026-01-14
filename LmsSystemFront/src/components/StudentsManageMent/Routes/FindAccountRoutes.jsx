import { Routes, Route } from "react-router-dom";
import FindIdPage from "../FindAccountPage/FindIdPage";
import FindSelectPage from "../FindAccountPage/FindSelectPage";
import PasswordResetWithEmailCode from "../FindAccountPage/PasswordResetWithEmailCode"
export default function LoginRegisterRoutes() {
  return (
    <Routes>
      <Route path="select" element={<FindSelectPage />} />
      <Route path="id" element={<FindIdPage />} />
      <Route path="password" element={<PasswordResetWithEmailCode />} />

    </Routes>
  );
}