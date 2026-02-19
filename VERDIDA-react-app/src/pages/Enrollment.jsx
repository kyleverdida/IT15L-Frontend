import { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api/apiService';

export default function Enrollment() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getEnrollments().then(setData);
  }, []);

  const enrollments = data?.data ?? [];

  return (
    <div className="p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enrollment</h1>
          <p className="text-slate-500 text-sm mt-1">
            {data?.meta?.total ?? 0} total • {data?.meta?.pending ?? 0} pending
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition">
          <Plus size={18} />
          New Enrollment
        </button>
      </header>

      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search enrollments..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm">
                <th className="text-left px-6 py-4 font-medium">Student</th>
                <th className="text-left px-6 py-4 font-medium">Course</th>
                <th className="text-left px-6 py-4 font-medium">Enrolled At</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-800">{e.student_name}</td>
                  <td className="px-6 py-4 text-slate-700">{e.course_code}</td>
                  <td className="px-6 py-4 text-slate-600">{e.enrolled_at}</td>
                  <td>
                    {e.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle size={14} />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Clock size={14} />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
