import React from "react";
import { cn } from "./utils";

export type BadgeVariant = "default" | "sage" | "amber" | "charcoal" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-sand-100 text-charcoal-700 dark:bg-charcoal-800 dark:text-sand-100 border border-sand-200/60 dark:border-charcoal-700",
  sage:
    "bg-sage-100 text-sage-800 dark:bg-sage-950/80 dark:text-sage-200 border border-sage-200 dark:border-sage-800",
  amber:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
  charcoal:
    "bg-charcoal-100 text-charcoal-800 dark:bg-charcoal-800 dark:text-sand-100 border border-charcoal-200 dark:border-charcoal-700",
  outline:
    "bg-transparent text-charcoal-700 dark:text-sand-200 border border-sand-300 dark:border-charcoal-700",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-2.5 py-1 text-xs font-medium sm:text-sm",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full leading-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
