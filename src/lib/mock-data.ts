import type { CurrentWeather, DailyForecast } from "@/lib/weather-types";

// ── Weather visual state mapping ──
export type WeatherVisualState =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "haze"
  | "night"
  | "cold";

export function conditionToVisualState(
  condition: string,
  icon?: string
): WeatherVisualState {
  // Check for nighttime via icon suffix
  const isNight = icon?.endsWith("n") ?? false;

  switch (condition) {
    case "Clear":
      return isNight ? "night" : "sunny";
    case "Clouds":
      return "cloudy";
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      return "rainy";
    case "Mist":
    case "Haze":
    case "Fog":
      return "haze";
    case "Snow":
      return "cold";
    default:
      return isNight ? "night" : "cloudy";
  }
}

// ── Full mock dataset for each day of the week ──

export interface DayState {
  current: CurrentWeather;
  daily: DailyForecast[];
}

const baseCurrent: CurrentWeather = {
  city: "New York",
  country: "US",
  temp: 23,
  feelsLike: 22,
  tempMin: 20,
  tempMax: 26,
  humidity: 54,
  pressure: 1015,
  visibility: 10000,
  condition: "Clear",
  conditionDescription: "clear sky",
  icon: "01d",
  windSpeed: 5.09,
  windDeg: 220,
  windGust: 7.2,
  clouds: 15,
  sunrise: 1690869600,
  sunset: 1690920000,
  timezone: -14400,
  dt: 1690896000,
  rainfall: 0,
};

const weeklyDaily: DailyForecast[] = [
  {
    dt: 1690848000,
    day: "Monday",
    dayShort: "Mon",
    min: 22,
    max: 26,
    icon: "02d",
    condition: "Clear",
    description: "few clouds",
    humidity: 48,
    windSpeed: 3.8,
  },
  {
    dt: 1690934400,
    day: "Tuesday",
    dayShort: "Tue",
    min: 24,
    max: 28,
    icon: "01d",
    condition: "Clear",
    description: "clear sky",
    humidity: 42,
    windSpeed: 4.2,
  },
  {
    dt: 1691020800,
    day: "Wednesday",
    dayShort: "Wed",
    min: 20,
    max: 24,
    icon: "04d",
    condition: "Clouds",
    description: "overcast clouds",
    humidity: 68,
    windSpeed: 6.1,
  },
  {
    dt: 1691107200,
    day: "Thursday",
    dayShort: "Thu",
    min: 22,
    max: 26,
    icon: "10d",
    condition: "Rain",
    description: "light rain",
    humidity: 78,
    windSpeed: 8.3,
  },
  {
    dt: 1691193600,
    day: "Friday",
    dayShort: "Fri",
    min: 19,
    max: 23,
    icon: "50d",
    condition: "Mist",
    description: "mist",
    humidity: 82,
    windSpeed: 3.1,
  },
  {
    dt: 1691280000,
    day: "Saturday",
    dayShort: "Sat",
    min: 21,
    max: 26,
    icon: "02d",
    condition: "Clouds",
    description: "scattered clouds",
    humidity: 55,
    windSpeed: 4.7,
  },
  {
    dt: 1691366400,
    day: "Sunday",
    dayShort: "Sun",
    min: 23,
    max: 27,
    icon: "01d",
    condition: "Clear",
    description: "clear sky",
    humidity: 40,
    windSpeed: 3.4,
  },
];

// Build a full state object for each day
function buildDayState(dayIndex: number): DayState {
  const dayData = weeklyDaily[dayIndex];
  return {
    current: {
      ...baseCurrent,
      temp: dayData.max,
      feelsLike: dayData.max - 1,
      tempMin: dayData.min,
      tempMax: dayData.max,
      humidity: dayData.humidity,
      condition: dayData.condition,
      conditionDescription: dayData.description,
      icon: dayData.icon,
      windSpeed: dayData.windSpeed,
      windGust: dayData.windSpeed * 1.4,
      clouds: dayData.condition === "Clouds" ? 80 : dayData.condition === "Clear" ? 10 : 50,
      rainfall: dayData.condition === "Rain" ? 2.5 : 0,
    },
    daily: weeklyDaily,
  };
}

export const MOCK_WEEK: DayState[] = Array.from({ length: 7 }, (_, i) =>
  buildDayState(i)
);
