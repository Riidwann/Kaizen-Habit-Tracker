import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import { Input, Textarea } from "@/shared/presentation/Input";
import {
  GoalCategory,
  GOAL_CATEGORY_LIST,
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
  Info,
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
        setTitleError("Silakan masukkan judul visi sasaran Anda");
        return;
      }
      setTitleError("");
      setStep(2);
    } else if (step === 2) {
      if (!whyText.trim()) {
        setWhyError("Jangkar emosional sangat penting untuk menjaga konsistensi jangka panjang");
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
      title="Buat Target Baru"
      description="Pecah target besar menjadi kebiasaan mikro ≤ 2 menit yang mustahil gagal."
      className="max-w-xl"
    >
      <div className="flex flex-col gap-6">
        {/* Step Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-sand-400 font-medium mb-1.5">
            <span>
              Langkah {step} dari 4:{" "}
              {step === 1 && "Target & Kategori"}
              {step === 2 && "Motivasi Utama (Alasan Anda)"}
              {step === 3 && "Tonggak Pencapaian Pertama"}
              {step === 4 && "Kebiasaan Mikro 2-Menit"}
            </span>
            <span className="font-semibold">{step * 25}%</span>
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
              label="Nama Target"
              placeholder="Contoh: Rutin berolahraga dan menjaga kebugaran"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              error={titleError}
              helperText="Tuliskan tujuan yang ingin Anda raih secara positif dan jelas."
              autoFocus
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-medium text-charcoal-700 dark:text-sand-200">
                Pilih Kategori
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

        {/* Step 2: Motivasi Utama (Alasan Anda) */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Mengapa target ini sangat penting bagi Anda?
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                <strong>Prinsip Kaizen:</strong> Target tanpa alasan pribadi yang mendalam mudah ditinggalkan saat lelah. Sambungkan target ini ke jati diri dan masa depan yang Anda inginkan.
              </p>
            </div>

            <Textarea
              label="Motivasi Utama / Alasan Pribadi"
              placeholder="Contoh: Agar memiliki stamina prima setiap hari, bebas stres, dan tubuh terasa segar."
              value={whyText}
              onChange={(e) => {
                setWhyText(e.target.value);
                if (whyError) setWhyError("");
              }}
              error={whyError}
              rows={4}
              helperText="Saat Anda merasa malas, kalimat inilah yang akan mengingatkan komitmen Anda."
              autoFocus
            />
          </div>
        )}

        {/* Step 3: First Milestone */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-sage-50/80 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800">
              <p className="text-xs font-semibold text-sage-900 dark:text-sage-200 mb-1">
                Tonggak Pencapaian Pertama (Opsional)
              </p>
              <p className="text-xs text-sage-800/80 dark:text-sage-300/80 leading-relaxed">
                Target yang terlalu jauh membuat otak terbebani. Tentukan 1 titik capaian perantara yang mudah dicapai agar Anda segera merasakan kemenangan kecil pertama.
              </p>
            </div>

            <Input
              label="Judul Tonggak Pencapaian"
              placeholder="Contoh: Selesaikan 7 hari berturut-turut jalan santai 10 menit"
              value={firstMilestoneTitle}
              onChange={(e) => setFirstMilestoneTitle(e.target.value)}
              helperText="Tonggak awal ini opsional. Anda dapat menambah tonggak lainnya kapan saja."
              autoFocus
            />
          </div>
        )}

        {/* Step 4: Micro-Action (<= 2 min) + Emergency Scale-Down Fallback */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-charcoal-800/70 border border-sand-200 dark:border-charcoal-700">
              <p className="text-xs font-semibold text-charcoal-900 dark:text-sand-100 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sage-600" />
                Langkah Kecil ≤ 2 Menit & Versi Ringan Saat Malas
              </p>
              <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                Buat tindakan awal yang sangat kecil sehingga mustahil memicu rasa malas (Aturan 2 Menit), serta langkah darurat untuk hari-hari saat Anda lelah atau sibuk.
              </p>
            </div>

            <Input
              label="Langkah Kecil Awal (≤ 2 Menit)"
              placeholder="Contoh: Pakai sepatu olahraga dan melangkah ke luar pintu"
              value={microAction}
              onChange={(e) => setMicroAction(e.target.value)}
              helperText="Aksi pemicu ini otomatis masuk ke tab Hari Ini untuk dikerjakan setiap hari."
              autoFocus
            />

            <Input
              label="Versi Ringan Saat Lelah / Sibuk"
              placeholder="Contoh: Lakukan 5 kali peregangan badan di samping tempat tidur"
              value={scaleDownFallback}
              onChange={(e) => setScaleDownFallback(e.target.value)}
              helperText="Menjaga konsistensi streak tanpa putus dan tanpa rasa bersalah."
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
                aria-label="Back"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Kembali (Back)
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Cancel"
                onClick={onClose}
              >
                Batal
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
                aria-label="Next"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Lanjut (Next)
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit()}
                isLoading={isLoading}
                aria-label="Forge Goal"
              >
                Tempa Sasaran (Forge Goal)
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
