"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Search, MapPin } from "lucide-react";
import WeatherBackground from "@/components/background/WeatherBackground";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchOverlay from "@/components/SearchOverlay";
import { useWeather } from "@/hooks/useWeather";
import {
  MOCK_WEEK,
  conditionToVisualState,
  type WeatherVisualState,
} from "@/lib/mock-data";
import type { CurrentWeather, DailyForecast } from "@/lib/weather-types";

export default function HomePage() {
  const { data, isLoading, error, search } = useWeather();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const handleSearch = useCallback(
    (city: string) => {
      search(city);
      setSelectedDayIndex(0); // Reset to first day on new search
    },
    [search]
  );

  // ── Derive active state from API data + selected day ──
  // When we have API data, use it. When a day tab is clicked,
  // override the current weather with that day's mock state.
  const { activeCurrent, activeDaily, visualState } = useMemo(() => {
    if (data) {
      // API data available — merge with day selection
      const dailyList = data.daily.length > 0 ? data.daily : MOCK_WEEK[0].daily;

      // If user selects a different day, build an override current from daily
      let current: CurrentWeather;
      if (selectedDayIndex > 0 && dailyList[selectedDayIndex]) {
        const dayData = dailyList[selectedDayIndex];
        current = {
          ...data.current,
          temp: dayData.max,
          feelsLike: dayData.max - 1,
          tempMin: dayData.min,
          tempMax: dayData.max,
          condition: dayData.condition,
          conditionDescription: dayData.description,
          icon: dayData.icon,
          humidity: dayData.humidity,
          windSpeed: dayData.windSpeed,
          windGust: dayData.windSpeed * 1.4,
          clouds:
            dayData.condition === "Clouds"
              ? 80
              : dayData.condition === "Clear"
                ? 10
                : 50,
          rainfall: dayData.condition === "Rain" ? 2.5 : 0,
        };
      } else {
        current = data.current;
      }

      const vs = conditionToVisualState(current.condition, current.icon);
      return { activeCurrent: current, activeDaily: dailyList, visualState: vs };
    }

    // No API data — use mock dataset
    const mockDay = MOCK_WEEK[selectedDayIndex];
    const vs = conditionToVisualState(
      mockDay.current.condition,
      mockDay.current.icon
    );
    return {
      activeCurrent: mockDay.current,
      activeDaily: mockDay.daily,
      visualState: vs,
    };
  }, [data, selectedDayIndex]);

  // Check if we have displayable data (API or mock when day selected)
  const hasData = data !== null || selectedDayIndex >= 0;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic 6-state weather background */}
      <WeatherBackground state={visualState} />

      {/* Top navigation */}
      <TopBar onSearchClick={() => setSearchOpen(true)} />

      {/* Search overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        isLoading={isLoading}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="relative z-20 mx-auto mt-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-sm text-red-300/80 max-w-md text-center backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && !data && (
          <motion.div
            className="relative z-20 flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Cloud className="w-5 h-5 text-sky-300/50" />
              </motion.div>
              <span className="text-sm text-white/30">
                Fetching atmospheric data...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {hasData ? (
          <motion.div
            key={`dashboard-${activeCurrent.condition}-${selectedDayIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <DashboardLayout
              current={activeCurrent}
              daily={activeDaily}
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
            />
          </motion.div>
        ) : (
          !isLoading && (
            <motion.div
              key="empty"
              className="relative z-10 flex-1 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center max-w-md">
                {/* Floating icon */}
                <motion.div
                  className="mx-auto w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-8 backdrop-blur-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Cloud className="w-9 h-9 text-white/15" />
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-light text-white/80 tracking-tight leading-tight">
                  Weather Intelligence
                </h1>
                <p className="mt-4 text-sm text-white/30 leading-relaxed max-w-xs mx-auto">
                  Search for any city to stream real-time atmospheric data into
                  your premium forecast dashboard.
                </p>

                {/* Inline search */}
                <motion.button
                  onClick={() => setSearchOpen(true)}
                  className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/60 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group backdrop-blur-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-4 h-4 text-white/25 group-hover:text-white/40 transition-colors" />
                  <span className="text-sm">Search a city...</span>
                </motion.button>

                {/* Quick cities */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["New York", "London", "Tokyo"].map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSearch(city)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/30 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:text-white/50 transition-all duration-200"
                    >
                      <MapPin className="w-3 h-3" />
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
