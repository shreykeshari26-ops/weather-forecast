"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Search,
  BarChart3,
  Bell,
  Clock,
} from "lucide-react";
import { formatDate, formatFullTime } from "@/lib/utils";

interface TopBarProps {
  onSearchClick: () => void;
}

const navItems = [
  { icon: Clock, label: "Schedule" },
  { icon: Search, label: "Search", action: "search" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Bell, label: "Alerts" },
];

export default function TopBar({ onSearchClick }: TopBarProps) {
  const now = new Date();
  const dateStr = formatDate(now);
  const timeStr = formatFullTime(now);

  return (
    <motion.header
      className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
          <Cloud className="w-4 h-4 text-sky-300" />
        </div>
        <span className="text-sm font-medium text-white/80 tracking-wide">
          forecast.{" "}
          <span className="text-white/50">now</span>
        </span>
      </div>

      {/* Navigation Pills */}
      <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action === "search" ? onSearchClick : undefined}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-200"
            aria-label={item.label}
          >
            <item.icon className="w-[18px] h-[18px]" />
          </button>
        ))}
      </nav>

      {/* Right Side — Date/Time only */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/40 tracking-wide font-light">
          {dateStr} | {timeStr}
        </span>

        {/* Mobile search button */}
        <button
          onClick={onSearchClick}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
      </div>
    </motion.header>
  );
}
