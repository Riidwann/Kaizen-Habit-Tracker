import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Check,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  SlidersHorizontal,
} from "lucide-react";
import { useTodoController, TodoFilter } from "./useTodoController";
import { TodoPriority } from "../domain/TodoItem";
import { cn } from "@/shared/presentation/utils";

export interface TodoListPanelProps {
  controller: ReturnType<typeof useTodoController>;
  className?: string;
}

const PRIORITY_OPTIONS: { id: TodoPriority; label: string; activeClass: string }[] = [
  {
    id: "low",
    label: "Rendah",
    activeClass:
      "bg-sage-100 text-sage-800 border-sage-400 dark:bg-sage-950 dark:text-sage-200 dark:border-sage-700",
  },
  {
    id: "medium",
    label: "Sedang",
    activeClass:
      "bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
  },
  {
    id: "high",
    label: "Tinggi",
    activeClass:
      "bg-rose-100 text-rose-800 border-rose-400 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700",
  },
];

function formatDueDate(dueDateStr: string): { label: string; isOverdue: boolean } {
  const target = new Date(dueDateStr + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;

  if (diffDays === 0) return { label: "Hari ini", isOverdue: false };
  if (diffDays === 1) return { label: "Besok", isOverdue: false };
  if (diffDays === -1) return { label: "Kemarin", isOverdue: true };

  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(target);

  return { label: formatted, isOverdue };
}

export const TodoListPanel: React.FC<TodoListPanelProps> = ({
  controller,
  className,
}) => {
  const {
    todos,
    allTodos,
    activeTodosCount,
    completedTodosCount,
    filter,
    setFilter,
    addTodo,
    toggleCompleteTodo,
    deleteTodo,
    error,
  } = controller;

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) {
        setValidationError("Judul tugas tidak boleh kosong");
        return;
      }
      setValidationError(null);
      setIsSubmitting(true);
      try {
        const success = await addTodo({
          title: trimmed,
          priority,
          dueDate: dueDate || null,
        });
        if (success) {
          setTitle("");
          setDueDate("");
          setShowDatePicker(false);
          setPriority("medium");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, priority, dueDate, addTodo]
  );

  return (
    <div className={cn("space-y-5", className)}>
      {/* 1. Quick Add Task Form */}
      <form
        onSubmit={handleAddSubmit}
        className="p-3.5 sm:p-4 rounded-2xl bg-sand-100/70 dark:bg-charcoal-950/70 border border-sand-200/80 dark:border-charcoal-800 space-y-3"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Tambah tugas baru..."
            aria-label="Judul tugas baru"
            className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-charcoal-900 border border-sand-300/80 dark:border-charcoal-700 text-charcoal-900 dark:text-sand-50 placeholder:text-charcoal-400 dark:placeholder:text-sand-500 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setIsOptionsOpen((prev) => !prev)}
            aria-label="Atur prioritas dan tenggat"
            aria-expanded={isOptionsOpen}
            title="Pengaturan prioritas dan tenggat"
            className={cn(
              "min-h-[44px] min-w-[44px] p-2.5 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 shrink-0",
              isOptionsOpen
                ? "bg-sage-100 dark:bg-sage-950/60 border-sage-400 dark:border-sage-700 text-sage-800 dark:text-sage-200"
                : "bg-white dark:bg-charcoal-900 border-sand-300/80 dark:border-charcoal-700 text-charcoal-500 dark:text-sand-400 hover:text-charcoal-800 dark:hover:text-sand-200 hover:border-sand-400"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            aria-label="Simpan tugas baru"
            className="min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-sage-500"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>

        {/* Priority & Due Date Options (Collapsible) */}
        {isOptionsOpen && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sand-200/60 dark:border-charcoal-800/80">
            {/* Priority Selector Pills */}
            <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Prioritas tugas">
              <span className="text-[11px] font-medium text-charcoal-500 dark:text-sand-400 mr-0.5">
                Prioritas:
              </span>
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = priority === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setPriority(opt.id)}
                    className={cn(
                      "min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-sage-500",
                      isSelected
                        ? opt.activeClass
                        : "bg-white/60 dark:bg-charcoal-900/60 border-sand-300/60 dark:border-charcoal-700 text-charcoal-600 dark:text-sand-400 hover:border-sand-400"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Due Date Toggle */}
            <div className="flex items-center gap-1.5">
              {!showDatePicker && !dueDate ? (
                <button
                  type="button"
                  onClick={() => setShowDatePicker(true)}
                  className="min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-medium text-charcoal-600 dark:text-sand-400 hover:bg-sand-200/50 dark:hover:bg-charcoal-800 border border-dashed border-sand-300 dark:border-charcoal-700 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <Calendar className="w-3.5 h-3.5 text-charcoal-500 dark:text-sand-400" />
                  <span>Batas Waktu</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    aria-label="Pilih tanggal batas waktu"
                    className="min-h-[36px] px-2 py-1 rounded-lg bg-white dark:bg-charcoal-900 border border-sand-300 dark:border-charcoal-700 text-xs text-charcoal-800 dark:text-sand-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                  {dueDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setDueDate("");
                        setShowDatePicker(false);
                      }}
                      aria-label="Hapus batas waktu"
                      className="p-1 rounded-md text-charcoal-400 hover:text-charcoal-700 dark:hover:text-sand-200 text-xs"
                      title="Batal tanggal"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
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

      {/* 2. Filter Tabs */}
      <div className="flex items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: "all", label: "Semua", count: allTodos.length },
              { id: "active", label: "Aktif", count: activeTodosCount },
              { id: "completed", label: "Selesai", count: completedTodosCount },
            ] as { id: TodoFilter; label: string; count: number }[]
          ).map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-sage-500",
                  isActive
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-charcoal-700"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                    isActive
                      ? "bg-sage-700 text-white"
                      : "bg-sand-200/80 dark:bg-charcoal-900 text-charcoal-600 dark:text-sand-300"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Task Items List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {todos.map((todo) => {
            const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

            return (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "group flex items-start gap-2.5 p-3 rounded-2xl border transition-all",
                  todo.isCompleted
                    ? "bg-sand-100/50 dark:bg-charcoal-950/40 border-sand-200/50 dark:border-charcoal-800/60 opacity-80"
                    : "bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800 shadow-sm hover:border-sand-300 dark:hover:border-charcoal-700"
                )}
              >
                {/* 44px Checkbox Button */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={todo.isCompleted}
                  onClick={() => toggleCompleteTodo(todo.id)}
                  aria-label={`Tandai "${todo.title}" ${todo.isCompleted ? "belum selesai" : "selesai"}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 -mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 shrink-0 cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                      todo.isCompleted
                        ? "bg-sage-600 border-sage-600 text-white shadow-xs"
                        : "border-sand-300 dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 hover:border-sage-500"
                    )}
                  >
                    {todo.isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-1">
                  <p
                    className={cn(
                      "text-sm break-words transition-colors leading-snug",
                      todo.isCompleted
                        ? "line-through text-charcoal-400 dark:text-sand-500"
                        : "text-charcoal-900 dark:text-sand-50 font-medium"
                    )}
                  >
                    {todo.title}
                  </p>

                  {/* Metadata Row: Priority & Due Date */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {/* Priority Badge */}
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md border",
                        todo.priority === "high" &&
                          "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60",
                        todo.priority === "medium" &&
                          "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60",
                        todo.priority === "low" &&
                          "bg-sage-50 text-sage-700 border-sage-200/80 dark:bg-sage-950/60 dark:text-sage-300 dark:border-sage-900/60"
                      )}
                    >
                      {todo.priority === "high"
                        ? "Tinggi"
                        : todo.priority === "medium"
                        ? "Sedang"
                        : "Rendah"}
                    </span>

                    {/* Due Date Badge */}
                    {dueDateInfo && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border",
                          dueDateInfo.isOverdue && !todo.isCompleted
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60"
                            : "bg-sand-100 text-charcoal-600 border-sand-200 dark:bg-charcoal-800 dark:text-sand-400 dark:border-charcoal-700"
                        )}
                      >
                        {dueDateInfo.isOverdue && !todo.isCompleted ? (
                          <Clock className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                        ) : (
                          <Calendar className="w-3 h-3 text-charcoal-500 dark:text-sand-400" />
                        )}
                        <span>{dueDateInfo.label}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button (44px target) */}
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Hapus tugas ${todo.title}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 -mt-1 rounded-xl text-charcoal-400 hover:text-rose-600 dark:text-sand-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0"
                  title="Hapus tugas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center py-10 px-4 rounded-2xl bg-sand-50 dark:bg-charcoal-950/50 border border-dashed border-sand-200 dark:border-charcoal-800 space-y-2">
            <div className="w-10 h-10 rounded-full bg-sand-200/60 dark:bg-charcoal-800 flex items-center justify-center mx-auto text-charcoal-400 dark:text-sand-500">
              {filter === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-sage-500" />
              ) : (
                <ListTodo className="w-5 h-5" />
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-sand-200">
              {filter === "all" && "Belum ada daftar tugas"}
              {filter === "active" && "Semua tugas telah diselesaikan"}
              {filter === "completed" && "Belum ada tugas yang selesai"}
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-sand-400 max-w-xs mx-auto leading-relaxed">
              {filter === "all" &&
                "Tuliskan hal kecil yang perlu dituntaskan hari ini agar pikiran tetap tenang."}
              {filter === "active" &&
                "Luar biasa! Nikmati ketenangan dan fokus pada target kebiasaanmu."}
              {filter === "completed" &&
                "Selesaikan salah satu tugas aktif di atas untuk melihatnya di sini."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
