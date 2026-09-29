import React from "react";
import { useGoalsController } from "./useGoalsController";
import { GoalForgeWizard } from "./GoalForgeWizard";
import { GoalTreeItem } from "./GoalTreeItem";
import { Button } from "@/shared/presentation/Button";
import { GOAL_CATEGORY_LIST } from "../domain/GoalCategory";
import { GoalStatus } from "../domain/Goal";
import { Plus, Target, Compass, Sparkles, Info } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface GoalManagerViewProps {
  controller?: ReturnType<typeof useGoalsController>;
}

export const GoalManagerView: React.FC<GoalManagerViewProps> = ({
  controller: externalController,
}) => {
  const internalController = useGoalsController({ enabled: !externalController });
  const controller = externalController || internalController;

  const {
    filteredGoals,
    isLoading,
    isForgeOpen,
    openForgeModal,
    closeForgeModal,
    createGoal,
    deleteGoal,
    updateGoalStatus,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
  } = controller;

  const statusFilters: Array<{ id: GoalStatus | "all"; label: string }> = [
    { id: "all", label: "Semua Status" },
    { id: "active", label: "Aktif" },
    { id: "paused", label: "Dijeda" },
    { id: "achieved", label: "Tercapai" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200/80 dark:border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
              Target & Langkah Kecil (Goals)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-sand-400">
            Dekomposisi tujuan besar menjadi langkah-langkah kecil yang mudah dijalankan tanpa rasa malas.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={openForgeModal}
          aria-label="Tambah Target Baru"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm font-semibold"
        >
          Tambah Target Baru
        </Button>
      </div>

      {/* Kaizen Goal Explanation Card */}
      <div className="p-3.5 rounded-xl bg-sand-100/70 dark:bg-charcoal-800/50 border border-sand-200/70 dark:border-charcoal-700/70 flex items-start gap-2.5 text-xs text-charcoal-600 dark:text-sand-300">
        <Info className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Bagaimana ini bekerja?</strong> Setiap target dipecah menjadi langkah-langkah kecil (kebiasaan mikro ≤ 2 menit). Kebiasaan ini otomatis muncul di tab <strong>Hari Ini</strong> untuk dikerjakan setiap hari.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-full font-medium transition-colors shrink-0",
              filterCategory === "all"
                ? "bg-charcoal-900 text-sand-50 dark:bg-sand-100 dark:text-charcoal-900"
                : "bg-sand-100 dark:bg-charcoal-800/80 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200"
            )}
          >
            Semua Kategori
          </button>
          {GOAL_CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5",
                filterCategory === cat.id
                  ? "bg-sage-600 text-white shadow-sm"
                  : "bg-sand-100 dark:bg-charcoal-800/80 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200"
              )}
            >
              <span>{cat.label.split(" & ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {statusFilters.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-lg font-medium transition-colors",
                filterStatus === st.id
                  ? "bg-sand-300/80 dark:bg-charcoal-700 text-charcoal-900 dark:text-sand-50"
                  : "text-charcoal-500 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-charcoal-800"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Tree List */}
      <div className="flex flex-col gap-4">
        {isLoading && filteredGoals.length === 0 ? (
          <div className="py-16 text-center text-charcoal-400 dark:text-sand-500 text-sm">
            Menyelaraskan sasaran Anda...
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-300 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-900/30">
            <div className="w-12 h-12 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center text-charcoal-400 dark:text-sand-400 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800 dark:text-sand-100 mb-1">
              Belum ada sasaran ditempa (No goals forged yet)
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-sand-400 max-w-sm mb-5">
              Mulai perjalanan Anda dengan menempa visi pertama. Kaizen memecah impian besar menjadi momentum harian tanpa rasa malas.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openForgeModal}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Tempa Sasaran Pertama
            </Button>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalTreeItem
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              onAddMilestone={addMilestone}
              onDeleteMilestone={deleteMilestone}
              onUpdateStatus={updateGoalStatus}
              onDeleteGoal={deleteGoal}
            />
          ))
        )}
      </div>

      {/* Goal Forge Wizard Modal */}
      <GoalForgeWizard
        isOpen={isForgeOpen}
        onClose={closeForgeModal}
        onSubmit={async (data) => {
          await createGoal(data);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};
