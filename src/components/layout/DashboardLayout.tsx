"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CurrentWeather, DailyForecast } from "@/lib/weather-types";
import MainForecast from "@/components/MainForecast";
import WindStatusWidget from "@/components/WindStatusWidget";
import SolarTracker from "@/components/SolarTracker";
import WeeklyTimelineChart from "@/components/WeeklyTimelineChart";

interface DashboardLayoutProps {
  current: CurrentWeather;
  daily: DailyForecast[];
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function DashboardLayout({
  current,
  daily,
  selectedDayIndex,
  onDaySelect,
}: DashboardLayoutProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.city}
        className="relative z-10 flex-1 flex flex-col px-4 sm:px-8 lg:px-12 xl:px-16 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Main Grid: Hero left + Widgets right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start mt-2">
          {/* Left: Hero Forecast */}
          <motion.div variants={itemVariants}>
            <MainForecast current={current} />
          </motion.div>

          {/* Right: Widget Stack */}
          <motion.div
            className="flex flex-col gap-4"
            variants={itemVariants}
          >
            <WindStatusWidget
              speed={current.windSpeed}
              gust={current.windGust}
            />
            <SolarTracker
              sunrise={current.sunrise}
              sunset={current.sunset}
              timezone={current.timezone}
              currentDt={current.dt}
            />
          </motion.div>
        </div>

        {/* Bottom: Weekly Timeline Chart with Tab Navigation */}
        <motion.div variants={itemVariants}>
          <WeeklyTimelineChart
            daily={daily}
            selectedIndex={selectedDayIndex}
            onDaySelect={onDaySelect}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
