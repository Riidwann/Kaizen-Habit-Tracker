import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Compass, ShieldCheck, Sun, HelpCircle, Info } from "lucide-react";
import { MicroActionCard } from "./MicroActionCard";
import { ActionTimerModal } from "./ActionTimerModal";
import { DailyCompletionState } from "./DailyCompletionState";
import { useSanctuaryController, SanctuaryController } from "./useSanctuaryController";
import { Card } from "@/shared/presentation/Card";
import { Badge } from "@/shared/presentation/Badge";
import { Button } from "@/shared/presentation/Button";

export interface DailySanctuaryViewProps {
  controller?: SanctuaryController;
  onOpenGuide?: () => void;
  className?: string;
}

export const DailySanctuaryView: React.FC<DailySanctuaryViewProps> = ({
  controller: injectedController,
  onOpenGuide,
  className = "",
}) => {
  const internalController = useSanctuaryController({ autoLoad: !injectedController });
  const controller = injectedController || internalController;

  const {
    actions,
    isLoading,
    error,
    activeTimerAction,
    isTimerOpen,
    allCompleted,
    completedCount,
    totalCount,
    progressPercentage,
    handleToggleComplete,
    handleToggleScaleDown,
    handleOpenTimer,
    handleCloseTimer,
    handleTimerComplete,
  } = controller;

  // Format today's date in serene Indonesian format
  const todayFormatted = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString();
    }
  }, []);

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-6 ${className}`}>
      {/* Sanctuary Header */}
      <header className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-700 dark:text-sage-400">
                <Compass className="w-3.5 h-3.5" />
                Tunnel Vision Focus
              </span>
              <Badge variant="sage" size="sm">
                1-3 Tindakan
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900 dark:text-sand-50">
              Daily Sanctuary & Fokus Hari Ini
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-sage-100/70 text-sage-800 dark:bg-sage-950/40 dark:text-sage-300 text-xs font-medium hover:bg-sage-200 transition-colors"
                title="Pelajari prinsip Kaizen & cara pakai"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sage-600" />
                <span>Panduan</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 text-xs font-medium border border-sand-200/80 dark:border-charcoal-700">
              <Calendar className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
              <span>{todayFormatted}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-charcoal-600 dark:text-sand-400 leading-relaxed max-w-2xl">
          Fokus pada 1–3 langkah mikro sederhana hari ini. Tidak ada daftar panjang yang membingungkan.
          Hanya kemajuan 1% yang terjangkau dan menenangkan.
        </p>

        {/* Micro-guide callout */}
        <div className="p-3 rounded-xl bg-sand-100/70 dark:bg-charcoal-800/50 border border-sand-200/70 dark:border-charcoal-700/70 flex items-start gap-2.5 text-xs text-charcoal-600 dark:text-sand-300">
          <Info className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mengapa hanya 1–3 aksi?</strong> Kaizen membatasi tindakan harian agar otak terhindar dari kepanikan daftar tugas. Tiap aksi dirancang ≤ 2 menit agar Anda bisa mulai tanpa rasa malas.
          </p>
        </div>
      </header>

      {/* 1% Daily Progress Bar */}
      <Card className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-sand-200/90 dark:border-charcoal-800 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-sand-300">
              1% Kemajuan Hari Ini
            </span>
            <span className="text-xs font-medium text-sage-700 dark:text-sage-400">
              ({progressPercentage}%)
            </span>
          </div>
          <span className="text-xs font-semibold text-charcoal-600 dark:text-sand-300">
            {completedCount} dari {totalCount} Selesai
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kemajuan fokus harian"
          className="w-full h-2.5 rounded-full bg-sand-200/70 dark:bg-charcoal-800 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-sage-500 to-sage-600 rounded-full"
          />
        </div>
      </Card>

      {/* Error Notice if any */}
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
          {error}
        </div>
      )}

      {/* Main Focus Content */}
      {allCompleted ? (
        <DailyCompletionState
          completedCount={completedCount}
          totalCount={totalCount}
        />
      ) : actions.length === 0 ? (
        /* Empty State */
        <Card className="p-8 sm:p-12 text-center rounded-2xl border-dashed border-sand-300 dark:border-charcoal-700">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sand-100 dark:bg-charcoal-800 text-sage-600 dark:text-sage-400 mb-3">
            <Sun className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-medium text-charcoal-900 dark:text-sand-100 mb-1">
            Belum ada fokus hari ini
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-sand-400 max-w-sm mx-auto leading-relaxed">
            Sanctuary Anda sedang tenang. Tindakan harian akan muncul otomatis saat Anda membuat target di tab
            <strong> Pohon Sasaran (Goal Forge)</strong> atau memuat contoh data.
          </p>
        </Card>
      ) : (
        /* 1-3 MicroAction Cards */
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {actions.map((action) => (
              <MicroActionCard
                key={action.id}
                action={action}
                onToggleComplete={handleToggleComplete}
                onToggleScaleDown={handleToggleScaleDown}
                onStartTimer={handleOpenTimer}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 2-Minute Action Timer Modal */}
      <ActionTimerModal
        isOpen={isTimerOpen}
        onClose={handleCloseTimer}
        action={activeTimerAction}
        onComplete={handleTimerComplete}
      />
    </div>
  );
};
