const SESSION_KEY = 'session';
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const API_KEY = import.meta.env.VITE_API_KEY || '';
const API_KEY_HEADER = import.meta.env.VITE_API_KEY_HEADER || 'X-API-KEY';

function getToken() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token || null;
  } catch {
    return null;
  }
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  return query.toString();
}

async function requestWeather(params = {}) {
  const token = getToken();
  const query = buildQuery({ ...params, days: params.days ?? 5 });
  const response = await fetch(`${API_BASE}/weather?${query}`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(API_KEY ? { [API_KEY_HEADER]: API_KEY } : {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Unable to load weather data (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function fetchWeather({ city = 'Tagum City', days = 5 } = {}) {
  return requestWeather({ city, days });
}

export async function fetchWeatherByCoordinates({ lat, lon, days = 5 }) {
  return requestWeather({ lat, lon, days });
}
