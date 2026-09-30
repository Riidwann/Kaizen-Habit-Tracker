import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ListTodo, CalendarClock } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export type DrawerTab = "todo" | "routine";

export interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  activeTodosCount?: number;
  remainingRoutinesCount?: number;
  children: React.ReactNode;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  activeTodosCount = 0,
  remainingRoutinesCount = 0,
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const variants = {
    hidden: isMobile
      ? { y: "100%" }
      : { x: "100%" },
    visible: isMobile
      ? { y: 0 }
      : { x: 0 },
    exit: isMobile
      ? { y: "100%" }
      : { x: "100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Panel Akses Cepat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex sm:justify-end"
        >
          {/* Backdrop with solid semi-transparent color - zero blur texture flicker */}
          <div
            className="fixed inset-0 bg-charcoal-950/60 dark:bg-black/75 -z-10"
            onClick={() => onCloseRef.current()}
            data-testid="drawer-backdrop"
          />

          {/* Drawer Container (Desktop: Right Slide-Over, Mobile: Bottom Sheet) */}
          <motion.div
            key="drawer-panel-card"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative z-10 flex flex-col bg-white dark:bg-charcoal-900 shadow-2xl",
              "border-sand-200/80 dark:border-charcoal-800",
              // Mobile layout: Bottom sheet
              "w-full max-h-[88vh] mt-auto rounded-t-3xl border-t",
              // Desktop layout: Slide-over right panel
              "sm:mt-0 sm:max-h-full sm:h-full sm:w-full sm:max-w-md sm:rounded-l-3xl sm:rounded-tr-none sm:border-l sm:border-t-0"
            )}
          >
            {/* Mobile Drag Indicator */}
            <div className="pt-2.5 pb-1 sm:hidden flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-sand-300 dark:bg-charcoal-700 rounded-full" />
            </div>

            {/* Header: Title, Tab Switcher & Close button */}
            <div className="px-4 sm:px-6 pt-2 sm:pt-5 pb-3 border-b border-sand-200/60 dark:border-charcoal-800 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-sand-50 tracking-tight">
                    Akses Cepat
                  </h2>
                  <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-sand-400">
                    Kelola tugas harian & jadwal rutinitas konsisten.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup panel akses cepat"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:text-sand-400 dark:hover:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Switcher Pills */}
              <div
                role="tablist"
                aria-label="Pilihan Panel Akses Cepat"
                className="grid grid-cols-2 gap-1.5 p-1 bg-sand-200/50 dark:bg-charcoal-950 rounded-xl border border-sand-300/40 dark:border-charcoal-800"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-todo"
                  aria-selected={activeTab === "todo"}
                  aria-controls="panel-todo"
                  onClick={() => onTabChange("todo")}
                  className={cn(
                    "min-h-[42px] flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sage-500",
                    activeTab === "todo"
                      ? "bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-sand-50 shadow-sm"
                      : "text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-sand-200"
                  )}
                >
                  <ListTodo
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      activeTab === "todo"
                        ? "text-sage-600 dark:text-sage-400"
                        : "text-charcoal-400 dark:text-sand-500"
                    )}
                  />
                  <span>To-Do</span>
                  {activeTodosCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-300 border border-sage-200/60 dark:border-sage-800">
                      {activeTodosCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-routine"
                  aria-selected={activeTab === "routine"}
                  aria-controls="panel-routine"
                  onClick={() => onTabChange("routine")}
                  className={cn(
                    "min-h-[42px] flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sage-500",
                    activeTab === "routine"
                      ? "bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-sand-50 shadow-sm"
                      : "text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-sand-200"
                  )}
                >
                  <CalendarClock
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      activeTab === "routine"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-charcoal-400 dark:text-sand-500"
                    )}
                  />
                  <span>Jadwal Rutin</span>
                  {remainingRoutinesCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                      {remainingRoutinesCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Panel Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
