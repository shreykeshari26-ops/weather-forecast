// ── OpenWeatherMap Raw API Types ──

export interface OWMCoord {
  lon: number;
  lat: number;
}

export interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMMainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface OWMWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface OWMClouds {
  all: number;
}

export interface OWMSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface OWMCurrentWeather {
  coord: OWMCoord;
  weather: OWMWeatherCondition[];
  main: OWMMainData;
  visibility: number;
  wind: OWMWind;
  clouds: OWMClouds;
  dt: number;
  sys: OWMSys;
  timezone: number;
  name: string;
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
}

export interface OWMForecastItem {
  dt: number;
  main: OWMMainData;
  weather: OWMWeatherCondition[];
  clouds: OWMClouds;
  wind: OWMWind;
  visibility: number;
  pop: number;
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  dt_txt: string;
}

export interface OWMForecastResponse {
  list: OWMForecastItem[];
  city: {
    name: string;
    coord: OWMCoord;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// ── App-Level Processed Types ──

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number;
  condition: string;
  conditionDescription: string;
  icon: string;
  windSpeed: number;
  windDeg: number;
  windGust: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
  rainfall: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  icon: string;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  pop: number;
}

export interface DailyForecast {
  dt: number;
  day: string;
  dayShort: string;
  min: number;
  max: number;
  icon: string;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Haze"
  | "Fog";
