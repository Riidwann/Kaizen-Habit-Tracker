import { StreakCounter } from "./StreakCounter";

export class NeverMissTwicePolicy {
  private static toDayIndex(dateStr: string): number {
    const [year, month, day] = dateStr.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / (1000 * 60 * 60 * 24));
  }

  private static formatDate(date: Date | string): string {
    if (typeof date === "string") {
      return date.split("T")[0];
    }
    return date.toISOString().split("T")[0];
  }

  public static calculate(
    activeDates: string[],
    referenceDate?: Date | string
  ): StreakCounter {
    if (!activeDates || activeDates.length === 0) {
      return StreakCounter.empty();
    }

    const refDateStr = this.formatDate(referenceDate || new Date());
    const refDayIndex = this.toDayIndex(refDateStr);

    // Sanitize, deduplicate, filter future dates, and sort ascending
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const validDates = Array.from(new Set(activeDates))
      .filter((d) => dateRegex.test(d) && this.toDayIndex(d) <= refDayIndex)
      .sort((a, b) => a.localeCompare(b));

    if (validDates.length === 0) {
      return StreakCounter.empty();
    }

    let streak = 0;
    let longestStreak = 0;
    let lastActiveDayIndex: number | null = null;

    for (let i = 0; i < validDates.length; i++) {
      const currentDayIndex = this.toDayIndex(validDates[i]);

      if (lastActiveDayIndex === null) {
        streak = 1;
      } else {
        const diff = currentDayIndex - lastActiveDayIndex;
        if (diff === 1) {
          // Consecutive day
          streak += 1;
        } else if (diff === 2) {
          // Exactly 1 missed day: Never Miss Twice forgives this gap!
          streak += 1;
        } else if (diff >= 3) {
          // 2 or more consecutive missed days: streak resets
          streak = 1;
        }
      }

      if (streak > longestStreak) {
        longestStreak = streak;
      }
      lastActiveDayIndex = currentDayIndex;
    }

    const lastActiveDate = validDates[validDates.length - 1];
    const finalActiveDayIndex = this.toDayIndex(lastActiveDate);
    const gap = refDayIndex - finalActiveDayIndex;

    let currentStreak = 0;
    let isGracePeriod = false;

    if (gap === 0) {
      // Active today: streak continues / increases
      currentStreak = streak;
      isGracePeriod = false;
    } else if (gap === 1) {
      // Active yesterday, not yet today: streak is maintained
      currentStreak = streak;
      isGracePeriod = false;
    } else if (gap === 2) {
      // 1 missed day (yesterday missed): grace period active, streak preserved!
      currentStreak = streak;
      isGracePeriod = true;
    } else {
      // 2 or more consecutive missed days: streak resets to 0
      currentStreak = 0;
      isGracePeriod = false;
    }

    return new StreakCounter({
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      isGracePeriod,
      lastActiveDate,
    });
  }
}
