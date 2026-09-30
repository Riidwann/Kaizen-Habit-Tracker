"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Gift, Pencil, Check, X, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { SelfReward } from "../domain/SelfReward";

export interface SelfRewardBannerProps {
  reward: SelfReward | null;
  isEarned: boolean;
  onClaim: (nextTitle?: string) => Promise<boolean | void>;
  onUpdateTitle: (newTitle: string) => Promise<boolean | void>;
  className?: string;
}

export const SelfRewardBanner: React.FC<SelfRewardBannerProps> = ({
  reward,
  isEarned,
  onClaim,
  onUpdateTitle,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedNotice, setClaimedNotice] = useState(false);

  if (!isEarned || !reward) {
    return null;
  }

  const handleStartEditing = () => {
    setEditedTitle(reward.title);
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    if (editedTitle.trim().length > 0) {
      await onUpdateTitle(editedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    // Fire Japandi celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#3B82F6", "#F3F4F6"],
      });
    } catch {
      // Fallback if canvas-confetti is not supported in environment
    }

    setClaimedNotice(true);
    await onClaim();
    setIsClaiming(false);

    setTimeout(() => {
      setClaimedNotice(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-label="Pengumuman Pencapaian Hadiah Diri"
        className={`w-full relative overflow-hidden rounded-2xl border border-amber-300/80 dark:border-amber-600/40 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-950/40 p-4 sm:p-5 shadow-sm backdrop-blur-sm ${className}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Icon & Celebration Message */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 dark:bg-amber-400/20 border border-amber-400/40 dark:border-amber-500/40 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300 shadow-xs">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-3 h-3" />
                  Tonggak {reward.targetStreak} Hari
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-charcoal-900 dark:text-sand-100 flex items-center gap-1.5">
                  🎉 Luar Biasa! Konsistensi {reward.targetStreak} Hari Tercapai!
                </h3>
              </div>

              {/* Reward description or inline edit input */}
              {isEditing ? (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") handleCancelEditing();
                    }}
                    placeholder="Contoh: Traktir kopi favorit atau santai sore"
                    className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-charcoal-900 border border-amber-400 dark:border-amber-600 text-charcoal-900 dark:text-sand-100 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[240px]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveTitle}
                    aria-label="Simpan perubahan nama hadiah"
                    className="p-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    aria-label="Batal mengedit"
                    className="p-1.5 rounded-lg bg-sand-200 dark:bg-charcoal-800 text-charcoal-700 dark:text-sand-300 hover:bg-sand-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group flex-wrap">
                  <p className="text-sm text-charcoal-700 dark:text-sand-300 font-sans">
                    <span className="font-medium text-amber-800 dark:text-amber-300">
                      Hadiah Anda:
                    </span>{" "}
                    &ldquo;{reward.title}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    aria-label="Ubah rencana apresiasi diri"
                    className="p-1 rounded-md text-charcoal-500 hover:text-charcoal-800 dark:text-sand-400 dark:hover:text-sand-100 transition-colors"
                    title="Ubah apresiasi diri"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Claim Action Button */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 shrink-0 pt-2 md:pt-0">
            {claimedNotice ? (
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700">
                <PartyPopper className="w-4 h-4" />
                Hadiah telah dinikmati! Menyiapkan target berikutnya...
              </span>
            ) : (
              <button
                type="button"
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all min-h-[44px]"
              >
                <Gift className="w-4 h-4" />
                {isClaiming ? "Mengklaim..." : "Klaim & Nikmati Hadiah"}
              </button>
            )}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};
