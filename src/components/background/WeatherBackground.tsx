"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useMemo, useCallback } from "react";
import type { WeatherVisualState } from "@/lib/mock-data";

interface WeatherBackgroundProps {
  state: WeatherVisualState;
}

// ═══════════════════════════════════════════
// 1. SUNNY — Radiating SVG center glow
// ═══════════════════════════════════════════
function SunnyBackground() {
  return (
    <div className="absolute inset-0">
      {/* Base warm gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a2a44 0%, #1e3352 30%, #243d5e 60%, #1a2a44 100%)",
        }}
      />

      {/* Radiating center glow */}
      <motion.div
        className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 220, 120, 0.18) 0%, rgba(255, 200, 80, 0.08) 30%, rgba(255, 180, 50, 0.03) 55%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary warm glow ring */}
      <motion.div
        className="absolute top-[20%] left-[48%] -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)",
        }}
        animate={{ scale: [1.02, 0.98, 1.02], opacity: [0.6, 0.9, 0.6] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Light haze wash */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.15), transparent 60%)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// 2. CLOUDY — Layered drifting cloud vectors
// ═══════════════════════════════════════════
function CloudShape({
  width,
  height,
  opacity,
  y,
  speed,
  delay,
}: {
  width: number;
  height: number;
  opacity: number;
  y: string;
  speed: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: y,
        width,
        height,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(180, 200, 220, ${opacity}) 0%, rgba(160, 180, 200, ${opacity * 0.5}) 40%, transparent 70%)`,
        filter: "blur(30px)",
      }}
      animate={{ x: ["-20%", "120vw"] }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    />
  );
}

function CloudyBackground() {
  const clouds = useMemo(
    () => [
      { width: 600, height: 200, opacity: 0.12, y: "8%", speed: 45, delay: 0 },
      { width: 800, height: 280, opacity: 0.08, y: "22%", speed: 60, delay: 5 },
      { width: 500, height: 180, opacity: 0.15, y: "45%", speed: 38, delay: 12 },
      { width: 700, height: 240, opacity: 0.06, y: "65%", speed: 55, delay: 8 },
      { width: 400, height: 160, opacity: 0.10, y: "15%", speed: 50, delay: 20 },
    ],
    []
  );

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1e293b 0%, #1a2435 40%, #151d2c 70%, #0f1520 100%)",
        }}
      />
      {clouds.map((c, i) => (
        <CloudShape key={i} {...c} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// 3. RAINY — Canvas particle rain streaks
// ═══════════════════════════════════════════
function RainyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const drawRain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Drop {
      x: number;
      y: number;
      len: number;
      speed: number;
      opacity: number;
    }

    const drops: Drop[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 18 + Math.random() * 22,
      speed: 8 + Math.random() * 12,
      opacity: 0.08 + Math.random() * 0.18,
    }));

    const slantRad = (15 * Math.PI) / 180;

    function frame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(
          d.x + Math.sin(slantRad) * d.len,
          d.y + Math.cos(slantRad) * d.len
        );
        ctx.strokeStyle = `rgba(180, 210, 240, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        d.y += d.speed;
        d.x += Math.sin(slantRad) * d.speed * 0.3;

        if (d.y > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      }

      animRef.current = requestAnimationFrame(frame);
    }

    frame();
  }, []);

  useEffect(() => {
    drawRain();
    const handleResize = () => {
      cancelAnimationFrame(animRef.current);
      drawRain();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawRain]);

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c1220 0%, #101828 30%, #0d1520 60%, #080e18 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {/* Moody overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 60%, rgba(30, 64, 110, 0.12), transparent 60%)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// 4. HAZE — Drifting gradient + blur pulse
// ═══════════════════════════════════════════
function HazeBackground() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a1f2e 0%, #1e2538 40%, #181e2a 70%, #121820 100%)",
        }}
      />

      {/* Drifting haze layer 1 */}
      <motion.div
        className="absolute inset-[-20%] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(100, 116, 139, 0.04) 50%, rgba(148, 163, 184, 0.06) 100%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: ["-5%", "5%", "-3%"],
          y: ["-3%", "3%", "-2%"],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting haze layer 2 */}
      <motion.div
        className="absolute inset-[-10%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(200, 200, 200, 0.06), transparent 50%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: ["3%", "-4%", "2%"],
          y: ["2%", "-2%", "3%"],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Blur pulse overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(180, 180, 200, 0.05), transparent 60%)",
        }}
        animate={{
          filter: ["blur(20px)", "blur(35px)", "blur(20px)"],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// 5. NIGHT — Midnight gradient + twinkling stars
// ═══════════════════════════════════════════
function NightBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 70}%`,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0">
      {/* Midnight gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0B132B 0%, #111d3a 30%, #1C2541 60%, #0B132B 100%)",
        }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}

      {/* Subtle moonlight glow */}
      <div
        className="absolute top-[10%] right-[20%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200, 210, 240, 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// 6. COLD — Icy-blue overlay + snowflakes
// ═══════════════════════════════════════════
function ColdBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const drawSnow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Flake {
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      opacity: number;
      phase: number;
    }

    const flakes: Flake[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.8,
      opacity: 0.15 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function frame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 240, ${f.opacity})`;
        ctx.fill();

        // Draw tiny crystalline cross
        ctx.strokeStyle = `rgba(220, 235, 250, ${f.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(f.x - f.r, f.y);
        ctx.lineTo(f.x + f.r, f.y);
        ctx.moveTo(f.x, f.y - f.r);
        ctx.lineTo(f.x, f.y + f.r);
        ctx.stroke();

        f.y += f.speed;
        f.x += Math.sin(t + f.phase) * f.drift;

        if (f.y > canvas.height + f.r) {
          f.y = -f.r;
          f.x = Math.random() * canvas.width;
        }
      }

      animRef.current = requestAnimationFrame(frame);
    }

    frame();
  }, []);

  useEffect(() => {
    drawSnow();
    const handleResize = () => {
      cancelAnimationFrame(animRef.current);
      drawSnow();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawSnow]);

  return (
    <div className="absolute inset-0">
      {/* Frosty desaturated base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #15202e 0%, #1a2a3e 30%, #182436 60%, #101a28 100%)",
        }}
      />

      {/* Icy overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 60%)",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// Master Background Controller
// ═══════════════════════════════════════════
const backgrounds: Record<WeatherVisualState, React.FC> = {
  sunny: SunnyBackground,
  cloudy: CloudyBackground,
  rainy: RainyBackground,
  haze: HazeBackground,
  night: NightBackground,
  cold: ColdBackground,
};

export default function WeatherBackground({ state }: WeatherBackgroundProps) {
  const BgComponent = backgrounds[state];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <BgComponent />
        </motion.div>
      </AnimatePresence>

      {/* Subtle noise texture (shared across all states) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
