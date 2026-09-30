import React, { useState, useEffect, useCallback } from "react";
import { StreakBadge } from "@/modules/reflection/presentation/StreakBadge";
import { HeaderMenu } from "./HeaderMenu";
import { Moon, Sun, ListTodo, CalendarClock } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface HeaderProps {
  currentStreak?: number;
  isGracePeriod?: boolean;
  onOpenHansei?: () => void;
  onOpenBackup?: () => void;
  onOpenGuide?: () => void;
  onLoadSample?: () => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenTodo?: () => void;
  onOpenRoutine?: () => void;
  activeTodosCount?: number;
  remainingRoutinesCount?: number;
  className?: string;
}

/**
 * Zen Ensō Symbol Icon
 * Represents enlightenment, strength, elegance, the universe, and the void (mu).
 */
export const EnsoLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-sage-600 dark:text-sage-400 shrink-0", className)}
    aria-label="Zen Ensō Circle"
  >
    <path
      d="M50 12 C 28 12, 12 28, 12 50 C 12 72, 29 88, 50 88 C 72 88, 88 71, 88 51 C 88 35, 78 21, 62 17"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  currentStreak = 0,
  isGracePeriod = false,
  onOpenHansei,
  onOpenBackup,
  onOpenGuide,
  onLoadSample,
  onInstallPwa,
  canInstallPwa = false,
  isDarkMode: controlledDarkMode,
  onToggleTheme: controlledToggleTheme,
  onOpenTodo,
  onOpenRoutine,
  activeTodosCount,
  remainingRoutinesCount,
  className,
}) => {
  const [internalDark, setInternalDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        (typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setInternalDark(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const isDark =
    controlledDarkMode !== undefined ? controlledDarkMode : internalDark;

  const handleToggleTheme = useCallback(() => {
    if (controlledToggleTheme) {
      controlledToggleTheme();
    } else {
      const next = !internalDark;
      setInternalDark(next);
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, [controlledToggleTheme, internalDark]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors",
        "bg-sand-50/90 border-sand-200/80 dark:bg-charcoal-950/90 dark:border-charcoal-800",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <EnsoLogo className="w-7 h-7 sm:w-8 sm:h-8" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
                KaizenFlow
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block" />
            </div>
            <p className="text-[10px] sm:text-xs text-charcoal-500 dark:text-sand-400 italic font-medium -mt-0.5">
              Satu langkah kecil hari ini.
            </p>
          </div>
        </div>

        {/* Clean, Streamlined Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Streak Badge */}
          <StreakBadge
            currentStreak={currentStreak}
            isGracePeriod={isGracePeriod}
            onClick={onOpenHansei}
          />

          {/* Quick-Access To-Do Button */}
          {onOpenTodo && (
            <button
              type="button"
              onClick={onOpenTodo}
              aria-label={`Buka daftar To-Do${activeTodosCount !== undefined && activeTodosCount > 0 ? ` (${activeTodosCount} aktif)` : ""}`}
              title="Daftar Tugas (To-Do)"
              className="relative min-h-[40px] px-2 sm:px-2.5 rounded-xl text-charcoal-700 dark:text-sand-200 hover:bg-sand-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 flex items-center gap-1.5 shrink-0"
            >
              <ListTodo className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              <span className="hidden md:inline text-xs font-semibold">To-Do</span>
              {activeTodosCount !== undefined && activeTodosCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-sage-600 text-white leading-none">
                  {activeTodosCount}
                </span>
              )}
            </button>
          )}

          {/* Quick-Access Routine Schedule Button */}
          {onOpenRoutine && (
            <button
              type="button"
              onClick={onOpenRoutine}
              aria-label={`Buka Jadwal Rutin${remainingRoutinesCount !== undefined && remainingRoutinesCount > 0 ? ` (${remainingRoutinesCount} tersisa)` : ""}`}
              title="Jadwal Rutin Harian"
              className="relative min-h-[40px] px-2 sm:px-2.5 rounded-xl text-charcoal-700 dark:text-sand-200 hover:bg-sand-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center gap-1.5 shrink-0"
            >
              <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline text-xs font-semibold">Jadwal</span>
              {remainingRoutinesCount !== undefined && remainingRoutinesCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-amber-500 text-white leading-none">
                  {remainingRoutinesCount}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-1.5 sm:p-2 rounded-xl text-charcoal-600 dark:text-sand-300 hover:bg-sand-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 shrink-0"
            title="Ganti Tema"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-charcoal-700" />
            )}
          </button>

          {/* Dropdown Options Menu (⋮) */}
          <HeaderMenu
            onOpenGuide={onOpenGuide}
            onOpenBackup={onOpenBackup}
            onLoadSample={onLoadSample}
            onInstallPwa={onInstallPwa}
            canInstallPwa={canInstallPwa}
          />
        </div>
      </div>
    </header>
  );
};

