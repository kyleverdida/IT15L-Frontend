import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import Students from './pages/Students';
import Enrollments from './pages/Enrollments';
import SchoolCalendar from './pages/SchoolCalendar';
import ProgramList from './components/ProgramList';
import SubjectList from './components/SubjectList';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="enrollments" element={<Enrollments />} />
                <Route path="school-calendar" element={<SchoolCalendar />} />
                <Route path="programs" element={<Outlet />}>
                  <Route index element={<ProgramList />} />
                  <Route path=":id" element={<ProgramList />} />
                </Route>
                <Route path="subjects" element={<Outlet />}>
                  <Route index element={<SubjectList />} />
                  <Route path=":id" element={<SubjectList />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;