import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import ProgramList from './components/ProgramList';
import SubjectList from './components/SubjectList';
import Enrollment from './pages/Enrollment';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Protects routes that require login
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

// Redirects to dashboard if already logged in
const GuestRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest only - redirect to dashboard if logged in */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Protected - redirect to login if not logged in */}
        <Route element={<ProtectedRoute />}>
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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;