import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { StudentAuthProvider } from './api/StudentsAuthProvider';
import { SubjectAuthProvider } from './api/SubjectAuthProvider';
import { AdministratorAuthProvider } from './api/AdministratorAuthProvider';
import StudentRoutes from './Routes/StudentRoutes';
import AdministratorRoutes from './Routes/AdministratorRoutes';
import SubjectRoutes from './Routes/SubjectRoutes';
import ProfessorRoutes from './Routes/ProfessorRoutes';
import FindAccountRoutes from './Routes/FindAccountRoutes';
import { ProfessorAuthProvider } from './api/ProfessorAuthProvider';
import LoginRegisterRoutes from './Routes/LoginRegisterRoutes';
import FileUploadExample from './PostHomepage/FileUploadExample';

function StudentsAppNavi() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student/login" replace />} />

        <Route path="/upload" element={<FileUploadExample />} />

        <Route path="/find/*" element={<FindAccountRoutes />} />

        <Route path="/register/*" element={<LoginRegisterRoutes />} />

        <Route
          path="/student/*"
          element={
            <StudentAuthProvider>
              <StudentRoutes />
            </StudentAuthProvider>
          }
        />

        <Route
          path="/Administrator/*"
          element={
            <AdministratorAuthProvider>
              <AdministratorRoutes />
            </AdministratorAuthProvider>
          }
        />

        <Route
          path="/subject/*"
          element={
            <SubjectAuthProvider>
              <SubjectRoutes />
            </SubjectAuthProvider>
          }
        />

        <Route
          path="/professor/*"
          element={
            <ProfessorAuthProvider>
              <ProfessorRoutes />
            </ProfessorAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default StudentsAppNavi;
