import React from "react";
import { Compass, Target, TrendingUp, Database, LucideIcon } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export type TabId = "sanctuary" | "goals" | "reflection";

export interface TabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  mobileLabel: string;
  icon: LucideIcon;
  description: string;
}

export const TABS: TabItem[] = [
  {
    id: "sanctuary",
    label: "Hari Ini",
    shortLabel: "Hari Ini",
    mobileLabel: "Hari Ini",
    icon: Compass,
    description: "Kebiasaan harian 2-menit",
  },
  {
    id: "goals",
    label: "Target",
    shortLabel: "Target",
    mobileLabel: "Target",
    icon: Target,
    description: "Pohon tujuan & langkah kecil",
  },
  {
    id: "reflection",
    label: "Kemajuan",
    shortLabel: "Kemajuan",
    mobileLabel: "Kemajuan",
    icon: TrendingUp,
    description: "Grafik konsistensi & refleksi malam",
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
      className={cn(
        // Mobile: Fixed Bottom Bar
        "fixed bottom-0 left-0 right-0 z-40 bg-sand-50/95 dark:bg-charcoal-950/95 backdrop-blur-md border-t border-sand-200/90 dark:border-charcoal-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg",
        // Desktop / Tablet: Top Pill Bar
        "sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none sm:p-0 sm:max-w-4xl sm:mx-auto sm:px-4",
        className
      )}
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn(
          // Mobile layout
          "flex items-center justify-around py-1.5 px-2 max-w-lg mx-auto gap-1",
          // Desktop pill layout
          "sm:p-1.5 sm:rounded-2xl sm:bg-sand-200/60 sm:dark:bg-charcoal-900 sm:border sm:border-sand-300/60 sm:dark:border-charcoal-800 sm:gap-2 sm:shadow-inner"
        )}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
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
                "relative flex-1 select-none focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all duration-200",
                // Mobile layout
                "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] min-h-[48px]",
                // Desktop layout
                "sm:flex-row sm:py-2.5 sm:px-3 sm:text-xs md:text-sm sm:min-h-0 sm:gap-2",
                isActive
                  ? "bg-white text-charcoal-900 shadow-sm dark:bg-charcoal-800 dark:text-sand-50 font-semibold"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-sand-200/40 dark:text-sand-400 dark:hover:text-sand-200 dark:hover:bg-charcoal-800/50"
              )}
            >
              <IconComponent
                className={cn(
                  "w-4 h-4 sm:w-4 sm:h-4 shrink-0 transition-colors mb-0.5 sm:mb-0",
                  isActive
                    ? "text-sage-600 dark:text-sage-400"
                    : "text-charcoal-400 dark:text-sand-400"
                )}
                aria-hidden="true"
              />
              {/* Full label on desktop */}
              <span className="hidden md:inline truncate">{tab.label}</span>
              {/* Short label on tablet */}
              <span className="hidden sm:inline md:hidden truncate">{tab.shortLabel}</span>
              {/* Compact label on mobile */}
              <span className="inline sm:hidden font-medium text-[10px] leading-tight truncate">
                {tab.mobileLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
