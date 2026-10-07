"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  forceShow = false,
  minDurationMs = 1400,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, handleDismiss]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          data-testid="splash-screen"
          role="button"
          tabIndex={0}
          aria-label="Tutup splash screen"
          onClick={handleDismiss}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
              handleDismiss();
            }
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sand-50 dark:bg-charcoal-950 cursor-pointer select-none"
        >
          {/* Animated Tobi-Ishi K Monogram */}
          <div className="relative flex items-center justify-center">
            {/* Zen Ripple */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 1.8], opacity: [0, 0.25, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-36 h-36 rounded-full border border-emerald-500/30"
            />

            <svg
              viewBox="0 0 256 256"
              className="w-24 h-24 sm:w-28 sm:h-28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="KaizenFlow Tobi-Ishi K Monogram"
            >
              <g transform="translate(-3.8, 9.9)">
                {/* Grounded Habit Spine */}
                <motion.rect
                  x="50"
                  y="42"
                  width="32"
                  height="172"
                  rx="16"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="fill-charcoal-900 dark:fill-sand-50"
                />

                {/* Upper Stepping Stone: 1% Continuous Growth */}
                <g transform="translate(116, 114) rotate(-45)">
                  <motion.rect
                    x="0"
                    y="-16"
                    width="122"
                    height="32"
                    rx="16"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                    className="fill-emerald-600 dark:fill-emerald-400"
                  />
                </g>

                {/* Lower Stepping Stone */}
                <g transform="translate(116, 142) rotate(45)">
                  <motion.rect
                    x="0"
                    y="-16"
                    width="94"
                    height="32"
                    rx="16"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
                    className="fill-charcoal-900 dark:fill-sand-50"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Brand Wordmark & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
              <span>Kaizen</span>
              <span className="font-light text-charcoal-500 dark:text-sand-400">Flow</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5" />
            </div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-charcoal-500 dark:text-sand-400">
              1% BETTER EVERY DAY
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
