import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  'phased out': 'bg-red-100 text-red-700',
  'under review': 'bg-amber-100 text-amber-700',
};

export default function ProgramDetails({ program }) {
  const navigate = useNavigate();
  if (!program) return null;

  const status = program.status?.toLowerCase() ?? 'active';
  const statusClass = statusColors[status] ?? statusColors.active;
  const yearLevels = program.year_levels ?? {};

  return (
    <div className="p-6 lg:p-8">
      <button
        onClick={() => navigate('/dashboard/programs')}
        className="flex items-center gap-2 text-slate-600 hover:text-red-800 mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back to programs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-800">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm font-mono font-medium text-red-800">{program.code}</p>
              <h1 className="text-2xl font-bold text-slate-800 mt-1">{program.name}</h1>
              <p className="text-slate-500 mt-2">{program.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-slate-600">{program.type}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{program.duration}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{program.total_units} total units</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusClass}`}>
                  {program.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Subjects by year level</h2>
          <div className="space-y-6">
            {Object.entries(yearLevels).map(([year, subjects]) => (
              <div key={year} className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 text-slate-700 font-medium">{year}</div>
                <ul className="divide-y divide-slate-100">
                  {subjects.map((s) => (
                    <li key={s.id} className="px-4 py-3 grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-2 font-mono text-sm text-red-800">{s.code}</span>
                      <span className="col-span-5 font-medium text-slate-800">{s.title}</span>
                      <span className="col-span-2 text-slate-500 text-sm text-right">{s.units} units</span>
                      <span className="col-span-3 text-slate-400 text-sm text-right">{s.semester} sem</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
