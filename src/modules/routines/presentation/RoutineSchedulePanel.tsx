import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Check,
  Trash2,
  Clock,
  CalendarClock,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useRoutineController } from "./useRoutineController";
import { cn } from "@/shared/presentation/utils";

export interface RoutineSchedulePanelProps {
  controller: ReturnType<typeof useRoutineController>;
  className?: string;
}

const DAYS_META: { day: number; label: string; short: string }[] = [
  { day: 1, label: "Senin", short: "Sen" },
  { day: 2, label: "Selasa", short: "Sel" },
  { day: 3, label: "Rabu", short: "Rab" },
  { day: 4, label: "Kamis", short: "Kam" },
  { day: 5, label: "Jumat", short: "Jum" },
  { day: 6, label: "Sabtu", short: "Sab" },
  { day: 0, label: "Minggu", short: "Min" },
];

export const RoutineSchedulePanel: React.FC<RoutineSchedulePanelProps> = ({
  controller,
  className,
}) => {
  const {
    routines,
    todayRoutines,
    remainingCountToday,
    completedCountToday,
    addRoutine,
    toggleCompleteToday,
    deleteRoutine,
    error,
  } = controller;

  const [activeFilter, setActiveFilter] = useState<"today" | "all">("today");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const todayDay = useMemo(() => new Date().getDay(), []);

  const handleToggleDay = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleSelectAllDays = () => {
    setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
  };

  const handleSelectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const handleAddSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) {
        setValidationError("Nama rutinitas tidak boleh kosong");
        return;
      }
      if (!/^\d{2}:\d{2}$/.test(time)) {
        setValidationError("Format jam harus HH:mm");
        return;
      }
      if (selectedDays.length === 0) {
        setValidationError("Pilih minimal 1 hari aktif");
        return;
      }

      setValidationError(null);
      setIsSubmitting(true);
      try {
        const success = await addRoutine({
          title: trimmed,
          time,
          daysOfWeek: selectedDays,
        });
        if (success) {
          setTitle("");
          setTime("07:00");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, time, selectedDays, addRoutine]
  );

  const displayedRoutines = activeFilter === "today" ? todayRoutines : routines;

  return (
    <div className={cn("space-y-5", className)}>
      {/* 1. Add Routine Schedule Form */}
      <form
        onSubmit={handleAddSubmit}
        className="p-3.5 sm:p-4 rounded-2xl bg-sand-100/70 dark:bg-charcoal-950/70 border border-sand-200/80 dark:border-charcoal-800 space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Nama rutinitas (cth: Minum air putih, Meditasi)..."
            aria-label="Nama rutinitas baru"
            className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-charcoal-900 border border-sand-300/80 dark:border-charcoal-700 text-charcoal-900 dark:text-sand-50 placeholder:text-charcoal-400 dark:placeholder:text-sand-500 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* Time Picker */}
            <div className="relative flex items-center">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                aria-label="Waktu rutinitas"
                className="w-24 sm:w-auto min-h-[44px] px-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-sand-300/80 dark:border-charcoal-700 text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Options Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOptionsOpen((prev) => !prev)}
              aria-label="Atur hari pengulangan"
              aria-expanded={isOptionsOpen}
              title="Atur hari pengulangan"
              className={cn(
                "min-h-[44px] min-w-[44px] p-2.5 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0",
                isOptionsOpen
                  ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200"
                  : "bg-white dark:bg-charcoal-900 border-sand-300/80 dark:border-charcoal-700 text-charcoal-500 dark:text-sand-400 hover:text-charcoal-800 dark:hover:text-sand-200 hover:border-sand-400"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              aria-label="Simpan jadwal rutinitas"
              className="min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Day Selector Chips (Collapsible) */}
        {isOptionsOpen && (
          <div className="space-y-1.5 pt-2 border-t border-sand-200/60 dark:border-charcoal-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-charcoal-500 dark:text-sand-400">
                Pilih Hari
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllDays}
                  className="text-[10px] font-semibold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  Setiap Hari
                </button>
                <span className="text-charcoal-300 dark:text-charcoal-600 text-xs">|</span>
                <button
                  type="button"
                  onClick={handleSelectWeekdays}
                  className="text-[10px] font-semibold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  Hari Kerja
                </button>
              </div>
            </div>

            <div
              className="grid grid-cols-7 gap-1"
              role="group"
              aria-label="Pilih hari aktif rutinitas"
            >
              {DAYS_META.map((item) => {
                const isSelected = selectedDays.includes(item.day);
                const isToday = item.day === todayDay;

                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => handleToggleDay(item.day)}
                    aria-pressed={isSelected}
                    title={`${item.label}${isToday ? " (Hari Ini)" : ""}`}
                    className={cn(
                      "min-h-[36px] py-1 px-0.5 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center border focus:outline-none focus:ring-2 focus:ring-amber-500",
                      isSelected
                        ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                        : "bg-white/70 dark:bg-charcoal-900/70 border-sand-300/60 dark:border-charcoal-700 text-charcoal-500 dark:text-sand-400 hover:border-sand-400",
                      isToday && !isSelected && "ring-1 ring-amber-400"
                    )}
                  >
                    <span>{item.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Validation or Controller Error Message */}
        {(validationError || error) && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}
      </form>

      {/* 2. Filter Tabs (Hari Ini vs Semua) */}
      <div className="flex items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter("today")}
            className={cn(
              "min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500",
              activeFilter === "today"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-charcoal-700"
            )}
          >
            <span>Hari Ini</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                activeFilter === "today"
                  ? "bg-amber-700 text-white"
                  : "bg-sand-200/80 dark:bg-charcoal-900 text-charcoal-600 dark:text-sand-300"
              )}
            >
              {todayRoutines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500",
              activeFilter === "all"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-charcoal-700"
            )}
          >
            <span>Semua Rutinitas</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                activeFilter === "all"
                  ? "bg-amber-700 text-white"
                  : "bg-sand-200/80 dark:bg-charcoal-900 text-charcoal-600 dark:text-sand-300"
              )}
            >
              {routines.length}
            </span>
          </button>
        </div>

        {activeFilter === "today" && todayRoutines.length > 0 && (
          <span className="text-[11px] text-charcoal-500 dark:text-sand-400 font-medium">
            {remainingCountToday === 0 ? (
              <span className="text-sage-600 dark:text-sage-400 font-semibold">
                Semua tuntas! 🎉
              </span>
            ) : (
              <span>{remainingCountToday} tersisa</span>
            )}
          </span>
        )}
      </div>

      {/* 3. Routine List Items */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {displayedRoutines.map((routine) => {
            const isActiveToday = routine.daysOfWeek.includes(todayDay);

            return (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "group flex items-start gap-2.5 p-3 rounded-2xl border transition-all",
                  routine.isCompletedToday
                    ? "bg-sand-100/50 dark:bg-charcoal-950/40 border-sand-200/50 dark:border-charcoal-800/60 opacity-80"
                    : "bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800 shadow-sm hover:border-sand-300 dark:hover:border-charcoal-700"
                )}
              >
                {/* 44px Checkbox Button */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={routine.isCompletedToday}
                  onClick={() => toggleCompleteToday(routine.id)}
                  aria-label={`Tandai "${routine.title}" ${routine.isCompletedToday ? "belum selesai hari ini" : "selesai hari ini"}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 -mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0 cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                      routine.isCompletedToday
                        ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                        : "border-sand-300 dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 hover:border-amber-500"
                    )}
                  >
                    {routine.isCompletedToday && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Time Badge */}
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                      <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      {routine.time}
                    </span>

                    {/* Today indicator if not in 'today' filter */}
                    {activeFilter === "all" && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.2 rounded",
                          isActiveToday
                            ? "bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-300"
                            : "bg-sand-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-sand-500"
                        )}
                      >
                        {isActiveToday ? "Aktif Hari Ini" : "Bukan Hari Ini"}
                      </span>
                    )}
                  </div>

                  <p
                    className={cn(
                      "text-sm break-words transition-colors leading-snug",
                      routine.isCompletedToday
                        ? "line-through text-charcoal-400 dark:text-sand-500"
                        : "text-charcoal-900 dark:text-sand-50 font-medium"
                    )}
                  >
                    {routine.title}
                  </p>

                  {/* Active Day Pills Indicator */}
                  <div className="flex items-center gap-1 pt-0.5">
                    {DAYS_META.map((d) => {
                      const isDayActive = routine.daysOfWeek.includes(d.day);
                      const isCurrentDay = d.day === todayDay;

                      return (
                        <span
                          key={d.day}
                          title={`${d.label}${isCurrentDay ? " (Hari Ini)" : ""}`}
                          className={cn(
                            "w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center transition-colors",
                            isDayActive
                              ? isCurrentDay
                                ? "bg-amber-600 text-white ring-1 ring-amber-400 font-extrabold"
                                : "bg-sand-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-sand-200"
                              : "text-charcoal-300 dark:text-charcoal-600 bg-transparent"
                          )}
                        >
                          {d.short[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Delete Button (44px target) */}
                <button
                  type="button"
                  onClick={() => deleteRoutine(routine.id)}
                  aria-label={`Hapus rutinitas ${routine.title}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 -mt-1 rounded-xl text-charcoal-400 hover:text-rose-600 dark:text-sand-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0"
                  title="Hapus rutinitas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {displayedRoutines.length === 0 && (
          <div className="text-center py-10 px-4 rounded-2xl bg-sand-50 dark:bg-charcoal-950/50 border border-dashed border-sand-200 dark:border-charcoal-800 space-y-2">
            <div className="w-10 h-10 rounded-full bg-sand-200/60 dark:bg-charcoal-800 flex items-center justify-center mx-auto text-charcoal-400 dark:text-sand-500">
              <CalendarClock className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-sand-200">
              {activeFilter === "today"
                ? "Tidak ada jadwal rutinitas untuk hari ini"
                : "Belum ada jadwal rutinitas"}
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-sand-400 max-w-xs mx-auto leading-relaxed">
              {activeFilter === "today"
                ? "Tambahkan rutinitas harian atau aktifkan hari ini pada jadwal yang ada."
                : "Atur rutinitas kecil pada jam tertentu untuk membangun ritme hidup yang konsisten."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
