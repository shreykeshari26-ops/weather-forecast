"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "subtle";
  hoverLift?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  default: "glass-card",
  elevated:
    "glass-card shadow-[var(--shadow-glass-elevated)]",
  subtle:
    "glass-card border-white/5 bg-gradient-to-br from-white/4 to-white/1",
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = "default", hoverLift = true, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        whileHover={
          hoverLift
            ? { y: -6, scale: 1.01 }
            : undefined
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
