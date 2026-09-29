import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoreVertical, BookOpen, Database, Sparkles, Smartphone } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface HeaderMenuProps {
  onOpenGuide?: () => void;
  onOpenBackup?: () => void;
  onLoadSample?: () => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
  className?: string;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  onOpenGuide,
  onOpenBackup,
  onLoadSample,
  onInstallPwa,
  canInstallPwa = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = useCallback((callback?: () => void) => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  }, []);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Menu Opsi"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="p-1.5 sm:p-2 rounded-xl text-charcoal-600 dark:text-sand-300 hover:bg-sand-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 shrink-0"
        title="Menu Opsi"
      >
        <MoreVertical className="w-4 h-4 text-charcoal-700 dark:text-sand-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Menu Opsi Tambahan"
          className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-white dark:bg-charcoal-900 border border-sand-200/90 dark:border-charcoal-700 shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {onOpenGuide && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(onOpenGuide)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800/80 transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
              <div>
                <span className="block font-semibold">Panduan Kaizen</span>
                <span className="text-[10px] text-charcoal-400 dark:text-sand-400">Prinsip 1% & Aturan 2-Menit</span>
              </div>
            </button>
          )}

          {onOpenBackup && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(onOpenBackup)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800/80 transition-colors text-left"
            >
              <Database className="w-4 h-4 text-charcoal-500 dark:text-sand-400 shrink-0" />
              <div>
                <span className="block font-semibold">Cadangan Data</span>
                <span className="text-[10px] text-charcoal-400 dark:text-sand-400">Ekspor, impor & snapshot</span>
              </div>
            </button>
          )}

          {onLoadSample && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(onLoadSample)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-800/80 transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="block font-semibold">Muat Contoh Data</span>
                <span className="text-[10px] text-charcoal-400 dark:text-sand-400">Data sampel percontohan</span>
              </div>
            </button>
          )}

          {canInstallPwa && onInstallPwa && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(onInstallPwa)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left border-t border-sand-100 dark:border-charcoal-800"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="block font-semibold">Pasang di Layar HP</span>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Akses cepat seperti app native</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
