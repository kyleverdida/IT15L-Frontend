const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=7.4475&longitude=125.8092&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=Asia%2FManila';

export async function fetchWeather() {
  const response = await fetch(WEATHER_URL);
  if (!response.ok) {
    throw new Error('Unable to fetch weather information.');
  }

  const data = await response.json();

  return {
    current: {
      temperature: data.current?.temperature_2m,
      weatherCode: data.current?.weather_code,
    },
    forecast: (data.daily?.time || []).map((date, index) => ({
      date,
      max: data.daily?.temperature_2m_max?.[index],
      min: data.daily?.temperature_2m_min?.[index],
      weatherCode: data.daily?.weather_code?.[index],
    })),
  };
}
