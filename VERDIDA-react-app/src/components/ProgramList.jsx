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
  const [statusModal, setStatusModal] = useState({
    open: false,
    program: null,
    status: 'active',
  });
  const [statusSaveLoading, setStatusSaveLoading] = useState(false);
  const [statusSaveError, setStatusSaveError] = useState('');
  const [statusSaveNotice, setStatusSaveNotice] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({
    code: '',
    name: '',
    department: '',
    type: "Bachelor's",
    duration: '4 years',
    totalUnits: '',
    capacity: '',
    status: 'active',
  });
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

  const programs = useMemo(() => data?.data ?? [], [data]);
  const selectedProgram = id ? programs.find((p) => p.id === Number(id)) : null;

  const filteredPrograms = useMemo(() => {
    const normalizeType = (value) =>
      String(value || '')
        .toLowerCase()
        .replace(/’/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

    return programs.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.code?.toLowerCase().includes(q) && !p.name?.toLowerCase().includes(q)) return false;
      }
      if (filters.status && p.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.type && normalizeType(p.type) !== normalizeType(filters.type)) return false;
      return true;
    });
  }, [programs, filters.search, filters.status, filters.type]);

  const handleProgramClick = (program) => {
    navigate(`/dashboard/programs/${program.id}`);
  };

  const openStatusModal = (program) => {
    setStatusSaveNotice('');
    setStatusSaveError('');
    setStatusModal({
      open: true,
      program,
      status: String(program?.status || 'active').toLowerCase(),
    });
  };

  const closeStatusModal = () => {
    setStatusSaveError('');
    setStatusModal({
      open: false,
      program: null,
      status: 'active',
    });
  };

  const openCreateModal = () => {
    setCreateError('');
    setCreateForm({
      code: '',
      name: '',
      department: '',
      type: "Bachelor's",
      duration: '4 years',
      totalUnits: '',
      capacity: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const closeCreateModal = () => {
    if (createLoading) return;
    setShowModal(false);
    setCreateError('');
  };

  const saveNewProgram = async () => {
    try {
      setCreateLoading(true);
      setCreateError('');

      await api.createProgram(createForm);

      const refreshedPrograms = await api.getPrograms();
      setData(refreshedPrograms);
      setStatusSaveNotice('Program added successfully.');
      setShowModal(false);
    } catch (error) {
      setCreateError(error?.message || 'Failed to add program.');
    } finally {
      setCreateLoading(false);
    }
  };

  const saveProgramStatus = async () => {
    if (!statusModal.program) return;

    try {
      setStatusSaveLoading(true);
      setStatusSaveError('');
      setStatusSaveNotice('');

      const result = await api.updateProgramStatus(statusModal.program.id, statusModal.status);

      const refreshedPrograms = await api.getPrograms();
      setData(refreshedPrograms);

      if (result?.localOnly) {
        setStatusSaveNotice(result.message || 'Status updated locally.');
      }

      closeStatusModal();
    } catch (error) {
      setStatusSaveError(error?.message || 'Failed to update program status.');
    } finally {
      setStatusSaveLoading(false);
    }
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
              onClick={openCreateModal}
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
              <ProgramCard
                key={p.id}
                program={p}
                onClick={handleProgramClick}
                onEditStatus={openStatusModal}
              />
            ))}
          </div>

          {statusSaveNotice && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {statusSaveNotice}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeCreateModal}>
              <div className="mx-4 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Program</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Code</label>
                    <input
                      type="text"
                      placeholder="e.g. BSIT"
                      value={createForm.code}
                      onChange={(e) => setCreateForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Name</label>
                    <input
                      type="text"
                      placeholder="Full program name"
                      value={createForm.name}
                      onChange={(e) => setCreateForm((current) => ({ ...current, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. College of Computing Education"
                      value={createForm.department}
                      onChange={(e) => setCreateForm((current) => ({ ...current, department: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Type</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm((current) => ({ ...current, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    >
                      {filters.typeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 years"
                      value={createForm.duration}
                      onChange={(e) => setCreateForm((current) => ({ ...current, duration: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Units</label>
                    <input
                      type="number"
                      placeholder="156"
                      value={createForm.totalUnits}
                      onChange={(e) => setCreateForm((current) => ({ ...current, totalUnits: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      placeholder="e.g. 200"
                      value={createForm.capacity}
                      onChange={(e) => setCreateForm((current) => ({ ...current, capacity: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={createForm.status}
                      onChange={(e) => setCreateForm((current) => ({ ...current, status: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                    >
                      <option value="active">active</option>
                      <option value="phased out">phased out</option>
                      <option value="under review">under review</option>
                    </select>
                  </div>
                </div>

                {createError && (
                  <p className="mt-4 text-sm text-rose-600">{createError}</p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={saveNewProgram}
                    disabled={createLoading}
                    className="flex-1 rounded-xl bg-red-800 px-4 py-2 font-medium text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={createLoading}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {statusModal.open && statusModal.program && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeStatusModal}>
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Update Program Status</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {statusModal.program.code} - {statusModal.program.name}
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={statusModal.status}
                    onChange={(e) =>
                      setStatusModal((current) => ({
                        ...current,
                        status: e.target.value,
                      }))
                    }
                    disabled={statusSaveLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/50"
                  >
                    {filters.statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {statusSaveError && (
                  <p className="mt-3 text-sm text-rose-600">{statusSaveError}</p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={saveProgramStatus}
                    disabled={statusSaveLoading}
                    className="flex-1 px-4 py-2 bg-red-800 text-white rounded-xl font-medium hover:bg-red-900 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {statusSaveLoading ? 'Saving...' : 'Save Status'}
                  </button>
                  <button
                    type="button"
                    onClick={closeStatusModal}
                    disabled={statusSaveLoading}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
