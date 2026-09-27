import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Feather, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/shared/presentation/Button";

export interface DailyCompletionStateProps {
  completedCount?: number;
  totalCount?: number;
  onResetFocus?: () => void;
  className?: string;
}

export const DailyCompletionState: React.FC<DailyCompletionStateProps> = ({
  completedCount = 3,
  totalCount = 3,
  onResetFocus,
  className = "",
}) => {
  useEffect(() => {
    // Gentle pastel confetti (runs only in actual browser, avoiding jsdom not implemented logs)
    try {
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const isJsdom = navigator.userAgent && navigator.userAgent.includes("jsdom");
        if (!isJsdom) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.65 },
            colors: ["#68B38A", "#AC9A73", "#FCD34D", "#A7F3D0"],
            ticks: 180,
            disableForReducedMotion: true,
          });
        }
      }
    } catch {
      // Graceful fallback for non-canvas or mock test environments
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-b from-sage-50/60 via-sand-50/40 to-white dark:from-sage-950/20 dark:via-charcoal-900 dark:to-charcoal-900 border border-sage-200/80 dark:border-sage-800/60 shadow-md ${className}`}
    >
      {/* Decorative Zen glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sage-200/30 dark:bg-sage-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Completion Icon Badge */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-100 dark:bg-sage-900/60 border border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-300 shadow-sm mb-5">
        <Sparkles className="w-8 h-8 stroke-[1.75]" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900 dark:text-sand-50 mb-2">
        Semua Fokus Selesai Hari Ini
      </h3>

      <p className="text-sm font-medium text-sage-800 dark:text-sage-300 mb-6 flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-4 h-4" />
        <span>{completedCount} dari {totalCount} tindakan fokus tuntas dengan tenang</span>
      </p>

      {/* Calm Zen Quote */}
      <div className="max-w-md mx-auto my-6 p-5 rounded-2xl bg-white/70 dark:bg-charcoal-800/60 backdrop-blur-sm border border-sand-200/80 dark:border-charcoal-700 text-charcoal-700 dark:text-sand-300">
        <p className="text-sm italic font-serif leading-relaxed">
          “Satu langkah kecil hari ini adalah awal dari seribu li perjalanan yang damai. Kaizen bukanlah tentang terburu-buru, melainkan tentang tidak pernah berhenti.”
        </p>
        <span className="block text-xs font-medium text-charcoal-500 dark:text-sand-400 mt-2">
          — Filosofi Kaizen Sanctuary
        </span>
      </div>

      {/* Positive reinforcement */}
      <div className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-500 dark:text-sand-400 mt-2">
        <Heart className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 fill-sage-500/20" />
        <span>Pikiran Anda bebas beban untuk sisa hari ini. Beristirahatlah dengan tenang.</span>
      </div>

      {onResetFocus && (
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFocus}
            className="rounded-full text-xs text-charcoal-600 dark:text-sand-300 hover:text-charcoal-900"
          >
            Tinjau Tindakan Hari Ini
          </Button>
        </div>
      )}
    </motion.div>
  );
};
