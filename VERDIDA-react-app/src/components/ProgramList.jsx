import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { api } from '../api/apiService';
import ProgramCard from './ProgramCard';
import ProgramDetails from './ProgramDetails';

export default function ProgramList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    searchPlaceholder: 'Search by program code or name...',
    statusOptions: ['active', 'phased out', 'under review'],
    typeOptions: ["Bachelor's", 'Diploma', "Master's"],
  });

  useEffect(() => {
    api.getPrograms().then(setData);
  }, []);

  const programs = data?.data ?? [];
  const selectedProgram = id ? programs.find((p) => p.id === Number(id)) : null;

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.code?.toLowerCase().includes(q) && !p.name?.toLowerCase().includes(q)) return false;
      }
      if (filters.status && p.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.type && p.type !== filters.type) return false;
      return true;
    });
  }, [programs, filters.search, filters.status, filters.type]);

  const handleProgramClick = (program) => {
    navigate(`/dashboard/programs/${program.id}`);
  };

  return (
    <>
      {selectedProgram ? (
        <ProgramDetails program={selectedProgram} />
      ) : (
        <div className="p-6 lg:p-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Program Offerings</h1>
              <p className="text-slate-500 text-sm mt-1">{filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900 transition"
            >
              <Plus size={18} />
              Add Program
            </button>
          </header>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={filters.searchPlaceholder}
                value={filters.search ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
              />
            </div>
            <select
              value={filters.status ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">All statuses</option>
              {filters.statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={filters.type ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
            >
              <option value="">All types</option>
              {filters.typeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((p) => (
              <ProgramCard key={p.id} program={p} onClick={handleProgramClick} />
            ))}
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add/Edit Program (Design Only)</h3>
                <p className="text-slate-500 text-sm mb-4">This is a design placeholder. No backend integration.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Code</label>
                    <input type="text" placeholder="e.g. BSIT" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Name</label>
                    <input type="text" placeholder="Full program name" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Type</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl">
                      <option>Bachelor&apos;s</option>
                      <option>Diploma</option>
                      <option>Master&apos;s</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input type="text" placeholder="e.g. 4 years" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Units</label>
                    <input type="number" placeholder="156" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl">
                      <option>active</option>
                      <option>phased out</option>
                      <option>under review</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900">Save</button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
