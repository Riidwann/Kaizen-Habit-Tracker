import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "emergency";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 shadow-sm focus-visible:ring-sage-500",
  secondary:
    "bg-sand-200 text-charcoal-800 hover:bg-sand-300 dark:bg-charcoal-800 dark:text-sand-100 dark:hover:bg-charcoal-700 shadow-xs focus-visible:ring-sand-400",
  outline:
    "border border-sand-300 dark:border-charcoal-700 bg-transparent text-charcoal-800 dark:text-sand-100 hover:bg-sand-100/60 dark:hover:bg-charcoal-800/60 focus-visible:ring-sage-500",
  ghost:
    "bg-transparent text-charcoal-700 dark:text-sand-200 hover:bg-sand-100/80 dark:hover:bg-charcoal-800/80 focus-visible:ring-sand-400",
  emergency:
    "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-sm focus-visible:ring-amber-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={isDisabled}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        whileHover={{ scale: isDisabled ? 1 : 1.01 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
