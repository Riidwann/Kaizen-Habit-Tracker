import React, { useState } from "react";
import { Goal, GoalStatus } from "../domain/Goal";
import { getGoalCategoryMeta } from "../domain/GoalCategory";
import { Badge, BadgeVariant } from "@/shared/presentation/Badge";
import { Button } from "@/shared/presentation/Button";
import { Card } from "@/shared/presentation/Card";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Trash2,
  Pause,
  Play,
  Trophy,
  Zap,
  ShieldAlert,
  Plus,
  Quote,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Modal } from "@/shared/presentation/Modal";
import { cn } from "@/shared/presentation/utils";

export interface GoalTreeItemProps {
  goal: Goal;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
  onDeleteMilestone?: (goalId: string, milestoneId: string) => void;
  onUpdateStatus: (goalId: string, status: GoalStatus) => void;
  onDeleteGoal: (goalId: string) => void;
  defaultExpanded?: boolean;
}

const statusBadgeVariants: Record<GoalStatus, BadgeVariant> = {
  active: "sage",
  paused: "amber",
  achieved: "charcoal",
};

const statusLabels: Record<GoalStatus, string> = {
  active: "AKTIF",
  paused: "DIJEDA",
  achieved: "TERCAPAI",
};

export const GoalTreeItem: React.FC<GoalTreeItemProps> = ({
  goal,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onUpdateStatus,
  onDeleteGoal,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const categoryMeta = getGoalCategoryMeta(goal.category);
  const progress = goal.getProgress();
  const milestones = goal.milestones;

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    onAddMilestone(goal.id, newMilestoneTitle.trim());
    setNewMilestoneTitle("");
    setIsAddingMilestone(false);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 border-sand-200/90 dark:border-charcoal-800",
        goal.status === "paused" && "opacity-80 bg-sand-50/50 dark:bg-charcoal-900/40",
        goal.status === "achieved" &&
          "border-amber-300 dark:border-amber-700/80 bg-gradient-to-br from-amber-50/20 via-white to-sage-50/20 dark:from-amber-950/20 dark:via-charcoal-900 dark:to-charcoal-900 shadow-md"
      )}
      padding="md"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-0.5 p-1 rounded-lg hover:bg-sand-100 dark:hover:bg-charcoal-800 text-charcoal-500 dark:text-sand-400 transition-colors"
            aria-label={isExpanded ? "Tutup rincian sasaran" : "Buka rincian sasaran"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-charcoal-900 dark:text-sand-50">
                {goal.title}
              </h3>
              <Badge variant={categoryMeta.badgeVariant} size="sm">
                {categoryMeta.label.split(" & ")[0]}
              </Badge>
              {goal.status === "achieved" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-200 border border-amber-400 dark:border-amber-600 shadow-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>🏆 TERCAPAI</span>
                </span>
              ) : (
                <Badge variant={statusBadgeVariants[goal.status]} size="sm">
                  {statusLabels[goal.status]}
                </Badge>
              )}
            </div>

            {/* Emotional Anchor Quote */}
            <div className="flex items-center gap-1.5 text-xs text-charcoal-600 dark:text-sand-300 italic mt-0.5">
              <Quote className="w-3 h-3 text-amber-500 shrink-0 not-italic" />
              <span>&ldquo;{goal.whyStatement.whyText}&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Progress gauge */}
          <div className="flex items-center gap-2 text-xs font-medium text-charcoal-600 dark:text-sand-300">
            <div className="w-20 bg-sand-200 dark:bg-charcoal-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sage-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-8 text-right font-semibold">{progress}%</span>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1">
            {goal.status === "active" ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-charcoal-500 hover:text-amber-600"
                onClick={() => onUpdateStatus(goal.id, "paused")}
                title="Jeda Sasaran"
                aria-label="Pause Goal"
              >
                <Pause className="w-3.5 h-3.5" />
              </Button>
            ) : goal.status === "paused" ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-charcoal-500 hover:text-sage-600"
                onClick={() => onUpdateStatus(goal.id, "active")}
                title="Lanjutkan Sasaran"
                aria-label="Resume Goal"
              >
                <Play className="w-3.5 h-3.5" />
              </Button>
            ) : null}

            {goal.status !== "achieved" ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-charcoal-500 hover:text-amber-600 dark:hover:text-amber-400"
                onClick={() => setIsConfirmModalOpen(true)}
                title="Tandai Tercapai"
                aria-label="Mark Achieved"
              >
                <Trophy className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-amber-600 dark:text-amber-400 hover:text-sage-600"
                onClick={() => onUpdateStatus(goal.id, "active")}
                title="Kembalikan ke Status Aktif"
                aria-label="Kembalikan ke Status Aktif"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 h-auto text-charcoal-400 hover:text-red-600"
              onClick={() => onDeleteGoal(goal.id)}
              title="Hapus Sasaran"
              aria-label="Delete Goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Achieved Celebration Banner with Revert Option */}
      {goal.status === "achieved" && (
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-sage-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-charcoal-900 dark:to-sage-950/40 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl shrink-0">🏆</span>
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Target Telah Berhasil Tercapai!
              </p>
              <p className="text-amber-800/80 dark:text-amber-300/80 text-[11px] leading-relaxed">
                Langkah-langkah kecil Anda telah membuahkan hasil nyata. Anda dapat mengaktifkannya kembali jika ada hal yang terlewat atau ingin dilanjutkan.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(goal.id, "active")}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            className="w-full sm:w-auto shrink-0 text-xs border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-950/50 justify-center font-medium"
            title="Kembalikan target ke status aktif jika ada hal yang terlewat"
          >
            Buka Kembali Target
          </Button>
        </div>
      )}

      {/* Expandable Tree View */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-sand-200/70 dark:border-charcoal-800 flex flex-col gap-3">
          {/* Micro-Action & Emergency Fallback Pills */}
          {(goal.microAction || goal.scaleDownFallback) && (
            <div className="flex flex-wrap items-center gap-2 pl-6">
              {goal.microAction && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sand-100 dark:bg-charcoal-800 text-xs text-charcoal-700 dark:text-sand-200 border border-sand-200 dark:border-charcoal-700">
                  <Zap className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                  <span className="font-semibold text-[11px] text-charcoal-500 dark:text-sand-400">Aksi Mikro:</span>
                  <span>{goal.microAction}</span>
                </div>
              )}
              {goal.scaleDownFallback && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px] text-amber-700 dark:text-amber-400">Langkah Darurat:</span>
                  <span>{goal.scaleDownFallback}</span>
                </div>
              )}
            </div>
          )}

          {/* Milestones Hierarchy Tree */}
          <div className="relative pl-6 ml-3 border-l-2 border-dashed border-sand-300 dark:border-charcoal-700 flex flex-col gap-2">
            {milestones.length === 0 ? (
              <p className="text-xs text-charcoal-400 dark:text-sand-500 py-1">
                Belum ada tonggak pencapaian. Pecah sasaran ini menjadi tonggak-tonggak bertahap.
              </p>
            ) : (
              milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between group py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Line connector dot */}
                    <button
                      type="button"
                      onClick={() => onToggleMilestone(goal.id, m.id)}
                      className="text-charcoal-400 hover:text-sage-600 transition-colors"
                      aria-label={`Toggle completion for ${m.title}`}
                    >
                      {m.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <span className="text-xs font-mono text-charcoal-400 dark:text-sand-500">
                      M{idx + 1}
                    </span>

                    <span
                      className={cn(
                        "text-xs font-medium transition-colors",
                        m.isCompleted
                          ? "line-through text-charcoal-400 dark:text-sand-500"
                          : "text-charcoal-800 dark:text-sand-100"
                      )}
                    >
                      {m.title}
                    </span>
                  </div>

                  {onDeleteMilestone && (
                    <button
                      type="button"
                      onClick={() => onDeleteMilestone(goal.id, m.id)}
                      className="p-1 text-charcoal-400 dark:text-sand-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                      aria-label={`Delete milestone ${m.title}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}

            {/* Add Milestone Inline */}
            {isAddingMilestone ? (
              <form onSubmit={handleCreateMilestone} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Judul tonggak pencapaian baru..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-sand-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 focus:outline-none focus:border-sage-500 w-full max-w-sm"
                  autoFocus
                />
                <Button type="submit" variant="primary" size="sm" className="px-2.5 py-1 text-xs">
                  Tambah
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1 text-xs"
                  onClick={() => setIsAddingMilestone(false)}
                >
                  Batal
                </Button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingMilestone(true)}
                className="inline-flex items-center gap-1.5 text-xs text-sage-700 dark:text-sage-400 hover:underline pt-1 w-fit"
              >
                <Plus className="w-3 h-3" />
                Tambah Tonggak Pencapaian
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Marking Goal as Achieved */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Tandai Target Tercapai?"
        description="Rayakan setiap langkah kecil yang telah Anda selesaikan."
        className="max-w-md text-center"
      >
        <div className="flex flex-col items-center justify-center pt-2 pb-4 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-sand-50">
              Tandai "{goal.title}" sebagai Tercapai?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 leading-relaxed max-w-sm mx-auto">
              Selamat atas dedikasi dan konsistensi Anda! Anda tetap dapat mengembalikannya ke status aktif kapan saja jika nanti ada hal yang ingin dilanjutkan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 w-full">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsConfirmModalOpen(false)}
              className="w-full sm:flex-1 justify-center order-2 sm:order-1"
            >
              Belum, Nanti Dulu
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                setIsConfirmModalOpen(false);
                try {
                  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
                    const isJsdom = navigator.userAgent && navigator.userAgent.includes("jsdom");
                    if (!isJsdom) {
                      confetti({
                        particleCount: 60,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#F59E0B", "#10B981", "#6EE7B7", "#FDE68A", "#D97706"],
                      });
                    }
                  }
                } catch {
                  // Fallback for non-canvas environments
                }
                onUpdateStatus(goal.id, "achieved");
              }}
              className="w-full sm:flex-1 justify-center bg-gradient-to-r from-amber-600 to-sage-600 hover:from-amber-700 hover:to-sage-700 text-white font-semibold shadow-md gap-1.5 order-1 sm:order-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Ya, Target Tercapai!</span>
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
