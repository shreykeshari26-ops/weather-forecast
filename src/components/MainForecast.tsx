"use client";

import { motion, useSpring, useMotionValue, animate } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import type { CurrentWeather } from "@/lib/weather-types";
import {
  getConditionLabel,
  getWeatherSubtitle,
  getWeatherDescription,
  getEstimatedUvIndex,
} from "@/lib/utils";

interface MainForecastProps {
  current: CurrentWeather;
}

function AnimatedTemperature({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    const el = document.getElementById("temp-display");
    const unsub = spring.on("change", (v) => {
      if (el) el.textContent = `${Math.round(v)}`;
    });
    return unsub;
  }, [spring]);

  return (
    <div className="flex items-start gap-1 mt-6">
      <span
        id="temp-display"
        className="text-[7rem] sm:text-[8rem] lg:text-[9rem] font-light leading-[0.85] tracking-[-0.06em] text-white"
      >
        {Math.round(value)}
      </span>
      <span className="text-3xl sm:text-4xl font-light text-white/60 mt-3">
        °
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function MainForecast({ current }: MainForecastProps) {
  const conditionLabel = getConditionLabel(
    current.condition,
    current.conditionDescription
  );
  const subtitle = getWeatherSubtitle(current.condition);
  const description = getWeatherDescription(current.condition);
  const uvIndex = getEstimatedUvIndex(current.clouds, current.condition);

  return (
    <motion.div
      className="relative z-10 flex flex-col justify-center min-h-[420px] lg:min-h-[460px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Condition Label */}
      <motion.h1
        className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-white leading-[1.1] tracking-[-0.02em]"
        variants={itemVariants}
      >
        {conditionLabel}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-2 text-lg sm:text-xl font-light text-white/50"
        variants={itemVariants}
      >
        {subtitle.text}{" "}
        <span className="text-sky-300/70">{subtitle.accent}</span>
      </motion.p>

      {/* Description */}
      <motion.p
        className="mt-5 text-sm leading-[1.8] text-white/40 max-w-[340px] whitespace-pre-line"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {/* Temperature */}
      <motion.div variants={itemVariants}>
        <AnimatedTemperature value={current.temp} />
      </motion.div>

      {/* Location & UV */}
      <motion.div
        className="flex items-center gap-3 mt-5"
        variants={itemVariants}
      >
        <div className="flex items-center gap-1.5 text-white/60">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">{current.city}</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/40 tracking-wide">
          UV Ind.: {uvIndex}
        </div>
      </motion.div>
    </motion.div>
  );
}
