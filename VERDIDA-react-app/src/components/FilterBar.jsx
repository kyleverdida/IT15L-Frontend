export default function FilterBar({ filters, onChange, searchPlaceholder = 'Search...' }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
        />
      </div>
      {filters.statusOptions && (
        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">All statuses</option>
          {filters.statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {filters.typeOptions && (
        <select
          value={filters.type ?? ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">All types</option>
          {filters.typeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {filters.semesterOptions && (
        <select
          value={filters.semester ?? ''}
          onChange={(e) => onChange({ ...filters, semester: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">All semesters/terms</option>
          {filters.semesterOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {filters.unitsOptions && (
        <select
          value={filters.units ?? ''}
          onChange={(e) => onChange({ ...filters, units: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">All units</option>
          {filters.unitsOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {filters.prerequisiteFilter && (
        <select
          value={filters.hasPrerequisite ?? ''}
          onChange={(e) => onChange({ ...filters, hasPrerequisite: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">Pre-requisites</option>
          <option value="with">With pre-requisites</option>
          <option value="without">Without pre-requisites</option>
        </select>
      )}
      {filters.programOptions && (
        <select
          value={filters.program ?? ''}
          onChange={(e) => onChange({ ...filters, program: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50 bg-white"
        >
          <option value="">All programs</option>
          {filters.programOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
}
