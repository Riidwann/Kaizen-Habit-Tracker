import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeOnClickOutside?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  closeOnClickOutside = true,
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow || "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop with solid semi-transparent color - zero blur texture flicker */}
          <div
            className="fixed inset-0 bg-charcoal-950/60 dark:bg-black/75 -z-10"
            onClick={closeOnClickOutside ? () => onCloseRef.current() : undefined}
            data-testid="modal-backdrop"
          />

          {/* Dialog Container */}
          <motion.div
            key="modal-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-charcoal-900",
              "border border-sand-200/80 dark:border-charcoal-800",
              "shadow-2xl z-10 p-4 sm:p-6",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4 pb-2 shrink-0">
              <div className="pr-2">
                {title && (
                  <h2 className="text-base sm:text-lg font-semibold text-charcoal-900 dark:text-sand-50">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-charcoal-500 dark:text-sand-400 mt-0.5">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onCloseRef.current()}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body with vertical scroll for long forms / mobile keyboards */}
            <div className="overflow-y-auto overflow-x-hidden pr-0.5 flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
