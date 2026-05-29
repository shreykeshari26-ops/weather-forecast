import { NextRequest, NextResponse } from "next/server";
import type {
  OWMCurrentWeather,
  OWMForecastResponse,
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "@/lib/weather-types";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

function formatDayLabel(ts: number, tz: number): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date((ts + tz) * 1000));
}

function formatShortDay(ts: number, tz: number): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date((ts + tz) * 1000));
}

function processCurrent(raw: OWMCurrentWeather): CurrentWeather {
  return {
    city: raw.name,
    country: raw.sys.country,
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    tempMin: raw.main.temp_min,
    tempMax: raw.main.temp_max,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    visibility: raw.visibility,
    condition: raw.weather[0]?.main ?? "Clear",
    conditionDescription: raw.weather[0]?.description ?? "",
    icon: raw.weather[0]?.icon ?? "01d",
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    windGust: raw.wind.gust ?? raw.wind.speed,
    clouds: raw.clouds.all,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    timezone: raw.timezone,
    dt: raw.dt,
    rainfall:
      raw.rain?.["1h"] ?? raw.rain?.["3h"] ?? 0,
  };
}

function processHourly(
  items: OWMForecastResponse["list"],
  _tz: number
): HourlyForecast[] {
  return items.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0]?.icon ?? "01d",
    condition: item.weather[0]?.main ?? "Clear",
    description: item.weather[0]?.description ?? "",
    windSpeed: item.wind.speed,
    humidity: item.main.humidity,
    pop: item.pop,
  }));
}

function processDaily(
  items: OWMForecastResponse["list"],
  tz: number
): DailyForecast[] {
  const grouped = new Map<
    string,
    {
      dt: number;
      min: number;
      max: number;
      icon: string;
      condition: string;
      description: string;
      humidity: number;
      windSpeed: number;
    }
  >();

  for (const item of items) {
    const localDate = new Date((item.dt + tz) * 1000);
    const key = localDate.toISOString().slice(0, 10);
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        dt: item.dt,
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0]?.icon ?? "01d",
        condition: item.weather[0]?.main ?? "Clear",
        description: item.weather[0]?.description ?? "",
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      });
    } else {
      existing.min = Math.min(existing.min, item.main.temp_min);
      existing.max = Math.max(existing.max, item.main.temp_max);
    }
  }

  return Array.from(grouped.values())
    .slice(0, 7)
    .map((d) => ({
      ...d,
      day: formatDayLabel(d.dt, tz),
      dayShort: formatShortDay(d.dt, tz),
    }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(
        `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      ),
      fetch(
        `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      ),
    ]);

    if (!weatherRes.ok) {
      const err = await weatherRes.json();
      return NextResponse.json(
        { error: err.message || "City not found" },
        { status: weatherRes.status }
      );
    }

    if (!forecastRes.ok) {
      const err = await forecastRes.json();
      return NextResponse.json(
        { error: err.message || "Forecast unavailable" },
        { status: forecastRes.status }
      );
    }

    const rawWeather: OWMCurrentWeather = await weatherRes.json();
    const rawForecast: OWMForecastResponse = await forecastRes.json();
    const tz = rawForecast.city?.timezone ?? rawWeather.timezone ?? 0;

    const data: WeatherData = {
      current: processCurrent(rawWeather),
      hourly: processHourly(rawForecast.list, tz),
      daily: processDaily(rawForecast.list, tz),
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
