import { CloudSun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchWeather, fetchWeatherByCoordinates } from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';

export default function WeatherWidget() {
  const [city, setCity] = useState('Tagum City');
  const [state, setState] = useState({
    loading: true,
    error: '',
    warning: '',
    weather: null,
    meta: null,
  });

  const loadByCity = async (cityName) => {
    const payload = await fetchWeather({ city: cityName, days: 5 });
    setState({
      loading: false,
      error: '',
      warning: payload?.meta?.warning || '',
      weather: payload?.data || null,
      meta: payload?.meta || null,
    });
  };

  const loadByCoordinates = async (lat, lon) => {
    const payload = await fetchWeatherByCoordinates({ lat, lon, days: 5 });
    setState({
      loading: false,
      error: '',
      warning: payload?.meta?.warning || '',
      weather: payload?.data || null,
      meta: payload?.meta || null,
    });
  };

  useEffect(() => {
    let mounted = true;

    fetchWeather({ city: 'Tagum City', days: 5 })
      .then((payload) => {
        if (mounted) {
          setState({
            loading: false,
            error: '',
            warning: payload?.meta?.warning || '',
            weather: payload?.data || null,
            meta: payload?.meta || null,
          });
        }
      })
      .catch((error) => {
        if (mounted) {
          setState({
            loading: false,
            error: error?.message || 'Unable to load weather.',
            warning: '',
            weather: null,
            meta: null,
          });
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

  const onSubmit = async (event) => {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: '', warning: '' }));
    try {
      await loadByCity(trimmedCity);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || 'Unable to load weather.',
        warning: '',
      }));
    }
  };

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not available in this browser.' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: '', warning: '' }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await loadByCoordinates(position.coords.latitude, position.coords.longitude);
        } catch (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error?.message || 'Unable to load weather.',
            warning: '',
          }));
        }
      },
      () => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Unable to retrieve your location.',
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <CloudSun size={18} className="text-sky-600" />
        <p className="text-sm font-semibold text-slate-900">
          {state.weather.location?.name || 'Weather'} Weather
        </p>
        <span className="text-sm text-slate-500">
          {Math.round(state.weather.current.temperature_c)}C
        </span>
      </div>

      <form onSubmit={onSubmit} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Search city"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
          Search
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
        >
          Use location
        </button>
      </form>

      {state.warning ? (
        <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {state.warning}
        </p>
      ) : null}

      {state.loading ? (
        <div className="mb-3 h-8 animate-pulse rounded bg-slate-100" />
      ) : (
        <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-medium text-slate-900">{state.weather.current.condition}</p>
          <p>Humidity: {state.weather.current.humidity}%</p>
          <p>Wind: {state.weather.current.wind_kph} kph</p>
          {state.meta?.stale ? <p className="text-xs text-amber-700">Showing cached data.</p> : null}
        </div>
      )}

      <ForecastDisplay forecast={state.weather.forecast} />
    </section>
  );
}
