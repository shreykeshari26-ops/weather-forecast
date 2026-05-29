"use client";

import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useMemo } from "react";

interface WindStatusWidgetProps {
  speed: number;
  gust: number;
}

function WaveGraph({ speed }: { speed: number }) {
  const amplitude = Math.min(speed * 2, 20);
  const frequency = 0.04 + speed * 0.003;

  const path = useMemo(() => {
    const points: string[] = [];
    const width = 600;
    const height = 50;
    const midY = height / 2;

    for (let x = 0; x <= width; x += 2) {
      const y =
        midY +
        Math.sin(x * frequency) * amplitude * 0.6 +
        Math.sin(x * frequency * 2.3 + 1) * amplitude * 0.3 +
        Math.sin(x * frequency * 0.5 + 2) * amplitude * 0.2;
      points.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
    }

    return points.join(" ");
  }, [amplitude, frequency]);

  return (
    <div className="relative w-full h-[50px] overflow-hidden mt-3 opacity-70">
      <motion.svg
        viewBox="0 0 600 50"
        className="w-[200%] h-full"
        preserveAspectRatio="none"
        animate={{ x: [0, -300] }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.5)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
        <path
          d={`${path} L 600 50 L 0 50 Z`}
          fill="url(#waveGrad)"
          opacity="0.3"
        />
      </motion.svg>
    </div>
  );
}

function EqualizerBars({ gust }: { gust: number }) {
  const barCount = 28;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const baseHeight = 0.2 + Math.sin(i * 0.5) * 0.3 + Math.random() * 0.4;
      const gustFactor = Math.min(gust / 15, 1);
      return {
        height: baseHeight * (0.5 + gustFactor * 0.5),
        delay: i * 0.06,
      };
    });
  }, [gust]);

  return (
    <div className="flex items-end gap-[3px] h-[35px] mt-2 opacity-60">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full bg-gradient-to-t from-sky-400/40 to-sky-300/60"
          style={{ originY: 1 }}
          animate={{
            scaleY: [bar.height * 0.4, bar.height, bar.height * 0.5, bar.height * 0.8],
          }}
          transition={{
            duration: 1.5 + Math.random() * 0.5,
            delay: bar.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          initial={{ scaleY: bar.height }}
        >
          <div className="w-full h-[35px]" />
        </motion.div>
      ))}
    </div>
  );
}

export default function WindStatusWidget({
  speed,
  gust,
}: WindStatusWidgetProps) {
  const kmh = (speed * 3.6).toFixed(2);

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-300/70" />
          <span className="text-sm text-white/50 font-medium">
            Wind status
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-white tracking-tight">
            {kmh}
          </span>
          <span className="text-xs text-white/40">km/h</span>
        </div>
      </div>

      {/* Wave visualization */}
      <WaveGraph speed={speed} />

      {/* Equalizer bars */}
      <EqualizerBars gust={gust} />
    </GlassCard>
  );
}
