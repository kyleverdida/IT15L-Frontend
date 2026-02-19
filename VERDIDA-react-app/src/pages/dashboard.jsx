import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';
import StatWidget from '../components/StatWidget';
import WeatherWidget from '../components/WeatherWidget';
import { api } from '../api/apiService';
import { mockEnrollmentTrend, mockCourseDistribution } from '../api/mockData';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getOverviewStats().then(setStats);
  }, []);

  const widgets = [
    { icon: <Users size={22} />, label: 'Total Students', value: stats?.total_students?.toLocaleString() ?? '—', color: 'bg-blue-500', trend: { up: true, value: 12 } },
    { icon: <BookOpen size={22} />, label: 'Active Courses', value: stats?.active_courses ?? '—', color: 'bg-emerald-500', trend: { up: true, value: 3 } },
    { icon: <CreditCard size={22} />, label: 'Pending Fees', value: stats ? `$${stats.pending_fees?.toLocaleString()}` : '—', color: 'bg-violet-500' },
    { icon: <TrendingUp size={22} />, label: 'Enrollments This Week', value: stats?.enrollment_this_week ?? '—', color: 'bg-amber-500', trend: { up: true, value: 24 } },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <WeatherWidget />
      </header>

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((w, i) => (
          <StatWidget key={i} {...w} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Enrollment Trends (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockEnrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  labelStyle={{ color: '#334155' }}
                />
                <Line type="monotone" dataKey="enrollments" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} name="Enrollments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Course Distribution</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCourseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {mockCourseDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  formatter={(v) => [v, 'Students']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar chart for additional insight */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Activity</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEnrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
