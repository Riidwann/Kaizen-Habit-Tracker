import { ReflectionRepositoryPort } from "../domain/ReflectionRepositoryPort";
import { NeverMissTwicePolicy } from "../domain/NeverMissTwicePolicy";
import { CompoundGrowthCalculator } from "../domain/CompoundGrowthCalculator";
import { Result } from "@/shared/domain/Result";

export interface ConsistencyStats {
  currentStreak: number;
  longestStreak: number;
  isGracePeriod: boolean;
  lastActiveDate: string;
  totalActiveDays: number;
  totalMicroWins: number;
  compoundMultiplier: number;
  percentageGain: number;
}

export class GetConsistencyStatsUseCase {
  constructor(private readonly repository: ReflectionRepositoryPort) {}

  public async execute(
    referenceDate?: Date | string
  ): Promise<Result<ConsistencyStats, Error>> {
    try {
      const datesResult = await this.repository.getActiveDates();
      if (datesResult.isErr()) {
        return Result.err(datesResult.getError()!);
      }

      const reflectionsResult = await this.repository.findAllReflections();
      if (reflectionsResult.isErr()) {
        return Result.err(reflectionsResult.getError()!);
      }

      const storedDates = datesResult.unwrap();
      const reflections = reflectionsResult.unwrap();
      const reflectionDates = reflections.map((r) => r.date);

      // Merge and deduplicate all recorded active dates
      const allActiveDates = Array.from(new Set([...storedDates, ...reflectionDates]));

      const streak = NeverMissTwicePolicy.calculate(allActiveDates, referenceDate);
      const totalActiveDays = allActiveDates.length;
      const totalMicroWins = allActiveDates.length;

      const compoundMultiplier = CompoundGrowthCalculator.calculateMultiplier(totalMicroWins);
      const percentageGain = CompoundGrowthCalculator.calculatePercentageGain(totalMicroWins);

      return Result.ok({
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        isGracePeriod: streak.isGracePeriod,
        lastActiveDate: streak.lastActiveDate,
        totalActiveDays,
        totalMicroWins,
        compoundMultiplier,
        percentageGain,
      });
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
