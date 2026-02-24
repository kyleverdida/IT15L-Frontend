import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import ProgramList from './components/ProgramList';
import SubjectList from './components/SubjectList';
import Enrollment from './pages/Enrollment';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="programs" element={<Outlet />}>
            <Route index element={<ProgramList />} />
            <Route path=":id" element={<ProgramList />} />
          </Route>
          <Route path="subjects" element={<Outlet />}>
            <Route index element={<SubjectList />} />
            <Route path=":id" element={<SubjectList />} />
          </Route>
          <Route path="enrollment" element={<Enrollment />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
