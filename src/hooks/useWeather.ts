"use client";

import { useState, useCallback, useRef } from "react";
import type { WeatherData } from "@/lib/weather-types";

interface UseWeatherReturn {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  search: (city: string) => Promise<void>;
}

export function useWeather(): UseWeatherReturn {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(city.trim())}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to fetch weather");
      }

      const weatherData: WeatherData = await res.json();
      setData(weatherData);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, search };
}
