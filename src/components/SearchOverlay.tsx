"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSearch: (city: string) => void;
}

const popularCities = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Dubai",
  "Sydney",
  "Singapore",
  "Mumbai",
];

export default function SearchOverlay({
  isOpen,
  isLoading,
  onClose,
  onSearch,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  const handleCityClick = (city: string) => {
    onSearch(city);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 top-[15%] left-1/2 w-[90%] max-w-[520px]"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="glass-card p-6 shadow-[var(--shadow-glass-elevated)]">
              {/* Search input */}
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a city..."
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 outline-none focus:border-white/15 focus:bg-white/[0.08] transition-all duration-200 text-sm"
                />
                {isLoading ? (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/50 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Popular cities */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium mb-3">
                  Popular Cities
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityClick(city)}
                      className="px-3 py-1.5 rounded-xl text-xs text-white/50 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70 hover:border-white/[0.12] transition-all duration-200"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
