import HourlyCard from "./HourlyCard";
import WeatherDetailCard from "./WeatherDetailCard";
import weatherIconsImage from "../assests/weather icons.png";
import weatherIconsTwoImage from "../assests/weather icons 2.png";
import weatherIconsThreeImage from "../assests/weather icons 3.png";

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "--";
}

function formatHour(timestamp, timezoneOffset) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: "UTC"
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

function formatTime(timestamp, timezoneOffset) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

function formatDayLabel(timestamp, timezoneOffset) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC"
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

function formatVisibility(value) {
  if (!value && value !== 0) {
    return "--";
  }

  return `${(value / 1000).toFixed(1)} km`;
}

function getForecastIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function buildDailyForecast(items, timezoneOffset) {
  const grouped = new Map();

  items.forEach((item) => {
    const localDate = new Date((item.dt + timezoneOffset) * 1000);
    const key = localDate.toISOString().slice(0, 10);
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        dt: item.dt,
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather?.[0]?.icon,
        label: formatDayLabel(item.dt, timezoneOffset)
      });
      return;
    }

    existing.min = Math.min(existing.min, item.main.temp_min);
    existing.max = Math.max(existing.max, item.main.temp_max);
  });

  return Array.from(grouped.values()).slice(0, 5);
}

function getEstimatedUvIndex(weather) {
  const clouds = weather?.clouds?.all ?? 0;
  const condition = weather?.weather?.[0]?.main?.toLowerCase() ?? "";

  if (condition.includes("clear")) {
    return "6 High";
  }

  if (clouds < 30) {
    return "5 Moderate";
  }

  if (clouds < 70) {
    return "4 Moderate";
  }

  return "2 Low";
}

function buildDetails(weather, forecast, timezoneOffset) {
  const rainfall =
    weather?.rain?.["1h"] ??
    weather?.rain?.["3h"] ??
    forecast?.list?.[0]?.rain?.["3h"] ??
    0;

  return [
    {
      icon: "◌",
      label: "Visibility",
      value: formatVisibility(weather.visibility),
      note: "Current range"
    },
    {
      icon: "↗",
      label: "Wind Speed",
      value: `${Math.round(weather.wind.speed)} m/s`,
      note: "Air flow"
    },
    {
      icon: "☼",
      label: "UV Index",
      value: getEstimatedUvIndex(weather),
      note: "Estimated"
    },
    {
      icon: "◔",
      label: "Pressure",
      value: `${weather.main.pressure} hPa`,
      note: "Atmospheric"
    },
    {
      icon: "☀",
      label: "Sunrise",
      value: formatTime(weather.sys.sunrise, timezoneOffset),
      note: "Morning light"
    },
    {
      icon: "☂",
      label: "Rainfall",
      value: `${rainfall.toFixed(1)} mm`,
      note: "Recent volume"
    },
    {
      icon: "≈",
      label: "Feels Like",
      value: `${Math.round(weather.main.feels_like)}°C`,
      note: "Perceived temp"
    }
  ];
}

function EmptyState() {
  return (
    <section className="content-stack">
      <section className="surface-card section-card">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Hourly Forecast</p>
            <h2 className="section-title">Search to unlock your premium forecast view</h2>
          </div>
        </div>
        <p className="section-description">
          Once you search for a city, this area will show hourly weather cards, a daily
          forecast list, and detailed condition cards like a premium mobile app.
        </p>
      </section>
    </section>
  );
}

function WeatherCard({ weather, forecast }) {
  if (!weather || !forecast?.list?.length) {
    return <EmptyState />;
  }

  const timezoneOffset = forecast.city?.timezone ?? weather.timezone ?? 0;
  const hourlyItems = forecast.list.slice(0, 8);
  const dailyItems = buildDailyForecast(forecast.list, timezoneOffset);
  const details = buildDetails(weather, forecast, timezoneOffset);

  return (
    <section className="content-stack" aria-live="polite">
      <section
        className="surface-card section-card section-card--art"
        style={{ "--card-art": `url(${weatherIconsImage})` }}
      >
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Hourly Forecast</p>
            <h2 className="section-title">Next hours</h2>
          </div>
        </div>

        <div className="hourly-scroll">
          {hourlyItems.map((item) => (
            <HourlyCard
              key={item.dt}
              time={formatHour(item.dt, timezoneOffset)}
              icon={getForecastIcon(item.weather?.[0]?.icon)}
              label={capitalize(item.weather?.[0]?.main)}
              temperature={`${Math.round(item.main.temp)}°`}
            />
          ))}
        </div>
      </section>

      <section
        className="surface-card section-card section-card--art"
        style={{ "--card-art": `url(${weatherIconsTwoImage})` }}
      >
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Daily Forecast</p>
            <h2 className="section-title">This week</h2>
          </div>
        </div>

        <div className="daily-list">
          {dailyItems.map((day) => (
            <div key={day.dt} className="daily-row">
              <div className="daily-left">
                <img
                  className="daily-icon"
                  src={getForecastIcon(day.icon)}
                  alt={`${day.label} weather icon`}
                />
                <div>
                  <p className="daily-day">{day.label}</p>
                  <p className="daily-copy">High confidence forecast</p>
                </div>
              </div>

              <div className="daily-temps">
                <span className="daily-temp daily-temp--min">{Math.round(day.min)}°</span>
                <span className="daily-temp">{Math.round(day.max)}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="surface-card section-card section-card--art"
        style={{ "--card-art": `url(${weatherIconsThreeImage})` }}
      >
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Weather Details</p>
            <h2 className="section-title">Today&apos;s metrics</h2>
          </div>
        </div>

        <div className="details-grid">
          {details.map((detail) => (
            <WeatherDetailCard
              key={detail.label}
              icon={detail.icon}
              label={detail.label}
              value={detail.value}
              note={detail.note}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

export default WeatherCard;
