import React, { useMemo } from "react";
import { HanseiReflection } from "../domain/HanseiReflection";
import { CompoundGrowthCalculator } from "../domain/CompoundGrowthCalculator";
import { StreakBadge } from "./StreakBadge";
import { HanseiHistoryList } from "./HanseiHistoryList";
import { Card } from "@/shared/presentation/Card";
import { Button } from "@/shared/presentation/Button";
import { TrendingUp, ShieldAlert, Sparkles, Moon, Award, Activity, Info } from "lucide-react";
import { cn } from "@/shared/presentation/utils";

export interface CompoundVisualizerViewProps {
  currentStreak?: number;
  longestStreak?: number;
  isGracePeriod?: boolean;
  totalMicroWins?: number;
  compoundMultiplier?: number;
  percentageGain?: number;
  reflections?: HanseiReflection[];
  onOpenHanseiModal?: () => void;
  className?: string;
}

export const CompoundVisualizerView: React.FC<CompoundVisualizerViewProps> = ({
  currentStreak = 0,
  longestStreak = 0,
  isGracePeriod = false,
  totalMicroWins = 0,
  compoundMultiplier = 1.0,
  percentageGain = 0,
  reflections = [],
  onOpenHanseiModal,
  className,
}) => {
  // SVG Chart settings
  const chartSteps = useMemo(
    () => Math.max(30, Math.ceil((totalMicroWins + 10) / 10) * 10),
    [totalMicroWins]
  );

  const curveData = useMemo(
    () => CompoundGrowthCalculator.generateCurve(chartSteps, Math.max(1, Math.floor(chartSteps / 30))),
    [chartSteps]
  );

  const svgDimensions = { width: 500, height: 200, padX: 45, padY: 25 };
  const innerW = svgDimensions.width - svgDimensions.padX * 2;
  const innerH = svgDimensions.height - svgDimensions.padY * 2;

  const maxVal = useMemo(() => {
    const lastGrowth = curveData[curveData.length - 1]?.growth || 1.4;
    return Math.max(1.5, lastGrowth * 1.05);
  }, [curveData]);

  const minVal = 0.5;

  const getSvgCoordinates = (step: number, val: number) => {
    const x = svgDimensions.padX + (step / chartSteps) * innerW;
    const clampedVal = Math.min(Math.max(val, minVal), maxVal);
    const y =
      svgDimensions.padY +
      innerH -
      ((clampedVal - minVal) / (maxVal - minVal)) * innerH;
    return { x, y };
  };

  const growthPathD = useMemo(() => {
    return curveData.reduce((acc, pt, idx) => {
      const { x, y } = getSvgCoordinates(pt.step, pt.growth);
      return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, "");
  }, [curveData, maxVal, chartSteps]);

  const declinePathD = useMemo(() => {
    return curveData.reduce((acc, pt, idx) => {
      const { x, y } = getSvgCoordinates(pt.step, pt.decline);
      return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, "");
  }, [curveData, maxVal, chartSteps]);

  const baselineCoord = getSvgCoordinates(0, 1.0);

  // Current user point coordinates
  const currentStep = Math.min(totalMicroWins, chartSteps);
  const currentCoord = getSvgCoordinates(currentStep, compoundMultiplier);

  return (
    <div className={cn("space-y-6 max-w-4xl mx-auto p-3 sm:p-6", className)}>
      {/* Top Header & Streak Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
              1% Compound Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-sand-400">
            Perubahan 1% setiap hari berlipat ganda menjadi hasil 37x lipat dalam setahun.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
          <StreakBadge currentStreak={currentStreak} isGracePeriod={isGracePeriod} />
          {onOpenHanseiModal && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenHanseiModal}
              className="gap-1.5 bg-charcoal-900 text-sand-50 hover:bg-charcoal-800 dark:bg-sand-100 dark:text-charcoal-900 dark:hover:bg-sand-200 text-xs py-1.5 px-3 rounded-xl"
            >
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>Refleksi Hansei</span>
            </Button>
          )}
        </div>
      </div>

      {/* Kaizen Compound Explanation Callout */}
      <div className="p-3.5 rounded-xl bg-sand-100/70 dark:bg-charcoal-800/50 border border-sand-200/70 dark:border-charcoal-700/70 flex items-start gap-2.5 text-xs text-charcoal-600 dark:text-sand-300">
        <Info className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Bagaimana grafik ini bekerja?</strong> Setiap aksi mikro yang Anda selesaikan dihitung sebagai 1 Micro-Win yang melipatgandakan faktor kemajuan Anda.
        </p>
      </div>

      {/* Grace Period Warning Banner */}
      {isGracePeriod && (
        <div className="rounded-xl p-3.5 sm:p-4 bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-amber-700 dark:text-amber-300">
              Mode Pemulihan Aktif (Never Miss Twice)
            </p>
            <p className="text-amber-800/80 dark:text-amber-200/80 mt-0.5 leading-relaxed">
              Kemarin kamu melewatkan rutinitasmu, tetapi streak tetap terlindungi hari ini! Ambil 1 aksi 2 menit hari ini untuk memulihkan momentummu.
            </p>
          </div>
        </div>
      )}

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800">
          <div className="flex items-center gap-1.5 text-sage-600 dark:text-sage-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Multiplier</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-sand-50">
            {compoundMultiplier.toFixed(2)}x
          </div>
          <p className="text-[10px] sm:text-[11px] text-charcoal-400 dark:text-sand-400 mt-0.5 truncate">
            +{percentageGain.toFixed(1)}% total
          </p>
        </Card>

        <Card className="p-3 sm:p-4 bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800">
          <div className="flex items-center gap-1.5 text-charcoal-600 dark:text-sand-300 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Micro-Wins</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-sand-50">
            {totalMicroWins}
          </div>
          <p className="text-[10px] sm:text-[11px] text-charcoal-400 dark:text-sand-400 mt-0.5 truncate">
            {totalMicroWins} Aksi Selesai
          </p>
        </Card>

        <Card className="p-3 sm:p-4 bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-sand-50">
            {currentStreak} Hari
          </div>
          <p className="text-[10px] sm:text-[11px] text-charcoal-400 dark:text-sand-400 mt-0.5 truncate">
            {isGracePeriod ? "Status: Dilindungi" : "Konsistensi aktif"}
          </p>
        </Card>

        <Card className="p-3 sm:p-4 bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800">
          <div className="flex items-center gap-1.5 text-charcoal-500 dark:text-sand-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Rekor</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-sand-50">
            {longestStreak} Hari
          </div>
          <p className="text-[10px] sm:text-[11px] text-charcoal-400 dark:text-sand-400 mt-0.5 truncate">
            Rekor terpanjang
          </p>
        </Card>
      </div>

      {/* Visual Chart Card */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-charcoal-900 border-sand-200/80 dark:border-charcoal-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-charcoal-900 dark:text-sand-100">
              Kurva Pertumbuhan Majemuk 1% (Atomic Habits)
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-sand-400">
              Perbandingan pertumbuhan 1.01ᴺ vs kemunduran 0.99ᴺ
            </p>
          </div>

          {/* Legend: visible on all screen sizes */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-sage-600 dark:text-sage-400 font-medium">
              <span className="w-2.5 h-0.5 bg-sage-500 inline-block rounded" />
              <span>+1%</span>
            </div>
            <div className="flex items-center gap-1 text-charcoal-400 dark:text-sand-400">
              <span className="w-2.5 h-0.5 bg-charcoal-300 dark:bg-charcoal-600 inline-block rounded border-dashed" />
              <span>1.0x</span>
            </div>
            <div className="flex items-center gap-1 text-rose-500 font-medium">
              <span className="w-2.5 h-0.5 bg-rose-400 inline-block rounded" />
              <span>-1%</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-hidden">
          <svg
            data-testid="compound-curve-svg"
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
            className="w-full h-40 sm:h-52 select-none overflow-visible"
          >
            {/* Grid & Axes */}
            <line
              x1={svgDimensions.padX}
              y1={baselineCoord.y}
              x2={svgDimensions.width - svgDimensions.padX}
              y2={baselineCoord.y}
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-sand-300 dark:text-charcoal-700"
              strokeWidth="1.2"
            />

            {/* Decline Curve (-1%) */}
            <path
              d={declinePathD}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-70"
            />

            {/* Growth Curve (+1%) */}
            <path
              d={growthPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Current Position Marker */}
            {totalMicroWins > 0 && (
              <g>
                <circle
                  cx={currentCoord.x}
                  cy={currentCoord.y}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <text
                  x={currentCoord.x}
                  y={currentCoord.y - 10}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-charcoal-800 dark:fill-sand-100"
                >
                  Kamu: {compoundMultiplier.toFixed(2)}x
                </text>
              </g>
            )}

            {/* Labels */}
            <text
              x={svgDimensions.padX}
              y={baselineCoord.y + 12}
              className="text-[10px] fill-charcoal-400 dark:fill-sand-500"
            >
              1.0x
            </text>
            <text
              x={svgDimensions.width - svgDimensions.padX}
              y={svgDimensions.padY + 12}
              textAnchor="end"
              className="text-[10px] fill-sage-600 dark:fill-sage-400 font-semibold"
            >
              37.78x (1 Thn)
            </text>
            <text
              x={svgDimensions.width - svgDimensions.padX}
              y={svgDimensions.height - svgDimensions.padY}
              textAnchor="end"
              className="text-[10px] fill-rose-500 font-semibold"
            >
              0.03x
            </text>
          </svg>
        </div>
      </Card>

      {/* Hansei Reflections History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-charcoal-600 dark:text-sand-300" />
            <h3 className="text-sm sm:text-base font-semibold text-charcoal-900 dark:text-sand-100">
              Riwayat Refleksi Hansei
            </h3>
          </div>
          <span className="text-xs text-charcoal-400 dark:text-sand-400">
            {reflections.length} catatan tersimpan
          </span>
        </div>

        <HanseiHistoryList reflections={reflections} />
      </div>
    </div>
  );
};
