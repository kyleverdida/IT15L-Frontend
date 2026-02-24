import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { api } from '../api/apiService';
import SubjectCard from './SubjectCard';
import SubjectDetails from './SubjectDetails';

export default function SubjectList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    units: '',
    hasPrerequisite: '',
    program: '',
  });

  useEffect(() => {
    api.getSubjects().then(setData);
  }, []);

  const subjects = data?.data ?? [];
  const programs = [...new Set(subjects.map((s) => s.program_code).filter(Boolean))];
  const selectedSubject = id ? subjects.find((s) => s.id === Number(id)) : null;

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.code?.toLowerCase().includes(q) && !s.title?.toLowerCase().includes(q)) return false;
      }
      if (filters.semester && s.semester_offer?.toLowerCase() !== filters.semester.toLowerCase()) return false;
      if (filters.units && String(s.units) !== filters.units) return false;
      if (filters.hasPrerequisite === 'with' && (!s.prerequisites || s.prerequisites.length === 0)) return false;
      if (filters.hasPrerequisite === 'without' && s.prerequisites?.length > 0) return false;
      if (filters.program && s.program_code !== filters.program) return false;
      return true;
    });
  }, [subjects, filters.search, filters.semester, filters.units, filters.hasPrerequisite, filters.program]);

  const unitsOptions = [...new Set(subjects.map((s) => s.units).filter(Boolean))].sort((a, b) => a - b);

  const handleSubjectClick = (subject) => {
    navigate(`/dashboard/subjects/${subject.id}`);
  };

  return (
    <>
      {selectedSubject ? (
        <SubjectDetails subject={selectedSubject} />
      ) : (
        <div className="p-6 lg:p-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Subject Offerings</h1>
              <p className="text-slate-500 text-sm mt-1">{filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900 transition"
            >
              <Plus size={18} />
              Add Subject
            </button>
          </header>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by subject code or title..."
                value={filters.search ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
              />
            </div>
            <select
              value={filters.semester ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, semester: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">All semesters/terms</option>
              <option value="semester">Per Semester</option>
              <option value="term">Per Term</option>
              <option value="both">Both</option>
            </select>
            <select
              value={filters.units ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, units: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">All units</option>
              {unitsOptions.map((u) => (
                <option key={u} value={u}>{u} units</option>
              ))}
            </select>
            <select
              value={filters.hasPrerequisite ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, hasPrerequisite: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">Pre-requisites</option>
              <option value="with">With pre-requisites</option>
              <option value="without">Without pre-requisites</option>
            </select>
            <select
              value={filters.program ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, program: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">All programs</option>
              {programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((s) => (
              <SubjectCard key={s.id} subject={s} onClick={handleSubjectClick} />
            ))}
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Subject Details (Modal View)</h3>
                <p className="text-slate-500 text-sm mb-4">Modal view for subject details. Design placeholder.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                    <input type="text" placeholder="e.g. IT101" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject Title</label>
                    <input type="text" placeholder="Subject name" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Units</label>
                    <input type="number" placeholder="3" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester / Term</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl">
                      <option value="semester">Per Semester</option>
                      <option value="term">Per Term</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl">
                      {programs.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pre-requisites (comma separated)</label>
                    <input type="text" placeholder="IT101, IT102" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Co-requisites (comma separated)</label>
                    <input type="text" placeholder="IT103" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900">Save</button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
