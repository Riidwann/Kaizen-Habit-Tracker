import React from "react";
import { Badge } from "@/shared/presentation/Badge";
import { ShieldCheck, Sprout } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface StreakBadgeProps {
  currentStreak: number;
  isGracePeriod: boolean;
  className?: string;
  onClick?: () => void;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  currentStreak,
  isGracePeriod,
  className,
  onClick,
}) => {
  if (isGracePeriod) {
    return (
      <Badge
        variant="amber"
        size="md"
        className={cn(
          "cursor-pointer select-none font-medium transition-transform active:scale-95 shadow-sm gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs",
          className
        )}
        onClick={onClick}
        title="Never Miss Twice: Lindungi momentummu dengan melakukan 1 aksi kecil hari ini!"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" />
        <span className="hidden sm:inline">Hari Pemulihan</span>
        <span className="inline sm:hidden font-semibold text-[11px]">Pulih</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="sage"
      size="md"
      className={cn(
        "cursor-pointer select-none font-medium transition-transform active:scale-95 shadow-sm gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs",
        className
      )}
      onClick={onClick}
      title={`${currentStreak} hari bertumbuh konsisten`}
    >
      <Sprout className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
      <span className="hidden sm:inline">{currentStreak} Hari Bertumbuh</span>
      <span className="inline sm:hidden font-semibold text-[11px]">{currentStreak}d</span>
    </Badge>
  );
};
