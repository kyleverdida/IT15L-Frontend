import { BookOpen } from 'lucide-react';

const semesterBadges = {
  semester: { label: 'Semester', class: 'bg-red-50 text-red-800' },
  term: { label: 'Term', class: 'bg-red-100 text-red-700' },
  both: { label: 'Both', class: 'bg-emerald-100 text-emerald-700' },
};

export default function SubjectCard({ subject, onClick }) {
  const offerType = subject.semester_offer?.toLowerCase() ?? 'semester';
  const badge = semesterBadges[offerType] ?? semesterBadges.semester;

  return (
    <div
      onClick={() => onClick?.(subject)}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-red-200 transition cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-50 text-red-800 group-hover:bg-red-100 group-hover:text-red-900 transition">
          <BookOpen size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono font-medium text-red-800">{subject.code}</p>
          <h3 className="font-semibold text-slate-800 mt-1">{subject.title}</h3>
          {subject.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{subject.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <span className="text-slate-600">{subject.units} units</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{subject.program_code ?? subject.program}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${badge.class}`}>
              {badge.label}
            </span>
            {subject.prerequisites?.length > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                Has pre-reqs
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
