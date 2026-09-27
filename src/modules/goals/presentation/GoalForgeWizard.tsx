import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import { Input, Textarea } from "@/shared/presentation/Input";
import {
  GoalCategory,
  GOAL_CATEGORY_LIST,
  getGoalCategoryMeta,
} from "../domain/GoalCategory";
import {
  HeartPulse,
  Briefcase,
  BookOpen,
  Smile,
  Palette,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface GoalForgeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: GoalCategory;
    whyText: string;
    firstMilestoneTitle?: string;
    microAction?: string;
    scaleDownFallback?: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

const CATEGORY_ICONS: Record<GoalCategory, React.ComponentType<{ className?: string }>> = {
  health: HeartPulse,
  career: Briefcase,
  learning: BookOpen,
  mindset: Smile,
  creativity: Palette,
  custom: Sparkles,
};

export const GoalForgeWizard: React.FC<GoalForgeWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("health");
  const [whyText, setWhyText] = useState("");
  const [firstMilestoneTitle, setFirstMilestoneTitle] = useState("");
  const [microAction, setMicroAction] = useState("");
  const [scaleDownFallback, setScaleDownFallback] = useState("");

  const [titleError, setTitleError] = useState("");
  const [whyError, setWhyError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTitle("");
      setCategory("health");
      setWhyText("");
      setFirstMilestoneTitle("");
      setMicroAction("");
      setScaleDownFallback("");
      setTitleError("");
      setWhyError("");
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        setTitleError("Please enter a vision title");
        return;
      }
      setTitleError("");
      setStep(2);
    } else if (step === 2) {
      if (!whyText.trim()) {
        setWhyError("Your emotional anchor is vital for long-term consistency");
        return;
      }
      setWhyError("");
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onSubmit({
      title: title.trim(),
      category,
      whyText: whyText.trim(),
      firstMilestoneTitle: firstMilestoneTitle.trim() || undefined,
      microAction: microAction.trim() || undefined,
      scaleDownFallback: scaleDownFallback.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Goal Forge"
      description="Deconstruct your long-term aspiration into effortless micro-habits."
      className="max-w-xl"
    >
      <div className="flex flex-col gap-6">
        {/* Step Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-charcoal-400 dark:text-sand-400 font-medium mb-1.5">
            <span>
              Step {step} of 4:{" "}
              {step === 1 && "Vision & Realm"}
              {step === 2 && "The Emotional Anchor"}
              {step === 3 && "First Milestone"}
              {step === 4 && "Micro-Action & Fallback"}
            </span>
            <span>{step * 25}%</span>
          </div>
          <div className="w-full bg-sand-200 dark:bg-charcoal-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sage-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        {/* Step 1: Vision Title & Category */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Vision Title"
              placeholder="e.g. Become an effortless distance runner"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              error={titleError}
              autoFocus
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-medium text-charcoal-700 dark:text-sand-200">
                Choose Realm (Category)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GOAL_CATEGORY_LIST.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.id];
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                        "hover:border-sage-400 dark:hover:border-sage-600",
                        isSelected
                          ? "border-sage-600 bg-sage-50/60 dark:bg-sage-950/40 ring-2 ring-sage-500/20"
                          : "border-sand-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            isSelected
                              ? "text-sage-600 dark:text-sage-400"
                              : "text-charcoal-400 dark:text-sand-400"
                          )}
                        />
                        <span className="text-xs font-semibold text-charcoal-900 dark:text-sand-100">
                          {cat.label.split(" & ")[0]}
                        </span>
                      </div>
                      <span className="text-[11px] text-charcoal-500 dark:text-sand-400 line-clamp-1">
                        {cat.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: The Emotional Anchor (Why) */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Why is this deeply important for you?
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                Kaizen psychology: A goal without emotional resonance fades at the first hurdle. Anchor it to your core identity, values, or life purpose.
              </p>
            </div>

            <Textarea
              label="The Why (Emotional Anchor)"
              placeholder="e.g. To feel boundless energy every morning, play freely with my future children, and master self-discipline."
              value={whyText}
              onChange={(e) => {
                setWhyText(e.target.value);
                if (whyError) setWhyError("");
              }}
              error={whyError}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {/* Step 3: First Milestone */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-sage-50/80 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800">
              <p className="text-xs font-semibold text-sage-900 dark:text-sage-200 mb-1">
                First Milestone Checkpoint
              </p>
              <p className="text-xs text-sage-800/80 dark:text-sage-300/80 leading-relaxed">
                A massive vision can trigger the amygdala&apos;s fight-or-flight freeze response. Define your first reachable checkpoint to build instant momentum.
              </p>
            </div>

            <Input
              label="Milestone Title"
              placeholder="e.g. Complete 7 consecutive days of 10-minute jogging"
              value={firstMilestoneTitle}
              onChange={(e) => setFirstMilestoneTitle(e.target.value)}
              helperText="Optional starter checkpoint. You can add more milestones later."
              autoFocus
            />
          </div>
        )}

        {/* Step 4: Micro-Action (<= 2 min) + Emergency Scale-Down Fallback */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-charcoal-800/70 border border-sand-200 dark:border-charcoal-700">
              <p className="text-xs font-semibold text-charcoal-900 dark:text-sand-100 mb-1">
                Decomposition: Micro-Action & Scale-Down
              </p>
              <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                Atomic habits require entry rituals so small they cannot fail (the 2-minute rule), plus an emergency fallback for high-stress or low-willpower days.
              </p>
            </div>

            <Input
              label="Starter Micro-Action (<= 2 min)"
              placeholder="e.g. Tie running shoes and step outside the door"
              value={microAction}
              onChange={(e) => setMicroAction(e.target.value)}
              helperText="A tiny catalyst action requiring near-zero willpower."
              autoFocus
            />

            <Input
              label="Emergency Fallback (When exhausted)"
              placeholder="e.g. Do 5 calf raises beside the bed"
              value={scaleDownFallback}
              onChange={(e) => setScaleDownFallback(e.target.value)}
              helperText="Preserves identity continuity without breaking the chain."
              leftIcon={<ShieldAlert className="w-4 h-4 text-amber-500" />}
            />
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-sand-200 dark:border-charcoal-800">
          <div>
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
          </div>

          <div>
            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit()}
                isLoading={isLoading}
              >
                Forge Goal
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
