import React, { useState } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import {
  Compass,
  Target,
  Moon,
  Clock,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface KaizenGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenForge?: () => void;
  className?: string;
}

export const KaizenGuideModal: React.FC<KaizenGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenForge,
  className,
}) => {
  const [activeSection, setActiveSection] = useState<"philosophy" | "workflow" | "rules">("philosophy");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Panduan Filosofi & Cara Penggunaan Kaizen"
      description="Pelajari cara mengubah hidup tanpa rasa kewalahan melalui langkah mikro 2-menit."
      className={cn("max-w-2xl", className)}
    >
      <div className="space-y-5 pt-1">
        {/* Navigation Tabs (Responsive grid with zero horizontal scroll) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 pb-2 border-b border-sand-200 dark:border-charcoal-800">
          <button
            type="button"
            onClick={() => setActiveSection("philosophy")}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors text-center",
              activeSection === "philosophy"
                ? "bg-sage-100 text-sage-900 dark:bg-sage-950/80 dark:text-sage-300 font-bold"
                : "text-charcoal-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-charcoal-800"
            )}
          >
            <Lightbulb className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">1. Apa Itu Kaizen?</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("workflow")}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors text-center",
              activeSection === "workflow"
                ? "bg-sage-100 text-sage-900 dark:bg-sage-950/80 dark:text-sage-300 font-bold"
                : "text-charcoal-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-charcoal-800"
            )}
          >
            <Compass className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">2. Alur 3 Langkah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("rules")}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors text-center",
              activeSection === "rules"
                ? "bg-sage-100 text-sage-900 dark:bg-sage-950/80 dark:text-sage-300 font-bold"
                : "text-charcoal-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-charcoal-800"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">3. Fitur Utama & Aturan</span>
          </button>
        </div>

        {/* Section 1: Philosophy */}
        {activeSection === "philosophy" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 sm:p-4 rounded-xl bg-sage-50/70 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-sage-900 dark:text-sage-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
                Inti Filosofi: Kaizen (改善)
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-700 dark:text-sand-300 leading-relaxed">
                <strong>Kaizen</strong> berasal dari bahasa Jepang yang berarti <em>"perbaikan terus-menerus"</em>.
                Alih-alih memaksakan perubahan drastis yang sering memicu rasa malas, Kaizen berfokus pada kemajuan
                <strong> 1% lebih baik setiap hari</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-800/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900 dark:text-sand-100">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Aturan 2 Menit (Too Small to Fail)</span>
                </div>
                <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                  Tujuan besar memicu rasa takut di otak (respon amigdala). Dengan memecah sasaran menjadi aksi mikro ≤ 2 menit
                  (misal: <em>"buka buku 1 halaman"</em>), otak Anda tidak merasakan ancaman, sehingga Anda mulai tanpa beban.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-800/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900 dark:text-sand-100">
                  <TrendingUp className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
                  <span>Kekuatan Eksponensial 1%</span>
                </div>
                <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                  Jika Anda menjadi 1% lebih baik setiap hari selama 365 hari, hasilnya bukan sekadar 365%,
                  melainkan <strong>37.8 kali lipat</strong> kemajuan berkat hukum pertumbuhan majemuk (<span className="font-mono">1.01³⁶⁵ ≈ 37.78</span>).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Workflow */}
        {activeSection === "workflow" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <p className="text-xs text-charcoal-600 dark:text-sand-400">
              Aplikasi ini dirancang mengikuti siklus harian yang sederhana agar pikiran Anda tetap tenang dan fokus:
            </p>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/40 dark:bg-charcoal-800/30 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sand-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-sand-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                    Pohon Sasaran (Goal Forge): Rencanakan & Pecah Impian
                  </h4>
                  <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                    Masukkan visi besar Anda, tentukan <strong>Jangkar Batin (alasan kuat mengapa ini penting)</strong>,
                    buat tonggak perantara, dan tentukan 1 aksi mikro awal ≤ 2 menit beserta langkah cadangan saat lelah.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-sage-200 dark:border-sage-800 bg-sage-50/30 dark:bg-sage-950/20 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sage-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                    Fokus Harian (Daily Sanctuary): Eksekusi 1–3 Tindakan
                  </h4>
                  <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                    Setiap hari, buka tab Fokus Harian. Anda hanya dihadapkan pada 1–3 tindakan mikro yang harus diselesaikan
                    hari ini (mencegah beban mental dari to-do list panjang). Gunakan timer 2 menit untuk langsung mulai.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/40 dark:bg-charcoal-800/30 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sand-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-sand-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Refleksi Malam (Hansei): Evaluasi 30 Detik
                  </h4>
                  <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                    Sebelum tidur, luangkan 30 detik untuk mencatat: <em>1 hal kecil yang berhasil hari ini</em> dan
                    <em> 1 penyesuaian 1% untuk esok hari</em>. Tanpa celaan diri, hanya rasa syukur dan evaluasi damai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Rules & Special Features */}
        {activeSection === "rules" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-800/40 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
                Never Miss Twice (Jangan Bolong Dua Kali)
              </h4>
              <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                Manusia tidak sempurna. Jika Anda melewatkan satu hari, streak Anda <strong>tidak langsung direset ke nol</strong>.
                Sistem memberikan status <strong>"Hari Pemulihan"</strong>. Anda hanya perlu menyelesaikan 1 tindakan mikro hari ini
                untuk memulihkan momentum. Streak baru hangus jika bolong dua hari berturut-turut.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-800/40 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                Tombol "Terlalu Berat?" (Mode Darurat)
              </h4>
              <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                Di kartu tindakan harian terdapat tombol <em>"Terlalu Berat?"</em>. Saat Anda lelah, sakit, atau sangat sibuk,
                tekan tombol ini untuk mengubah tindakan ke versi minimal (misal: dari 10 menit membaca jadi 1 paragraf).
                Ini menjaga identitas konsistensi Anda tanpa rasa bersalah.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sand-200 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-800/40 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-charcoal-600 dark:text-sand-300 shrink-0" />
                Data 100% Tersimpan di Perangkat Anda
              </h4>
              <p className="text-xs text-charcoal-600 dark:text-sand-400 leading-relaxed">
                Seluruh target, aksi, dan catatan refleksi Anda tersimpan aman dan privat di LocalStorage peramban Anda.
                Gunakan tab <strong>Cadangan Data</strong> untuk mengunduh salinan berkas JSON kapan saja.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-sand-200 dark:border-charcoal-800">
          <p className="text-[11px] text-charcoal-500 dark:text-sand-400 italic text-center sm:text-left">
            "Satu langkah kecil hari ini adalah awal dari seribu mil perjalanan damai."
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenForge && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenForge();
                }}
                className="flex-1 sm:flex-initial text-xs"
              >
                Tempa Sasaran Pertama
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="flex-1 sm:flex-initial text-xs font-semibold"
            >
              Saya Mengerti
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
