import { BookOpen } from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  'phased out': 'bg-red-100 text-red-700',
  'under review': 'bg-amber-100 text-amber-700',
};

export default function ProgramCard({ program, onClick }) {
  const status = program.status?.toLowerCase() ?? 'active';
  const statusClass = statusColors[status] ?? statusColors.active;

  return (
    <div
      onClick={() => onClick?.(program)}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-red-200 transition cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-50 text-red-800 group-hover:bg-red-100 group-hover:text-red-900 transition">
          <BookOpen size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono font-medium text-red-800">{program.code}</p>
          <h3 className="font-semibold text-slate-800 mt-1 line-clamp-2">{program.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{program.type}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <span className="text-slate-600">{program.duration}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{program.total_units} units</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusClass}`}>
              {program.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
