import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import { Input, Textarea } from "@/shared/presentation/Input";
import {
  GoalCategory,
  GoalCategoryMeta,
  GOAL_CATEGORY_LIST,
} from "../domain/GoalCategory";
import { Goal } from "../domain/Goal";
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
  Plus,
  Trash2,
  Tag,
  X,
  Check,
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
    milestones?: string[];
  }) => Promise<void> | void;
  isLoading?: boolean;
  categories?: GoalCategoryMeta[];
  onAddCategory?: (category: GoalCategoryMeta) => Promise<boolean> | boolean;
  onDeleteCategory?: (id: string) => Promise<boolean> | boolean;
  initialGoal?: Goal | null;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  health: HeartPulse,
  career: Briefcase,
  learning: BookOpen,
  mindset: Smile,
  creativity: Palette,
  custom: Sparkles,
};

const COLOR_OPTIONS: Array<{
  badgeVariant: "sage" | "amber" | "charcoal" | "default";
  label: string;
  colorClass: string;
  pastelBg: string;
  borderColor: string;
  previewBg: string;
}> = [
  {
    badgeVariant: "sage",
    label: "Sage",
    colorClass: "text-sage-800 dark:text-sage-300",
    pastelBg: "bg-sage-50 dark:bg-sage-950/40",
    borderColor: "border-sage-200 dark:border-sage-800",
    previewBg: "bg-sage-500",
  },
  {
    badgeVariant: "amber",
    label: "Amber",
    colorClass: "text-amber-800 dark:text-amber-300",
    pastelBg: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800",
    previewBg: "bg-amber-500",
  },
  {
    badgeVariant: "charcoal",
    label: "Charcoal",
    colorClass: "text-charcoal-800 dark:text-sand-200",
    pastelBg: "bg-sand-100 dark:bg-charcoal-800/60",
    borderColor: "border-sand-300 dark:border-charcoal-700",
    previewBg: "bg-charcoal-700",
  },
  {
    badgeVariant: "default",
    label: "Sand",
    colorClass: "text-charcoal-700 dark:text-sand-300",
    pastelBg: "bg-sand-50 dark:bg-charcoal-900/60",
    borderColor: "border-sand-200 dark:border-charcoal-700",
    previewBg: "bg-sand-400",
  },
];

interface StepProgressBarProps {
  step: 1 | 2 | 3 | 4;
  isInitialGoal: boolean;
}

const StepProgressBar = React.memo<StepProgressBarProps>(({ step, isInitialGoal }) => {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-sand-400 font-medium mb-1.5">
        <span>
          Langkah {step} dari 4:{" "}
          {step === 1 && "Target & Kategori"}
          {step === 2 && "Motivasi Utama (Alasan Anda)"}
          {step === 3 && (isInitialGoal ? "Tonggak Pencapaian" : "Tonggak Pencapaian Pertama")}
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
  );
});
StepProgressBar.displayName = "StepProgressBar";

interface CategoryCardProps {
  cat: GoalCategoryMeta;
  isSelected: boolean;
  onSelect: (id: GoalCategory) => void;
  onDelete?: (id: string) => void | boolean | Promise<void | boolean>;
}

const CategoryCard = React.memo<CategoryCardProps>(({ cat, isSelected, onSelect, onDelete }) => {
  const Icon = CATEGORY_ICONS[cat.id] || Tag;

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onSelect(cat.id)}
        className={cn(
          "w-full flex flex-col justify-between p-3 rounded-xl border text-left transition-all min-h-[76px]",
          "hover:border-sage-400 dark:hover:border-sage-600",
          isSelected
            ? "border-sage-600 bg-sage-50/60 dark:bg-sage-950/40 ring-2 ring-sage-500/20"
            : "border-sand-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0 pr-6">
          <Icon
            className={cn(
              "w-4 h-4 shrink-0",
              isSelected
                ? "text-sage-600 dark:text-sage-400"
                : "text-charcoal-400 dark:text-sand-400"
            )}
          />
          <span className="text-xs font-semibold text-charcoal-900 dark:text-sand-100 truncate">
            {cat.label.split(" & ")[0]}
          </span>
        </div>
        <span className="text-[11px] text-charcoal-500 dark:text-sand-400 line-clamp-1">
          {cat.description}
        </span>
      </button>

      {cat.isCustom && onDelete && (
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            await onDelete(cat.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus:outline-none focus:ring-1 focus:ring-rose-500 z-10"
          title="Hapus Kategori"
          aria-label={`Hapus kategori ${cat.label}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});
CategoryCard.displayName = "CategoryCard";

interface CategoryGridProps {
  categoryList: GoalCategoryMeta[];
  selectedCategory: GoalCategory;
  onSelectCategory: (id: GoalCategory) => void;
  onDeleteCategory?: (id: string) => void | boolean | Promise<void | boolean>;
}

const CategoryGrid = React.memo<CategoryGridProps>(({
  categoryList,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {categoryList.map((cat) => (
        <CategoryCard
          key={cat.id}
          cat={cat}
          isSelected={selectedCategory === cat.id}
          onSelect={onSelectCategory}
          onDelete={onDeleteCategory}
        />
      ))}
    </div>
  );
});
CategoryGrid.displayName = "CategoryGrid";

export const GoalForgeWizard: React.FC<GoalForgeWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  categories,
  onAddCategory,
  onDeleteCategory,
  initialGoal,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("health");
  const [whyText, setWhyText] = useState("");
  const [firstMilestoneTitle, setFirstMilestoneTitle] = useState("");
  const [milestonesList, setMilestonesList] = useState<string[]>([]);
  const [microAction, setMicroAction] = useState("");
  const [scaleDownFallback, setScaleDownFallback] = useState("");

  const [titleError, setTitleError] = useState("");
  const [whyError, setWhyError] = useState("");

  // Custom Category inline creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [categoryError, setCategoryError] = useState("");

  const categoryList = categories && categories.length > 0 ? categories : GOAL_CATEGORY_LIST;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (initialGoal) {
        setTitle(initialGoal.title);
        setCategory(initialGoal.category);
        setWhyText(initialGoal.whyStatement?.whyText || "");
        const ms = initialGoal.milestones.map((m) => m.title);
        setMilestonesList(ms);
        setFirstMilestoneTitle("");
        setMicroAction(initialGoal.microAction || "");
        setScaleDownFallback(initialGoal.scaleDownFallback || "");
      } else {
        setTitle("");
        setCategory("health");
        setWhyText("");
        setMilestonesList([]);
        setFirstMilestoneTitle("");
        setMicroAction("");
        setScaleDownFallback("");
      }
      setTitleError("");
      setWhyError("");
      setIsAddingCategory(false);
      setNewCategoryName("");
      setSelectedColorIdx(0);
      setCategoryError("");
    }
  }, [isOpen, initialGoal]);

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

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("Nama kategori tidak boleh kosong");
      return;
    }

    const rawId = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = rawId || `custom-${Date.now()}`;

    if (categoryList.some((c) => c.id === id)) {
      setCategoryError("Kategori dengan nama serupa sudah ada");
      return;
    }

    const color = COLOR_OPTIONS[selectedColorIdx];
    const newCatMeta: GoalCategoryMeta = {
      id,
      label: newCategoryName.trim(),
      badgeVariant: color.badgeVariant,
      colorClass: color.colorClass,
      pastelBg: color.pastelBg,
      borderColor: color.borderColor,
      iconName: "Tag",
      description: newCategoryName.trim(),
      isCustom: true,
    };

    if (onAddCategory) {
      await onAddCategory(newCatMeta);
    }

    setCategory(id);
    setIsAddingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  };

  const handleSelectCategory = useCallback((id: GoalCategory) => {
    setCategory(id);
  }, []);

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      if (onDeleteCategory) {
        await onDeleteCategory(id);
        setCategory((prev) => (prev === id ? "health" : prev));
      }
    },
    [onDeleteCategory]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalMilestones =
      initialGoal || milestonesList.length > 0
        ? milestonesList.filter((m) => m.trim().length > 0)
        : undefined;

    await onSubmit({
      title: title.trim(),
      category,
      whyText: whyText.trim(),
      firstMilestoneTitle: firstMilestoneTitle.trim() || undefined,
      microAction: microAction.trim() || undefined,
      scaleDownFallback: scaleDownFallback.trim() || undefined,
      ...(finalMilestones !== undefined ? { milestones: finalMilestones } : {}),
    });
  };

  // Preserve last valid initialGoal during exit transition
  const lastGoalRef = useRef(initialGoal);
  if (initialGoal) {
    lastGoalRef.current = initialGoal;
  }
  const currentGoal = initialGoal || lastGoalRef.current;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentGoal ? `Edit Target: ${currentGoal.title}` : "Buat Target Baru"}
      description={
        currentGoal
          ? "Perbarui visi, motivasi, tonggak pencapaian, dan kebiasaan mikro Anda."
          : "Pecah target besar menjadi kebiasaan mikro ≤ 2 menit yang mustahil gagal."
      }
      className="max-w-xl"
    >
      <div className="flex flex-col gap-6">
        {/* Step Progress Bar */}
        <StepProgressBar step={step} isInitialGoal={Boolean(initialGoal)} />

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

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-medium text-charcoal-700 dark:text-sand-200">
                  Pilih Kategori
                </label>
                {!isAddingCategory && onAddCategory && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sage-700 dark:text-sage-300 hover:text-sage-800 dark:hover:text-sage-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Kategori Baru</span>
                  </button>
                )}
              </div>

              {/* Inline Form to Add Category */}
              {isAddingCategory && (
                <div className="p-3.5 rounded-xl border border-sand-300 dark:border-charcoal-700 bg-sand-50/90 dark:bg-charcoal-800/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-800 dark:text-sand-100">
                      Tambah Kategori Kustom
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setCategoryError("");
                      }}
                      className="p-1 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-sand-200 rounded-md"
                      aria-label="Tutup form kategori baru"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <Input
                    label="Nama Kategori"
                    placeholder="Contoh: Keuangan, Hobi, Relasi..."
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      if (categoryError) setCategoryError("");
                    }}
                    error={categoryError}
                    autoFocus
                  />

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-charcoal-700 dark:text-sand-300">
                      Warna Label:
                    </span>
                    <div className="flex items-center gap-2">
                      {COLOR_OPTIONS.map((col, idx) => (
                        <button
                          key={col.label}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                            col.previewBg,
                            selectedColorIdx === idx
                              ? "ring-2 ring-offset-2 ring-charcoal-800 dark:ring-sand-200 dark:ring-offset-charcoal-900 scale-110"
                              : "opacity-75 hover:opacity-100"
                          )}
                          title={col.label}
                          aria-label={`Pilih warna ${col.label}`}
                        >
                          {selectedColorIdx === idx && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-sand-200/80 dark:border-charcoal-700">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setCategoryError("");
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleSaveCategory}
                    >
                      Simpan Kategori
                    </Button>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <CategoryGrid
                categoryList={categoryList}
                selectedCategory={category}
                onSelectCategory={handleSelectCategory}
                onDeleteCategory={onDeleteCategory ? handleDeleteCategory : undefined}
              />
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

        {/* Step 3: Milestones */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-sage-50/80 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800">
              <p className="text-xs font-semibold text-sage-900 dark:text-sage-200 mb-1">
                {initialGoal ? "Kelola Tonggak Pencapaian (Milestones)" : "Tonggak Pencapaian Pertama (Opsional)"}
              </p>
              <p className="text-xs text-sage-800/80 dark:text-sage-300/80 leading-relaxed">
                {initialGoal
                  ? "Pecah sasaran ini menjadi beberapa tonggak capaian bertahap agar progres dapat terukur dengan jelas."
                  : "Target yang terlalu jauh membuat otak terbebani. Tentukan 1 titik capaian perantara yang mudah dicapai agar Anda segera merasakan kemenangan kecil pertama."}
              </p>
            </div>

            {initialGoal || milestonesList.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-medium text-charcoal-700 dark:text-sand-300">
                  Daftar Tonggak Capaian ({milestonesList.length}):
                </label>
                {milestonesList.length === 0 ? (
                  <p className="text-xs text-charcoal-400 italic">Belum ada tonggak pencapaian.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {milestonesList.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-charcoal-400 dark:text-sand-500 w-6">M{idx + 1}</span>
                        <input
                          type="text"
                          value={m}
                          onChange={(e) => {
                            const updated = [...milestonesList];
                            updated[idx] = e.target.value;
                            setMilestonesList(updated);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sand-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-sand-100 focus:outline-none focus:border-sage-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMilestonesList(milestonesList.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-md transition-colors"
                          aria-label={`Hapus tonggak M${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tambah tonggak capaian baru..."
                    value={firstMilestoneTitle}
                    onChange={(e) => setFirstMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (firstMilestoneTitle.trim()) {
                          setMilestonesList([...milestonesList, firstMilestoneTitle.trim()]);
                          setFirstMilestoneTitle("");
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sand-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-sand-100 focus:outline-none focus:border-sage-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (firstMilestoneTitle.trim()) {
                        setMilestonesList([...milestonesList, firstMilestoneTitle.trim()]);
                        setFirstMilestoneTitle("");
                      }
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              </div>
            ) : (
              <Input
                label="Judul Tonggak Pencapaian"
                placeholder="Contoh: Selesaikan 7 hari berturut-turut jalan santai 10 menit"
                value={firstMilestoneTitle}
                onChange={(e) => setFirstMilestoneTitle(e.target.value)}
                helperText="Tonggak awal ini opsional. Anda dapat menambah tonggak lainnya kapan saja."
                autoFocus
              />
            )}
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
                aria-label={initialGoal ? "Simpan Perubahan" : "Simpan Target"}
              >
                {initialGoal ? "Simpan Perubahan" : "Simpan Target"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
