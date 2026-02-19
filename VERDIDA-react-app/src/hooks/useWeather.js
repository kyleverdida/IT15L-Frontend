import { useState, useEffect } from 'react';

// Open-Meteo API - free, no API key required
// Tagum City, Philippines: lat 7.4475, lon 125.8092
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=7.4475&longitude=125.8092&current_weather=true&timezone=Asia/Manila';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(WEATHER_API)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current_weather);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { weather, loading, error };
}
