export default function StatWidget({ icon, label, value, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 widget-card hover:border-slate-200 transition">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.up ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {trend.up ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm mt-4">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
