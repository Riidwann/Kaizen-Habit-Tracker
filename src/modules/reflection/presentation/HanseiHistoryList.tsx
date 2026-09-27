import React from "react";
import { HanseiReflection } from "../domain/HanseiReflection";
import { Card } from "@/shared/presentation/Card";
import { Sparkles, SunMedium, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface HanseiHistoryListProps {
  reflections: HanseiReflection[];
  className?: string;
}

export const HanseiHistoryList: React.FC<HanseiHistoryListProps> = ({
  reflections,
  className,
}) => {
  if (reflections.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-sand-300 dark:border-charcoal-700 p-8 text-center",
          className
        )}
      >
        <BookOpen className="w-8 h-8 mx-auto text-sand-400 dark:text-charcoal-500 mb-2 opacity-60" />
        <p className="text-sm font-medium text-charcoal-600 dark:text-sand-300">
          Belum ada catatan refleksi Hansei
        </p>
        <p className="text-xs text-charcoal-400 dark:text-sand-500 mt-1 max-w-sm mx-auto">
          Mulai ritual 30 detik malam ini untuk mengabadikan 1 kemenangan kecil dan 1 penyesuaian Kaizen esok hari.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {reflections.map((reflection) => (
        <Card
          key={reflection.id}
          className="p-4 bg-white/70 dark:bg-charcoal-900/70 border-sand-200/80 dark:border-charcoal-800/80 hover:shadow-md transition-shadow"
        >
          {/* Header: Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-charcoal-400 dark:text-sand-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{reflection.date}</span>
          </div>

          <div className="space-y-2.5">
            {/* Win of the day */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-sage-100 dark:bg-sage-950/80 text-sage-600 dark:text-sage-400 mt-0.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-sage-700 dark:text-sage-300 uppercase">
                  Kemenangan Mikro
                </p>
                <p className="text-sm text-charcoal-800 dark:text-sand-100 font-medium">
                  {reflection.winOfTheDay}
                </p>
              </div>
            </div>

            {/* Tomorrow's 1% adjustment */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                <SunMedium className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-amber-700 dark:text-amber-300 uppercase">
                  Penyesuaian 1%
                </p>
                <p className="text-sm text-charcoal-700 dark:text-sand-200">
                  {reflection.tomorrowAdjustment}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
