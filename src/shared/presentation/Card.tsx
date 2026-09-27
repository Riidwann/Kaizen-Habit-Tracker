import React, { forwardRef } from "react";
import { cn } from "./utils";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  interactive?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-6 sm:p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = "md", interactive = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl bg-white dark:bg-charcoal-900",
          "border border-sand-200/80 dark:border-charcoal-800",
          "shadow-sm transition-all duration-200",
          interactive &&
            "hover:shadow-md hover:border-sand-300 dark:hover:border-charcoal-700 cursor-pointer",
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
