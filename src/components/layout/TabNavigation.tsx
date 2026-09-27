import React from "react";
import { cn } from "@/shared/presentation/utils";

export type TabId = "sanctuary" | "goals" | "reflection" | "backup";

export interface TabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

export const TABS: TabItem[] = [
  {
    id: "sanctuary",
    label: "Sanctuary (Fokus Harian)",
    shortLabel: "Sanctuary",
    icon: "🌿",
    description: "Fokus 1-3 tindakan mikro hari ini",
  },
  {
    id: "goals",
    label: "Goal Forge (Pohon Tujuan)",
    shortLabel: "Goal Forge",
    icon: "🔨",
    description: "Dekomposisi visi makro ke aksi atomik",
  },
  {
    id: "reflection",
    label: "1% Compound (Pertumbuhan)",
    shortLabel: "1% Compound",
    icon: "📈",
    description: "Kurva pertumbuhan majemuk & Hansei",
  },
  {
    id: "backup",
    label: "Cadangan Data",
    shortLabel: "Cadangan",
    icon: "⚙️",
    description: "Ekspor, impor, dan snapshot privat",
  },
];

export interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <nav
      aria-label="Navigasi Utama"
      className={cn("w-full max-w-4xl mx-auto px-4", className)}
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center justify-between p-1.5 rounded-2xl bg-sand-200/60 dark:bg-charcoal-900 border border-sand-300/60 dark:border-charcoal-800 gap-1 sm:gap-2 shadow-inner"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 select-none focus:outline-none focus:ring-2 focus:ring-sage-500",
                isActive
                  ? "bg-white text-charcoal-900 shadow-sm dark:bg-charcoal-800 dark:text-sand-50 font-semibold"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-sand-200/40 dark:text-sand-400 dark:hover:text-sand-200 dark:hover:bg-charcoal-800/50"
              )}
            >
              <span className="text-base sm:text-lg leading-none shrink-0" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="hidden sm:inline truncate">{tab.label}</span>
              <span className="inline sm:hidden truncate">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
