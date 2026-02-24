import { CloudSun, CloudRain, Sun, Cloud } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

const getWeatherIcon = (code) => {
  if (code <= 2) return <Sun className="text-amber-400" size={24} />;
  if (code <= 4) return <Cloud className="text-slate-400" size={24} />;
  return <CloudRain className="text-blue-400" size={24} />;
};

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-8 h-8 rounded-full border-2 border-red-800/30 border-t-red-800 animate-spin" />
        <span className="text-sm text-slate-500">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
        <CloudSun className="text-slate-400" size={24} />
        <span className="text-sm text-slate-500">Tagum City: --</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
      {getWeatherIcon(weather.weathercode)}
      <div>
        <span className="text-sm font-semibold text-slate-800">Tagum City</span>
        <span className="text-sm text-slate-600 ml-2">{Math.round(weather.temperature)}°C</span>
      </div>
    </div>
  );
}
