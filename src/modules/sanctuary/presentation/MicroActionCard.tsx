import React from "react";
import { motion } from "framer-motion";
import { Check, Clock, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";
import { MicroAction } from "../domain/MicroAction";
import { Badge, BadgeVariant } from "@/shared/presentation/Badge";
import { Button } from "@/shared/presentation/Button";
import { cn } from "@/shared/presentation/utils";

export interface MicroActionCardProps {
  action: MicroAction;
  onToggleComplete: (id: string) => void;
  onToggleScaleDown: (id: string) => void;
  onStartTimer: (action: MicroAction) => void;
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
      className,
    },
    ref
  ) => {
    const displayTitle = action.isScaledDown ? action.scaleDownTitle : action.title;
    const badgeVariant = action.category ? categoryVariantMap[action.category] || "sage" : "sage";

    return (
      <motion.div
        ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl transition-all duration-300",
        "bg-white dark:bg-charcoal-900 border",
        action.isCompletedToday
          ? "border-sage-200 dark:border-sage-900/40 bg-sage-50/30 dark:bg-sage-950/10"
          : action.isScaledDown
          ? "border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
          : "border-sand-200/90 dark:border-charcoal-800 shadow-sm hover:shadow-md hover:border-sand-300 dark:hover:border-charcoal-700",
        className
      )}
    >
      {/* Left side: Checkbox & Task details */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          role="checkbox"
          aria-checked={action.isCompletedToday}
          aria-label={`Tandai selesai untuk ${displayTitle}`}
          onClick={() => onToggleComplete(action.id)}
          className={cn(
            "mt-0.5 sm:mt-0 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:ring-offset-1",
            action.isCompletedToday
              ? "bg-sage-600 border-sage-600 text-white shadow-sm"
              : "border-sand-300 dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800/80 hover:border-sage-500 text-transparent"
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: action.isCompletedToday ? 1 : 0.4, opacity: action.isCompletedToday ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </motion.div>
        </button>

        <div className="flex flex-col min-w-0 flex-1">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                Mode Darurat: Disederhanakan
              </Badge>
            )}
          </div>

          {/* Action Title */}
          <span
            className={cn(
              "text-base font-medium leading-snug transition-all duration-200",
              action.isCompletedToday
                ? "line-through text-charcoal-400 dark:text-sand-500"
                : "text-charcoal-900 dark:text-sand-50"
            )}
          >
            {displayTitle}
          </span>

          {action.isScaledDown && !action.isCompletedToday && (
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
              Langkah diperkecil agar tidak ada hambatan mental. Mulai saja 1 detik!
            </p>
          )}
        </div>
      </div>

      {/* Right side: Action controls */}
      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0">
        {/* Emergency Scale-Down Button */}
        <button
          type="button"
          onClick={() => onToggleScaleDown(action.id)}
          aria-label="Terlalu Berat? Skala turunkan tindakan"
          title="Jika merasa lelah atau kewalahan, turunkan ke langkah termudah tanpa rasa bersalah"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 border",
            action.isScaledDown
              ? "bg-amber-100/70 border-amber-300/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200"
              : "bg-sand-50 dark:bg-charcoal-800 border-sand-200 dark:border-charcoal-700 text-charcoal-600 dark:text-sand-300 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800 dark:hover:bg-charcoal-700"
          )}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{action.isScaledDown ? "Pulihkan" : "Terlalu Berat?"}</span>
        </button>

        {/* 2-Minute Timer Button */}
        {!action.isCompletedToday && (
          <Button
            type="button"
            variant="sage"
            size="sm"
            onClick={() => onStartTimer(action)}
            className="gap-1.5 shadow-sm text-xs font-semibold py-1.5 px-3 rounded-xl"
            aria-label="Buka ⏱️ 2-Min Timer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ 2-Min Timer</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
});

MicroActionCard.displayName = "MicroActionCard";
