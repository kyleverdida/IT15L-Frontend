import { CloudSun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchWeather } from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';

export default function WeatherWidget() {
  const [state, setState] = useState({ loading: true, error: '', weather: null });

  useEffect(() => {
    let mounted = true;

    fetchWeather()
      .then((weather) => {
        if (mounted) {
          setState({ loading: false, error: '', weather });
        }
      })
      .catch(() => {
        if (mounted) {
          setState({ loading: false, error: 'Unable to load weather.', weather: null });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (state.error || !state.weather) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">{state.error || 'Weather unavailable.'}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CloudSun size={18} className="text-sky-600" />
        <p className="text-sm font-semibold text-slate-900">Tagum City Weather</p>
        <span className="text-sm text-slate-500">
          {Math.round(state.weather.current.temperature)}C
        </span>
      </div>
      <ForecastDisplay forecast={state.weather.forecast} />
    </section>
  );
}
