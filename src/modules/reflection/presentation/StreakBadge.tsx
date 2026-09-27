import React from "react";
import { Badge } from "@/shared/presentation/Badge";
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
          "cursor-pointer select-none font-medium transition-transform active:scale-95 shadow-sm",
          className
        )}
        onClick={onClick}
        title="Never Miss Twice: Lindungi momentummu dengan melakukan 1 aksi kecil hari ini!"
      >
        <span>🛡️</span>
        <span>Hari Pemulihan</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="sage"
      size="md"
      className={cn(
        "cursor-pointer select-none font-medium transition-transform active:scale-95 shadow-sm",
        className
      )}
      onClick={onClick}
      title={`${currentStreak} hari bertumbuh konsisten`}
    >
      <span>🌱</span>
      <span>{currentStreak} Hari Bertumbuh</span>
    </Badge>
  );
};
