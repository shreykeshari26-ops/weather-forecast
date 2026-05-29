import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function formatTime(timestamp: number, timezoneOffset: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

export function formatHour(timestamp: number, timezoneOffset: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

export function formatDayLabel(
  timestamp: number,
  timezoneOffset: number
): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

export function formatShortDay(
  timestamp: number,
  timezoneOffset: number
): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date((timestamp + timezoneOffset) * 1000));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatFullTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getWeatherDescription(condition: string): string {
  const descriptions: Record<string, string> = {
    Clear:
      "Clear skies with abundant sunshine.\nLight winds keep temperatures comfortable,\nwarm afternoons, and cooler evenings.",
    Clouds:
      "Overcast with layered cloud cover.\nTemperatures remain mild throughout the day,\nwith gentle breezes expected.",
    Rain: "Rainfall expected throughout the day.\nBring an umbrella and dress warmly,\ntemperatures may drop significantly.",
    Drizzle:
      "Light drizzle with misty conditions.\nVisibility may be reduced in some areas,\ndrive carefully on wet roads.",
    Thunderstorm:
      "Thunderstorms with possible lightning.\nStay indoors and avoid open areas,\nheavy rain and strong winds likely.",
    Snow: "Snowfall blanketing the landscape.\nRoads may be slippery, dress warmly,\nand prepare for reduced visibility.",
    Mist: "Misty conditions with low visibility.\nProceed with caution when driving,\nconditions will improve by midday.",
    Haze: "Hazy skies with reduced air quality.\nConsider wearing a mask outdoors,\nstay hydrated throughout the day.",
    Fog: "Dense fog with very low visibility.\nExercise extreme caution on roads,\nconditions expected to lift by noon.",
  };
  return (
    descriptions[condition] ||
    "Current weather conditions are stable.\nExpect moderate temperatures today,\nwith calm winds and fair skies."
  );
}

export function getWeatherSubtitle(condition: string): {
  text: string;
  accent: string;
} {
  const subtitles: Record<string, { text: string; accent: string }> = {
    Clear: { text: "partly cloudy", accent: "skies" },
    Clouds: { text: "overcast", accent: "clouds" },
    Rain: { text: "rainy", accent: "showers" },
    Drizzle: { text: "light", accent: "drizzle" },
    Thunderstorm: { text: "severe", accent: "storms" },
    Snow: { text: "heavy", accent: "snowfall" },
    Mist: { text: "misty", accent: "morning" },
    Haze: { text: "hazy", accent: "atmosphere" },
    Fog: { text: "dense", accent: "fog" },
  };
  return subtitles[condition] || { text: "current", accent: "conditions" };
}

export function getConditionLabel(main: string, description?: string): string {
  const labels: Record<string, string> = {
    Clear: "Mostly Sunny",
    Clouds: "Cloudy Skies",
    Rain: "Rainy Weather",
    Drizzle: "Light Drizzle",
    Thunderstorm: "Thunderstorms",
    Snow: "Snowy Conditions",
    Mist: "Misty Haze",
    Haze: "Hazy Day",
    Fog: "Foggy Morning",
  };
  return labels[main] || (description ? capitalize(description) : main);
}

export function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "--";
}

export function getEstimatedUvIndex(
  clouds: number,
  condition: string
): number {
  if (condition.toLowerCase().includes("clear")) return 6;
  if (clouds < 30) return 5;
  if (clouds < 70) return 4;
  return 2;
}

export function formatVisibility(value: number): string {
  return `${(value / 1000).toFixed(1)} km`;
}

export function getSunPosition(
  sunrise: number,
  sunset: number,
  current: number
): number {
  if (current <= sunrise) return 0;
  if (current >= sunset) return 1;
  return (current - sunrise) / (sunset - sunrise);
}
