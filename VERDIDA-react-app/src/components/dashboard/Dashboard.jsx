import { useEffect, useState } from 'react';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import WeatherWidget from '../weather/WeatherWidget';
import LoadingSpinner from '../common/LoadingSpinner';
import { dashboardService } from '../../services/api';

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const toObject = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload && typeof payload === 'object' ? payload : {};
};

function SkeletonCard() {
  return <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />;
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    overview: null,
    monthlyEnrollment: [],
    courseDistribution: [],
    attendancePattern: [],
  });

  useEffect(() => {
    let mounted = true;

    Promise.all([
      dashboardService.getOverview(),
      dashboardService.getMonthlyEnrollment(),
      dashboardService.getCourseDistribution(),
      dashboardService.getAttendancePattern(),
    ])
      .then(([overview, monthlyEnrollment, courseDistribution, attendancePattern]) => {
        if (mounted) {
          setState({
            loading: false,
            error: '',
            overview: toObject(overview),
            monthlyEnrollment: toList(monthlyEnrollment),
            courseDistribution: toList(courseDistribution),
            attendancePattern: toList(attendancePattern),
          });
        }
      })
      .catch((error) => {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to load dashboard data.',
          }));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Enrollment trends, attendance, and course distribution.</p>
      </header>

      {state.loading ? (
        <div>
          <LoadingSpinner label="Loading dashboard analytics..." />
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : null}

      {state.error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>
      ) : null}

      {!state.loading && !state.error ? (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total Programs" value={state.overview?.total_programs ?? 0} />
            <StatCard label="Total Subjects" value={state.overview?.total_subjects ?? 0} />
            <StatCard label="Active Programs" value={state.overview?.active_programs ?? 0} />
            <StatCard label="Subjects with Prerequisites" value={state.overview?.subjects_with_prerequisites ?? 0} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <EnrollmentChart data={state.monthlyEnrollment} />
            <CourseDistributionChart data={state.courseDistribution} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <AttendanceChart data={state.attendancePattern} />
            <WeatherWidget />
          </section>
        </>
      ) : null}
    </div>
  );
}
