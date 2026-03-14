import { useEffect, useState } from 'react';
import { Search, UserPlus, MoreVertical, AlertCircle } from 'lucide-react';
import { api } from '../api/apiService';

export default function Students() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getStudents();
        if (!mounted) return;
        setData(response);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load students.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const students = data?.data ?? [];
  const totalText = loading ? 'Loading students...' : `${data?.meta?.total ?? students.length} total students`;

  return (
    <div className="p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm mt-1">{totalText}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900 transition">
          <UserPlus size={18} />
          Add Student
        </button>
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm">
                <th className="text-left px-6 py-4 font-medium">Student ID</th>
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Course</th>
                <th className="text-left px-6 py-4 font-medium">Year</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 w-12" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={6}>
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={6}>
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{s.student_id}</td>
                    <td className="px-6 py-4 text-slate-700">{s.name}</td>
                    <td className="px-6 py-4 text-slate-600">{s.course}</td>
                    <td className="px-6 py-4 text-slate-600">{s.year_level}</td>
                    <td>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${s.status === 'enrolled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
