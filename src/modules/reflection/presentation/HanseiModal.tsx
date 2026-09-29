import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import { Sparkles, Moon, SunMedium } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface HanseiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reflection: {
    winOfTheDay: string;
    tomorrowAdjustment: string;
  }) => Promise<void> | void;
  initialWin?: string;
  initialAdjustment?: string;
  date?: string;
  isSubmitting?: boolean;
  className?: string;
}

export const HanseiModal: React.FC<HanseiModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialWin = "",
  initialAdjustment = "",
  date,
  isSubmitting = false,
  className,
}) => {
  const [winOfTheDay, setWinOfTheDay] = useState(initialWin);
  const [tomorrowAdjustment, setTomorrowAdjustment] = useState(initialAdjustment);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWinOfTheDay(initialWin);
      setTomorrowAdjustment(initialAdjustment);
      setError(null);
    }
  }, [isOpen, initialWin, initialAdjustment]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedWin = winOfTheDay.trim();
    const trimmedAdjustment = tomorrowAdjustment.trim();

    if (!trimmedWin) {
      setError("Silakan isi 1 hal kecil yang berhasil Anda lakukan hari ini");
      return;
    }

    if (!trimmedAdjustment) {
      setError("Silakan isi 1 penyesuaian 1% untuk esok hari");
      return;
    }

    setError(null);
    await onSubmit({
      winOfTheDay: trimmedWin,
      tomorrowAdjustment: trimmedAdjustment,
    });
  };

  const isFormValid =
    winOfTheDay.trim().length > 0 && tomorrowAdjustment.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hansei: Refleksi Malam 30 Detik"
      description={
        date
          ? `Refleksi untuk ${date} • Mengakui kemajuan dan merencanakan 1% perbaikan.`
          : "Mengakui kemajuan dan merencanakan 1% perbaikan tanpa celaan diri."
      }
      className={cn(
        "bg-charcoal-900 border-charcoal-800 text-sand-50 sm:max-w-lg shadow-2xl",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Zen Encouragement Banner */}
        <div className="rounded-xl p-3.5 bg-charcoal-800/80 border border-charcoal-700/60 flex items-start gap-3">
          <Moon className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
          <p className="text-xs text-sand-300 leading-relaxed">
            <span className="font-semibold text-sand-100">Hansei (反省)</span> adalah ritual penutup hari.
            Bukan untuk menghakimi diri, melainkan untuk merayakan 1 mikro-kemenangan dan menentukan 1 penyesuaian kecil tanpa rasa bersalah.
          </p>
        </div>

        {/* Question 1: Micro-Win */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-sage-300 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-sage-400" />
            <span>1 hal kecil yang berhasil saya lakukan hari ini</span>
          </label>
          <textarea
            rows={2}
            value={winOfTheDay}
            onChange={(e) => {
              setWinOfTheDay(e.target.value);
              if (error) setError(null);
            }}
            placeholder="1 hal kecil yang berhasil saya lakukan hari ini... (contoh: berjalan 2 menit atau minum air)"
            className="w-full rounded-xl bg-charcoal-950/70 border border-charcoal-700/80 p-3 text-sm text-sand-100 placeholder:text-sand-400/80 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Question 2: Kaizen 1% Adjustment */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-300 uppercase">
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            <span>1 penyesuaian 1% untuk esok hari</span>
          </label>
          <textarea
            rows={2}
            value={tomorrowAdjustment}
            onChange={(e) => {
              setTomorrowAdjustment(e.target.value);
              if (error) setError(null);
            }}
            placeholder="1 penyesuaian 1% untuk esok hari... (contoh: siapkan sepatu di depan pintu malam ini)"
            className="w-full rounded-xl bg-charcoal-950/70 border border-charcoal-700/80 p-3 text-sm text-sand-100 placeholder:text-sand-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal-800">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="text-sand-400 hover:text-sand-100 hover:bg-charcoal-800"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isFormValid || isSubmitting}
            className="bg-sage-600 hover:bg-sage-500 text-white font-medium shadow-md shadow-sage-900/40"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Refleksi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
