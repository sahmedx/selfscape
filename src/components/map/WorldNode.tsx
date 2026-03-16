"use client";

import { motion, AnimatePresence } from "motion/react";

interface WorldNodeProps {
  label: string;
  icon: string;
  completed: boolean;
  accentColor: string;
  position: { top: string; left: string };
  onClick: (e: React.MouseEvent) => void;
  expanded?: boolean;
  children?: React.ReactNode;
}

export default function WorldNode({
  label,
  icon,
  completed,
  accentColor,
  position,
  onClick,
  expanded,
  children,
}: WorldNodeProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: position.top, left: position.left }}
    >
      <motion.button
        className={`relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full sm:h-20 sm:w-20 ${
          completed
            ? "border-2"
            : "border border-dashed border-foreground/20 opacity-50"
        }`}
        style={
          completed
            ? {
                borderColor: accentColor,
                boxShadow: `0 0 16px ${accentColor}40`,
                animation: "gentleBob 3s ease-in-out infinite",
              }
            : undefined
        }
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {completed && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${accentColor}50`,
              animation: "glowPulse 3s ease-in-out infinite",
            }}
          />
        )}
        <span className="relative z-10 text-2xl sm:text-3xl">{icon}</span>
      </motion.button>
      <p className="mt-1.5 text-center text-[10px] uppercase tracking-widest text-foreground/60 sm:text-xs">
        {label}
      </p>
      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-2 w-48 overflow-hidden rounded-lg border border-foreground/10 bg-background/80 px-4 py-3 text-center backdrop-blur-sm"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
