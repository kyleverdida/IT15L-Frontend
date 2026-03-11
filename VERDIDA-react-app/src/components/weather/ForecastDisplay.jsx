const dayLabel = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { weekday: 'short' });

export default function ForecastDisplay({ forecast }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {forecast.map((item) => (
        <div key={item.date} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-3 text-center">
          <p className="text-xs font-medium text-slate-700">{dayLabel(item.date)}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{Math.round(item.max)}C</p>
          <p className="text-xs text-slate-500">{Math.round(item.min)}C</p>
        </div>
      ))}
    </div>
  );
}
