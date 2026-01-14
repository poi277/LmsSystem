// src/components/RoleBasedSidebar.jsx
import AdminSidebar from './AdminSidebar';
import StudentsSidebar from './StudentsSidebar';
import ProfessorSidebar from './ProfessorSidebar';

export default function RoleBySidebar({ role }) {
  if (role === "ADMINISTRATOR") return <AdminSidebar />;
  if (role === "STUDENT") return <StudentsSidebar />;
  if (role === "PROFESSOR") return <ProfessorSidebar />;
  return null; // 알 수 없는 역할
}
