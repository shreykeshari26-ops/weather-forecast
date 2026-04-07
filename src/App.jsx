import { useState } from "react";
import SearchBar from "./components/SearchBar";
import TabBar from "./components/TabBar";
import WeatherCard from "./components/WeatherCard";
import WeatherAnimation from "./components/WeatherAnimation";



  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function App() {
  const [status, setStatus] = useState("Enter a city to fetch the latest weather.");
  const [statusError, setStatusError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(city) {
    if (!city) {
      setStatus("Enter a city name to continue.");
      setStatusError(true);
      setWeather(null);
      setForecast(null);
      return;
    }

    if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
      setStatus("Add your OpenWeather API key in VITE_OPENWEATHER_API_KEY.");
      setStatusError(true);
      return;
    }

    setIsLoading(true);
    setStatus("Fetching weather...");
    setStatusError(false);
    setWeather(null);
    setForecast(null);

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`${WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
        fetch(`${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      ]);
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || "Unable to fetch weather data.");
      }

      if (!forecastResponse.ok) {
        throw new Error(forecastData.message || "Unable to fetch forecast data.");
      }

      setWeather(weatherData);
      setForecast(forecastData);
      setStatus(`Current weather for ${weatherData.name}.`);
    } catch (error) {
      setStatus(error.message);
      setStatusError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const cityName = weather?.name || "Search City";
  const temperature = weather ? `${Math.round(weather.main.temp)}°C` : "--°C";
  const condition = weather?.weather?.[0]?.main || "Weather Forecast";

  return (
    <div className="app-shell">
      <div className="app-ambient app-ambient-one" />
      <div className="app-ambient app-ambient-two" />
      <div className="app-ambient app-ambient-three" />

      <main className="site-frame">
        <div className="site-screen">
          <section className="hero-card">
            <div className="hero-glow hero-glow-left" />
            <div className="hero-glow hero-glow-right" />
            <div className="hero">
              {weather && (
             <WeatherAnimation condition={weather.weather[0].main} />
             )}
          </div>

            

            <div className="hero-content">
              <div className="hero-copy">
                <p className="hero-subtitle">Weather Forecast</p>
                <h1 className="hero-city">{cityName}</h1>
                <p className="hero-temperature">{temperature}</p>
                <p className="hero-condition">{condition}</p>
              </div>

              <SearchBar onSearch={handleSearch} isLoading={isLoading} />

              <p className={`status-message ${statusError ? "is-error" : ""}`}>{status}</p>
            </div>
          </section>

          <WeatherCard weather={weather} forecast={forecast} />
        </div>

        <TabBar />
      </main>
    </div>
  );
}

export default App;
