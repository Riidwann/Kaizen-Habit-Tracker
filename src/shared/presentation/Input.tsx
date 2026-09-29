import React, { forwardRef, useId } from "react";
import { cn } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-charcoal-700 dark:text-sand-200 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-charcoal-400 dark:text-sand-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border bg-white dark:bg-charcoal-900 px-3.5 py-2 text-sm",
              "text-charcoal-900 dark:text-sand-100 placeholder:text-charcoal-400 dark:placeholder:text-charcoal-400",
              "transition-colors duration-150",
              "border-sand-300 dark:border-charcoal-700",
              "focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20",
              "disabled:bg-sand-100 dark:disabled:bg-charcoal-800 disabled:opacity-60 disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              error && "border-amber-600 focus:border-amber-600 focus:ring-amber-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-charcoal-400 dark:text-sand-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-charcoal-500 dark:text-sand-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, disabled, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs sm:text-sm font-medium text-charcoal-700 dark:text-sand-200 select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border bg-white dark:bg-charcoal-900 px-3.5 py-2 text-sm",
            "text-charcoal-900 dark:text-sand-100 placeholder:text-charcoal-400 dark:placeholder:text-charcoal-400",
            "transition-colors duration-150 resize-y",
            "border-sand-300 dark:border-charcoal-700",
            "focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20",
            "disabled:bg-sand-100 dark:disabled:bg-charcoal-800 disabled:opacity-60 disabled:cursor-not-allowed",
            error && "border-amber-600 focus:border-amber-600 focus:ring-amber-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-charcoal-500 dark:text-sand-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
