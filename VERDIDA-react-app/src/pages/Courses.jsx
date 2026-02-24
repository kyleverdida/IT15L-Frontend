import { useEffect, useState } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import { api } from '../api/apiService';

export default function Courses() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getCourses().then(setData);
  }, []);

  const courses = data?.data ?? [];

  return (
    <div className="p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{data?.meta?.total ?? 0} active courses</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900 transition">
          <Plus size={18} />
          Add Course
        </button>
      </header>

      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-50 text-red-800">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-red-800">{c.code}</p>
                <h3 className="font-semibold text-slate-800 mt-1">{c.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.department}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="text-slate-600">{c.units} units</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{c.enrolled}/{c.slots} slots</span>
                </div>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-700 rounded-full"
                    style={{ width: `${(c.enrolled / c.slots) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
