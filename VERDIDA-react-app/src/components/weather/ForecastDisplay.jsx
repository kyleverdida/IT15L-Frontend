const dayLabel = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { weekday: 'short' });

export default function ForecastDisplay({ forecast = [] }) {
  if (!forecast.length) {
    return <p className="text-sm text-slate-500">No forecast data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {forecast.map((item) => (
        <article
          key={item.date}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center"
        >
          <p className="text-xs font-medium text-slate-700">{dayLabel(item.date)}</p>
          <img
            className="mx-auto mt-1"
            src={item.icon}
            alt={item.condition}
            width={44}
            height={44}
            loading="lazy"
          />
          <p className="text-xs text-slate-600">{item.condition}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {Math.round(item.max_temp_c)}C / {Math.round(item.min_temp_c)}C
          </p>
          <p className="text-[11px] text-slate-500">Humidity {item.humidity}%</p>
          <p className="text-[11px] text-slate-500">Wind {item.max_wind_kph} kph</p>
        </article>
      ))}
    </div>
  );
}
