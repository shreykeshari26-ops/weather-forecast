"use client";

import { motion } from "framer-motion";
import { Sunrise, Sunset } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSunPosition, formatTime } from "@/lib/utils";

interface SolarTrackerProps {
  sunrise: number;
  sunset: number;
  timezone: number;
  currentDt: number;
}

export default function SolarTracker({
  sunrise,
  sunset,
  timezone,
  currentDt,
}: SolarTrackerProps) {
  const sunPosition = getSunPosition(sunrise, sunset, currentDt);
  const sunriseTime = formatTime(sunrise, timezone);
  const sunsetTime = formatTime(sunset, timezone);

  // Arc geometry (semi-circle from left to right)
  const cx = 150;
  const cy = 110;
  const rx = 120;
  const ry = 80;

  // Calculate sun position along the arc
  const angle = Math.PI - sunPosition * Math.PI; // π to 0 (left to right)
  const sunX = cx + rx * Math.cos(angle);
  const sunY = cy - ry * Math.sin(angle);

  // Generate dashed arc path
  const arcPath = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;

  // Generate the "progress" arc (filled portion)
  const progressAngle = Math.PI - sunPosition * Math.PI;
  const progressX = cx + rx * Math.cos(progressAngle);
  const progressY = cy - ry * Math.sin(progressAngle);
  const largeArc = sunPosition > 0.5 ? 1 : 0;
  const progressPath =
    sunPosition > 0
      ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 ${largeArc} 1 ${progressX.toFixed(2)} ${progressY.toFixed(2)}`
      : "";

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-3.5 h-3.5 text-amber-300/70" />
          <span className="text-xs text-white/50 font-medium">
            Sunrise <span className="text-white/30">↗</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/50 font-medium">
            <span className="text-white/30">↙</span> Sunset
          </span>
          <Sunset className="w-3.5 h-3.5 text-orange-300/70" />
        </div>
      </div>

      {/* Arc SVG */}
      <div className="relative flex items-center justify-center mt-1">
        <svg viewBox="0 0 300 130" className="w-full max-w-[260px]">
          <defs>
            <linearGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dashed arc track */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Progress arc */}
          {sunPosition > 0 && sunPosition < 1 && (
            <motion.path
              d={progressPath}
              fill="none"
              stroke="rgba(251, 191, 36, 0.4)"
              strokeWidth="2"
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}

          {/* Horizon line */}
          <line
            x1={cx - rx - 10}
            y1={cy}
            x2={cx + rx + 10}
            y2={cy}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Sunrise marker */}
          <circle cx={cx - rx} cy={cy} r="3" fill="rgba(251, 191, 36, 0.5)" />

          {/* Sunset marker */}
          <circle cx={cx + rx} cy={cy} r="3" fill="rgba(249, 115, 22, 0.5)" />

          {/* Sunset icon (small sun at horizon) */}
          <g transform={`translate(${cx + rx}, ${cy - 18})`} opacity="0.5">
            <circle r="5" fill="rgba(249, 115, 22, 0.4)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={Math.cos((deg * Math.PI) / 180) * 7}
                y1={Math.sin((deg * Math.PI) / 180) * 7}
                x2={Math.cos((deg * Math.PI) / 180) * 9}
                y2={Math.sin((deg * Math.PI) / 180) * 9}
                stroke="rgba(249, 115, 22, 0.4)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Sun cursor */}
          {sunPosition > 0 && sunPosition < 1 && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              <circle
                cx={sunX}
                cy={sunY}
                r="12"
                fill="rgba(251, 191, 36, 0.12)"
                filter="url(#glow)"
              />
              <motion.circle
                cx={sunX}
                cy={sunY}
                r="5"
                fill="rgba(251, 191, 36, 0.9)"
                animate={{
                  r: [5, 6, 5],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          )}

          {/* Time labels */}
          <text
            x={cx - rx}
            y={cy + 18}
            textAnchor="middle"
            className="fill-white/30 text-[9px]"
          >
            {sunriseTime}
          </text>
          <text
            x={cx + rx}
            y={cy + 18}
            textAnchor="middle"
            className="fill-white/30 text-[9px]"
          >
            {sunsetTime}
          </text>
        </svg>
      </div>
    </GlassCard>
  );
}
