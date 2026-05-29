"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { DailyForecast } from "@/lib/weather-types";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Cloudy,
} from "lucide-react";

interface WeeklyTimelineChartProps {
  daily: DailyForecast[];
  selectedIndex: number;
  onDaySelect: (index: number) => void;
}

function getWeatherIcon(condition: string) {
  const iconMap: Record<string, React.ReactNode> = {
    Clear: <Sun className="w-5 h-5 text-amber-300" />,
    Clouds: <Cloud className="w-5 h-5 text-slate-300" />,
    Rain: <CloudRain className="w-5 h-5 text-blue-300" />,
    Drizzle: <CloudDrizzle className="w-5 h-5 text-blue-200" />,
    Thunderstorm: <CloudLightning className="w-5 h-5 text-purple-300" />,
    Snow: <CloudSnow className="w-5 h-5 text-slate-200" />,
    Mist: <CloudFog className="w-5 h-5 text-slate-300" />,
    Haze: <Cloudy className="w-5 h-5 text-slate-400" />,
    Fog: <CloudFog className="w-5 h-5 text-slate-300" />,
  };
  return iconMap[condition] || <Cloud className="w-5 h-5 text-slate-300" />;
}

function generateBezierPath(
  points: { x: number; y: number }[]
): string {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

export default function WeeklyTimelineChart({
  daily,
  selectedIndex,
  onDaySelect,
}: WeeklyTimelineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const svgWidth = 900;
  const svgHeight = 120;
  const paddingX = 64;
  const paddingY = 20;

  const chartData = useMemo(() => {
    if (!daily.length) return { points: [], minTemp: 0, maxTemp: 0 };

    const temps = daily.map((d) => (d.max + d.min) / 2);
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;
    const tempRange = maxTemp - minTemp || 1;

    const points = daily.map((d, i) => {
      const x =
        paddingX +
        (i * (svgWidth - paddingX * 2)) / Math.max(daily.length - 1, 1);
      const avgTemp = (d.max + d.min) / 2;
      const y =
        paddingY +
        (1 - (avgTemp - minTemp) / tempRange) * (svgHeight - paddingY * 2);
      return { x, y, temp: avgTemp };
    });

    return { points, minTemp, maxTemp };
  }, [daily]);

  const curvePath = useMemo(
    () => generateBezierPath(chartData.points),
    [chartData.points]
  );

  const areaPath = useMemo(() => {
    if (!curvePath) return "";
    const firstX = chartData.points[0]?.x ?? 0;
    const lastX = chartData.points[chartData.points.length - 1]?.x ?? svgWidth;
    return `${curvePath} L ${lastX} ${svgHeight} L ${firstX} ${svgHeight} Z`;
  }, [curvePath, chartData.points]);

  if (!daily.length) return null;

  return (
    <motion.div
      className="relative z-10 mt-6 lg:mt-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Day labels and temperatures — CLICKABLE TABS */}
      <div className="flex justify-between px-4 sm:px-8 lg:px-12 mb-2">
        {daily.map((d, i) => {
          const isSelected = i === selectedIndex;
          const isHovered = i === hoveredIndex;

          return (
            <motion.button
              key={d.dt}
              className={`flex flex-col items-center text-center min-w-0 flex-1 py-2 px-1 rounded-2xl cursor-pointer transition-colors duration-200 border ${
                isSelected
                  ? "bg-white/[0.08] border-white/[0.12]"
                  : "bg-transparent border-transparent hover:bg-white/[0.04]"
              }`}
              onClick={() => onDaySelect(i)}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span
                className={`text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isSelected ? "text-white/80" : "text-white/40"
                }`}
              >
                {d.day}
              </span>
              <motion.span
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mt-1 tracking-tight"
                key={`temp-${d.dt}-${d.max}`}
                initial={false}
                animate={{
                  scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
                  color: isSelected
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.85)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {Math.round(d.max)}°
              </motion.span>

              {/* Active indicator dot */}
              {isSelected && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-sky-400/80 mt-1.5"
                  layoutId="day-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full" style={{ height: svgHeight + 50 }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ height: svgHeight }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#curveGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />

          {/* Bezier curve line */}
          <motion.path
            d={curvePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />

          {/* Data points */}
          {chartData.points.map((point, i) => {
            const isSelected = i === selectedIndex;
            const isHovered = i === hoveredIndex;

            return (
              <motion.g key={i}>
                {/* Selected ring glow */}
                {isSelected && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="14"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="1.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                )}

                {/* Outer glow on hover */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="12"
                      fill="rgba(255, 255, 255, 0.06)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* Dot */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  fill={isSelected ? "rgba(56, 189, 248, 1)" : "white"}
                  initial={{ r: 0 }}
                  animate={{
                    r: isSelected ? 5.5 : isHovered ? 5 : 3,
                  }}
                  transition={{
                    r: { type: "spring", stiffness: 300, damping: 20 },
                    default: { delay: 0.5 + i * 0.15, duration: 0.4 },
                  }}
                />

                {/* Vertical dashed line for selected or hovered */}
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.line
                      x1={point.x}
                      y1={point.y + 8}
                      x2={point.x}
                      y2={svgHeight}
                      stroke={
                        isSelected
                          ? "rgba(56, 189, 248, 0.15)"
                          : "rgba(255, 255, 255, 0.1)"
                      }
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.g>
            );
          })}
        </svg>

        {/* Weather icons positioned on the curve */}
        <div
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ height: svgHeight }}
        >
          {daily.map((d, i) => {
            const point = chartData.points[i];
            if (!point) return null;

            const leftPct = (point.x / svgWidth) * 100;
            const topPct = (point.y / svgHeight) * 100;
            const isSelected = i === selectedIndex;

            return (
              <motion.div
                key={d.dt}
                className="absolute -translate-x-1/2 pointer-events-auto cursor-pointer"
                style={{
                  left: `${leftPct}%`,
                  top: `calc(${topPct}% + 18px)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1 + i * 0.12,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                onClick={() => onDaySelect(i)}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                    isSelected
                      ? "bg-white/[0.12] border-sky-400/30 shadow-[0_0_16px_rgba(56,189,248,0.12)]"
                      : hoveredIndex === i
                        ? "bg-white/[0.08] border-white/20 scale-110"
                        : "bg-white/[0.04] border-white/[0.08]"
                  }`}
                >
                  {getWeatherIcon(d.condition)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && daily[hoveredIndex] && (
            <motion.div
              className="absolute z-30 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-xl text-xs pointer-events-none"
              style={{
                left: `${(chartData.points[hoveredIndex].x / svgWidth) * 100}%`,
                top: "-10px",
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="text-white/80 font-medium">
                {daily[hoveredIndex].day}
              </div>
              <div className="text-white/50 mt-0.5">
                H: {Math.round(daily[hoveredIndex].max)}° • L:{" "}
                {Math.round(daily[hoveredIndex].min)}°
              </div>
              <div className="text-white/40 mt-0.5">
                💧 {daily[hoveredIndex].humidity}% • 💨{" "}
                {daily[hoveredIndex].windSpeed.toFixed(1)} m/s
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
