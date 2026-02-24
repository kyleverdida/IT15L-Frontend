import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Layers, Activity, Ban, Calendar, FileText, BookMarked } from 'lucide-react';
import StatWidget from '../components/StatWidget';
import WeatherWidget from '../components/WeatherWidget';
import { api } from '../api/apiService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  const widgets = [
    { icon: <BookOpen size={22} />, label: 'Total Programs', value: stats?.total_programs ?? '—', color: 'bg-red-800' },
    { icon: <Layers size={22} />, label: 'Total Subjects', value: stats?.total_subjects ?? '—', color: 'bg-red-700' },
    { icon: <Activity size={22} />, label: 'Active Programs', value: stats?.active_programs ?? '—', color: 'bg-red-600', trend: { up: true, value: 3 } },
    { icon: <Ban size={22} />, label: 'Inactive Programs', value: stats?.inactive_programs ?? '—', color: 'bg-red-500' },
    { icon: <Calendar size={22} />, label: 'Subjects Per Semester', value: stats?.subjects_per_semester ?? '—', color: 'bg-red-700' },
    { icon: <Calendar size={22} />, label: 'Subjects Per Term', value: stats?.subjects_per_term ?? '—', color: 'bg-red-600' },
    { icon: <FileText size={22} />, label: 'Subjects With Pre-requisites', value: stats?.subjects_with_prerequisites ?? '—', color: 'bg-red-900' },
  ];

  const recentlyAdded = stats?.recently_added ?? [];
  const semesterChart = stats?.subjects_per_semester_chart ?? [];
  const statusChart = stats?.programs_by_status ?? [];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Program and subject offerings overview</p>
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
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Subjects Per Semester/Term</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Subjects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Programs by Status</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusChart.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  formatter={(v) => [v, 'Programs']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <BookMarked size={20} />
          Recently Added Programs & Subjects
        </h3>
        <div className="space-y-3">
          {recentlyAdded.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent additions</p>
          ) : (
            recentlyAdded.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {item.type}
                  </span>
                  <span className="ml-3 font-mono text-sm text-red-800">{item.code}</span>
                  <span className="ml-2 text-slate-800">{item.name ?? item.title}</span>
                </div>
                <span className="text-slate-500 text-sm">{item.added_at}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
