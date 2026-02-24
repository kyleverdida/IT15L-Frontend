import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const semesterBadges = {
  semester: { label: 'Per Semester', class: 'bg-red-50 text-red-800' },
  term: { label: 'Per Term', class: 'bg-red-100 text-red-700' },
  both: { label: 'Both Semester & Term', class: 'bg-emerald-100 text-emerald-700' },
};

export default function SubjectDetails({ subject }) {
  const navigate = useNavigate();
  if (!subject) return null;

  const offerType = subject.semester_offer?.toLowerCase() ?? 'semester';
  const badge = semesterBadges[offerType] ?? semesterBadges.semester;
  const preReqs = subject.prerequisites ?? [];
  const coReqs = subject.co_requisites ?? [];

  return (
    <div className="p-6 lg:p-8">
      <button
        onClick={() => navigate('/dashboard/subjects')}
        className="flex items-center gap-2 text-slate-600 hover:text-red-800 mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back to subjects
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-800">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm font-mono font-medium text-red-800">{subject.code}</p>
              <h1 className="text-2xl font-bold text-slate-800 mt-1">{subject.title}</h1>
              <p className="text-slate-500 mt-2">{subject.description ?? 'No description.'}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-slate-600">{subject.units} units</span>
                <span className="text-slate-400">•</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${badge.class}`}>
                  {badge.label}
                </span>
                <span className="text-slate-600">{subject.term_offer ?? subject.semester ?? '—'} offered</span>
                <span className="text-slate-600">Program: {subject.program_code ?? subject.program ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-6 lg:pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-100 rounded-xl p-4">
            <h3 className="font-medium text-slate-700 mb-2">Pre-requisites</h3>
            <p className="text-slate-600">{preReqs.length > 0 ? preReqs.join(', ') : 'none'}</p>
          </div>
          <div className="border border-slate-100 rounded-xl p-4">
            <h3 className="font-medium text-slate-700 mb-2">Co-requisites</h3>
            <p className="text-slate-600">{coReqs.length > 0 ? coReqs.join(', ') : 'none'}</p>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 md:col-span-2">
            <h3 className="font-medium text-slate-700 mb-2">Program assignment</h3>
            <p className="text-slate-600">{subject.program_code ?? subject.program ?? 'none'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
