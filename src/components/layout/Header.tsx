import React, { useState, useEffect, useCallback } from "react";
import { StreakBadge } from "@/modules/reflection/presentation/StreakBadge";
import { Button } from "@/shared/presentation/Button";
import { Moon, Sun, Settings } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface HeaderProps {
  currentStreak?: number;
  isGracePeriod?: boolean;
  onOpenHansei?: () => void;
  onOpenBackup?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
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
  isDarkMode: controlledDarkMode,
  onToggleTheme: controlledToggleTheme,
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
        "sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors",
        "bg-sand-50/85 border-sand-200/80 dark:bg-charcoal-950/85 dark:border-charcoal-800",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <EnsoLogo className="w-8 h-8 sm:w-9 sm:h-9" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
                KaizenFlow
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block" />
            </div>
            <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-sand-400 italic font-medium -mt-0.5">
              Satu langkah kecil hari ini.
            </p>
          </div>
        </div>

        {/* Live Streak & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Streak Badge */}
          <div className="hidden sm:block">
            <StreakBadge
              currentStreak={currentStreak}
              isGracePeriod={isGracePeriod}
              onClick={onOpenHansei}
            />
          </div>

          {/* Quick Action: Hansei Reflection */}
          {onOpenHansei && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenHansei}
              className="text-xs font-medium gap-1.5 shadow-sm bg-sand-200/80 text-charcoal-800 hover:bg-sand-300 dark:bg-charcoal-800 dark:text-sand-100 dark:hover:bg-charcoal-700"
            >
              <span>🌙</span>
              <span className="hidden md:inline">Refleksi</span> Hansei
            </Button>
          )}

          {/* Quick Action: Cadangan Data */}
          {onOpenBackup && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenBackup}
              className="text-xs font-medium gap-1.5 text-charcoal-700 hover:text-charcoal-900 dark:text-sand-300 dark:hover:text-sand-100"
            >
              <span>⚙️</span>
              <span className="hidden md:inline">Cadangan</span> Data
            </Button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-xl text-charcoal-600 dark:text-sand-300 hover:bg-sand-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-charcoal-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
