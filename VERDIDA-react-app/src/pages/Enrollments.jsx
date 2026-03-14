import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Search, AlertCircle } from 'lucide-react';
import { api } from '../api/apiService';

function toDate(value) {
  if (!value) return null;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function prettyDate(input) {
  const date = toDate(input);
  if (!date) return 'Unknown date';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}


export default function Enrollments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const enrollmentResponse = await api.getEnrollments();

        if (!mounted) return;

        setEnrollments(enrollmentResponse?.data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load enrollment data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredEnrollments = useMemo(() => {
    if (!normalizedSearch) {
      return enrollments;
    }

    return enrollments.filter((item) => {
      const student = String(item.student_name || '').toLowerCase();
      const course = String(item.course_code || '').toLowerCase();
      const status = String(item.status || '').toLowerCase();
      const date = prettyDate(item.enrolled_at).toLowerCase();

      return (
        student.includes(normalizedSearch) ||
        course.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        date.includes(normalizedSearch)
      );
    });
  }, [enrollments, normalizedSearch]);

  const totalPending = enrollments.filter((item) => item.status === 'pending').length;
  const summaryText = loading
    ? 'Loading enrollment records...'
    : `${enrollments.length} total records, ${totalPending} pending`;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enrollments</h1>
          <p className="mt-1 text-sm text-slate-500">{summaryText}</p>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarDays size={18} />
              <h2 className="text-base font-semibold">Enrollment Records</h2>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by student, course, status..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm">
                  <th className="px-5 py-3 text-left font-medium">Student</th>
                  <th className="px-5 py-3 text-left font-medium">Course</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={4}>
                      Loading enrollment data...
                    </td>
                  </tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={4}>
                      No enrollment records found.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100 text-sm text-slate-700">
                      <td className="px-5 py-3">{row.student_name || 'Unknown Student'}</td>
                      <td className="px-5 py-3">{row.course_code || '-'}</td>
                      <td className="px-5 py-3">{prettyDate(row.enrolled_at)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            String(row.status).toLowerCase() === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {String(row.status || 'confirmed')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
