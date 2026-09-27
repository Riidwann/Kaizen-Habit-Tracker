import React from "react";
import { cn } from "@/shared/presentation/utils";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full border-t border-sand-200/80 dark:border-charcoal-800 bg-sand-50/50 dark:bg-charcoal-950/50 py-8 px-4 sm:px-6 transition-colors mt-auto",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
        {/* Ensō brush mark accent */}
        <div className="flex items-center gap-2">
          <span className="w-8 h-px bg-sand-300 dark:bg-charcoal-700" />
          <span className="text-sage-600 dark:text-sage-400 text-sm font-semibold tracking-widest uppercase">
            改善 • Kaizen
          </span>
          <span className="w-8 h-px bg-sand-300 dark:bg-charcoal-700" />
        </div>

        {/* Kaizen Wisdom Quote */}
        <blockquote className="max-w-xl text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 italic font-serif leading-relaxed">
          &ldquo;Perjalanan seribu mil dimulai dengan satu langkah mikro yang terlalu kecil untuk memicu rasa malas.&rdquo;
        </blockquote>

        {/* Minimalist Subtitle */}
        <div className="text-[11px] text-charcoal-400 dark:text-sand-500 flex items-center gap-3">
          <span>KaizenFlow</span>
          <span>•</span>
          <span>1% Lebih Baik Setiap Hari</span>
          <span>•</span>
          <span>Penyimpanan Lokal & Privat</span>
        </div>
      </div>
    </footer>
  );
};
