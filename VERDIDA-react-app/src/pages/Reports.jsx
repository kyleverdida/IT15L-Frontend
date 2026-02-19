import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const reportTypes = [
  { title: 'Enrollment Summary', description: 'Overview of enrollments by course and period', icon: TrendingUp },
  { title: 'Student Roster', description: 'List of enrolled students by course', icon: FileText },
  { title: 'Academic Calendar', description: 'Important dates and deadlines', icon: Calendar },
];

export default function Reports() {
  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate and download enrollment reports</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-100 text-cyan-600">
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-cyan-600 text-sm font-medium hover:text-cyan-700 transition">
                  <Download size={16} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
