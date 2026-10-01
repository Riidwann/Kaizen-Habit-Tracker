import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "emergency" | "danger" | "sage";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  sage:
    "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 shadow-sm focus-visible:ring-sage-500",
  secondary:
    "bg-sand-200 text-charcoal-800 hover:bg-sand-300 dark:bg-charcoal-800 dark:text-sand-100 dark:hover:bg-charcoal-700 shadow-xs focus-visible:ring-sand-400",
  outline:
    "border border-sand-300 dark:border-charcoal-700 bg-transparent text-charcoal-800 dark:text-sand-100 hover:bg-sand-100/60 dark:hover:bg-charcoal-800/60 focus-visible:ring-sage-500",
  ghost:
    "bg-transparent text-charcoal-700 dark:text-sand-200 hover:bg-sand-100/80 dark:hover:bg-charcoal-800/80 focus-visible:ring-sand-400",
  emergency:
    "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-sm focus-visible:ring-amber-500",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]",
  md: "px-4 py-2 text-sm rounded-xl gap-2 min-h-[44px]",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5 min-h-[48px]",
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
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-100 ease-out select-none",
          "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
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
      </button>
    );
  }
);

Button.displayName = "Button";
