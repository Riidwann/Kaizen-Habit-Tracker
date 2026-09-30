import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Clock, MoreHorizontal, ShieldCheck, Timer, Zap, Trash2 } from "lucide-react";
import { MicroAction } from "../domain/MicroAction";
import { Badge, BadgeVariant } from "@/shared/presentation/Badge";
import { cn } from "@/shared/presentation/utils";

export interface MicroActionCardProps {
  action: MicroAction;
  onToggleComplete: (id: string) => void;
  onToggleScaleDown: (id: string) => void;
  onStartTimer: (action: MicroAction) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const categoryVariantMap: Record<string, BadgeVariant> = {
  mindset: "sage",
  health: "sage",
  learning: "amber",
  career: "charcoal",
  creativity: "amber",
};

export const MicroActionCard = React.forwardRef<HTMLDivElement, MicroActionCardProps>(
  (
    {
      action,
      onToggleComplete,
      onToggleScaleDown,
      onStartTimer,
      onDelete,
      className,
    },
    ref
  ) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const displayTitle = action.isScaledDown ? action.scaleDownTitle : action.title;
    const badgeVariant = action.category ? categoryVariantMap[action.category] || "sage" : "sage";

    // Close options menu on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };
      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMenuOpen]);

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsMenuOpen(false);
        }
      };
      if (isMenuOpen) {
        document.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isMenuOpen]);

    const handleAction = useCallback((callback: () => void) => {
      setIsMenuOpen(false);
      callback();
    }, []);

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl transition-all duration-200",
          "bg-white dark:bg-charcoal-900 border",
          action.isCompletedToday
            ? "border-sage-200 dark:border-sage-900/40 bg-sage-50/20 dark:bg-sage-950/10"
            : action.isScaledDown
            ? "border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
            : "border-sand-200/90 dark:border-charcoal-800 shadow-sm hover:border-sand-300 dark:hover:border-charcoal-700",
          className
        )}
      >
        {/* Left side: 44px Checkbox & Habit Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            role="checkbox"
            aria-checked={action.isCompletedToday}
            aria-label={`Tandai selesai untuk ${displayTitle}`}
            onClick={() => onToggleComplete(action.id)}
            className={cn(
              "flex-shrink-0 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-xl flex items-center justify-center border transition-all duration-200 select-none",
              "focus:outline-none focus:ring-2 focus:ring-sage-500/40 active:scale-95",
              action.isCompletedToday
                ? "bg-sage-600 border-sage-600 text-white shadow-sm"
                : "border-sand-300 dark:border-charcoal-600 bg-sand-50/60 dark:bg-charcoal-800/80 hover:border-sage-500 text-transparent"
            )}
          >
            <motion.div
              initial={false}
              animate={{ scale: action.isCompletedToday ? 1 : 0.4, opacity: action.isCompletedToday ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
            </motion.div>
          </button>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {action.category && (
                <Badge variant={badgeVariant} size="sm">
                  {action.category}
                </Badge>
              )}

              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal-500 dark:text-sand-400">
                <Clock className="w-3 h-3 text-sage-600 dark:text-sage-400" />
                ≤ {action.estimatedMinutes}m
              </span>

              {action.isScaledDown && (
                <Badge variant="amber" size="sm" className="gap-1 animate-fadeIn">
                  <ShieldCheck className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                  Mode 2-Menit
                </Badge>
              )}
            </div>

            <span
              className={cn(
                "text-sm sm:text-base font-medium leading-snug transition-all duration-200 break-words",
                action.isCompletedToday
                  ? "line-through text-charcoal-400 dark:text-sand-500"
                  : "text-charcoal-900 dark:text-sand-50"
              )}
            >
              {displayTitle}
            </span>

            {action.isScaledDown && !action.isCompletedToday && (
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                Langkah diringankan agar tetap konsisten. Mulai saja 2 menit!
              </p>
            )}
          </div>
        </div>

        {/* Right side: Single Clean Options Menu (⋯) */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={`Opsi Kebiasaan ${displayTitle}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl flex items-center justify-center text-charcoal-500 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-sand-100 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
            title="Opsi Kebiasaan"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              aria-label="Menu Opsi Kebiasaan"
              className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white dark:bg-charcoal-900 border border-sand-200/90 dark:border-charcoal-700 shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150"
            >
              {!action.isCompletedToday && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onStartTimer(action))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800/80 transition-colors text-left"
                >
                  <Timer className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                  <span>Mulai Timer (Opsional - {action.estimatedMinutes} Menit)</span>
                </button>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onToggleScaleDown(action.id))}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors text-left"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{action.isScaledDown ? "Kembali ke Normal" : "Peringan Tugas (Aturan 2-Mnt)"}</span>
              </button>

              {onDelete && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onDelete(action.id))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left border-t border-sand-100 dark:border-charcoal-800"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Hapus Kebiasaan</span>
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

MicroActionCard.displayName = "MicroActionCard";
