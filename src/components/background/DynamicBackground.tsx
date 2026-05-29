"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { WeatherCondition } from "@/lib/weather-types";

interface DynamicBackgroundProps {
  condition?: WeatherCondition | string;
}

const weatherGradients: Record<string, string> = {
  Clear:
    "radial-gradient(ellipse at 50% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 60%, rgba(56, 189, 248, 0.08) 0%, transparent 40%), linear-gradient(180deg, #1a2940 0%, #0f1923 50%, #0b1520 100%)",
  Clouds:
    "radial-gradient(ellipse at 50% 40%, rgba(148, 163, 184, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(203, 213, 225, 0.08) 0%, transparent 40%), linear-gradient(180deg, #1e293b 0%, #141c28 50%, #0b1520 100%)",
  Rain:
    "radial-gradient(ellipse at 40% 30%, rgba(30, 58, 95, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 60% 70%, rgba(51, 65, 85, 0.15) 0%, transparent 40%), linear-gradient(180deg, #0f172a 0%, #0d1520 50%, #080e18 100%)",
  Drizzle:
    "radial-gradient(ellipse at 50% 40%, rgba(71, 85, 105, 0.15) 0%, transparent 50%), linear-gradient(180deg, #15202e 0%, #0f1923 50%, #0b1520 100%)",
  Thunderstorm:
    "radial-gradient(ellipse at 50% 50%, rgba(88, 28, 135, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 30%, rgba(30, 41, 59, 0.15) 0%, transparent 40%), linear-gradient(180deg, #0c0f1a 0%, #080b14 50%, #050810 100%)",
  Snow:
    "radial-gradient(ellipse at 50% 30%, rgba(226, 232, 240, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 40% 60%, rgba(203, 213, 225, 0.06) 0%, transparent 40%), linear-gradient(180deg, #1e293b 0%, #151d2c 50%, #0e1520 100%)",
  Mist:
    "radial-gradient(ellipse at 50% 50%, rgba(148, 163, 184, 0.1) 0%, transparent 60%), linear-gradient(180deg, #1a2236 0%, #121a28 50%, #0b1520 100%)",
  Haze:
    "radial-gradient(ellipse at 50% 40%, rgba(180, 160, 120, 0.08) 0%, transparent 50%), linear-gradient(180deg, #1a1f2e 0%, #121820 50%, #0b1520 100%)",
  Fog:
    "radial-gradient(ellipse at 50% 50%, rgba(148, 163, 184, 0.12) 0%, transparent 50%), linear-gradient(180deg, #1e2638 0%, #151c28 50%, #0b1520 100%)",
};

const defaultGradient =
  "radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.06) 0%, transparent 50%), linear-gradient(180deg, #141c28 0%, #0f1520 50%, #0b1520 100%)";

function RainParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${1.5 + Math.random() * 1.5}s`,
        opacity: 0.15 + Math.random() * 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-[1px] h-[20px] bg-gradient-to-b from-transparent via-sky-300/30 to-transparent"
          style={{
            left: p.left,
            animation: `particle-fall ${p.duration} linear ${p.delay} infinite`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SnowParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 4}s`,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `particle-fall ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function DynamicBackground({
  condition,
}: DynamicBackgroundProps) {
  const gradient = condition
    ? weatherGradients[condition] || defaultGradient
    : defaultGradient;

  const showRain = condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm";
  const showSnow = condition === "Snow";
  const showSunGlow = condition === "Clear";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={condition || "default"}
          className="absolute inset-0"
          style={{ background: gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Animated ambient orbs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent 70%)",
          animation: "ambient-drift 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(148, 163, 184, 0.12), transparent 70%)",
          animation: "ambient-shift 18s ease-in-out infinite alternate",
        }}
      />

      {/* Sun glow for clear weather */}
      {showSunGlow && (
        <motion.div
          className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.04) 40%, transparent 70%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
      )}

      {/* Rain particles */}
      {showRain && <RainParticles />}

      {/* Snow particles */}
      {showSnow && <SnowParticles />}

      {/* Subtle noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top light wash */}
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
    </div>
  );
}
