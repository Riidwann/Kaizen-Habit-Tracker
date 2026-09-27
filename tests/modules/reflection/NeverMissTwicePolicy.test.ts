import { describe, it, expect } from "vitest";
import { NeverMissTwicePolicy } from "@/modules/reflection/domain/NeverMissTwicePolicy";
import { StreakCounter } from "@/modules/reflection/domain/StreakCounter";

describe("NeverMissTwicePolicy", () => {
  it("returns zero streak for empty active dates", () => {
    const streak = NeverMissTwicePolicy.calculate([], "2026-09-28");
    expect(streak.currentStreak).toBe(0);
    expect(streak.longestStreak).toBe(0);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("");
  });

  it("calculates streak correctly for consecutive active days ending today", () => {
    const dates = ["2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(4);
    expect(streak.longestStreak).toBe(4);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("2026-09-28");
  });

  it("maintains streak when active yesterday but not yet active today", () => {
    const dates = ["2026-09-25", "2026-09-26", "2026-09-27"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(3);
    expect(streak.longestStreak).toBe(3);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("2026-09-27");
  });

  it("preserves streak with isGracePeriod = true when exactly 1 day is missed (yesterday)", () => {
    // 2026-09-27 was missed. Last active date was 2026-09-26. Today is 2026-09-28.
    const dates = ["2026-09-25", "2026-09-26"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(2);
    expect(streak.longestStreak).toBe(2);
    expect(streak.isGracePeriod).toBe(true);
    expect(streak.lastActiveDate).toBe("2026-09-26");
  });

  it("recovers streak and clears grace period when action is taken after a 1-day miss", () => {
    // Missed 2026-09-27, but acted on 2026-09-28
    const dates = ["2026-09-25", "2026-09-26", "2026-09-28"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(3);
    expect(streak.longestStreak).toBe(3);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("2026-09-28");
  });

  it("resets streak to 0 when 2 or more consecutive days are missed", () => {
    // Active on Sep 24 and Sep 25. Missed Sep 26 and Sep 27. Today is Sep 28 (gap = 3 days).
    const dates = ["2026-09-24", "2026-09-25"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(0);
    expect(streak.longestStreak).toBe(2);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("2026-09-25");
  });

  it("restarts streak at 1 after a reset from 2+ missed days while preserving historical longest streak", () => {
    // Had a 4-day streak, took a 10-day break, then acted today
    const dates = [
      "2026-09-01",
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-28",
    ];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(4);
    expect(streak.isGracePeriod).toBe(false);
    expect(streak.lastActiveDate).toBe("2026-09-28");
  });

  it("handles multiple forgiven 1-day gaps across history", () => {
    // Sep 1 (active), Sep 2 (missed), Sep 3 (active), Sep 4 (missed), Sep 5 (active)
    const dates = ["2026-09-01", "2026-09-03", "2026-09-05"];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-05");

    expect(streak.currentStreak).toBe(3);
    expect(streak.longestStreak).toBe(3);
    expect(streak.isGracePeriod).toBe(false);
  });

  it("handles unsorted dates and duplicates without errors", () => {
    const dates = [
      "2026-09-27",
      "2026-09-25",
      "2026-09-26",
      "2026-09-26",
      "2026-09-28",
    ];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(4);
    expect(streak.longestStreak).toBe(4);
  });

  it("ignores future dates beyond the reference date", () => {
    const dates = [
      "2026-09-26",
      "2026-09-27",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
    ];
    const streak = NeverMissTwicePolicy.calculate(dates, "2026-09-28");

    expect(streak.currentStreak).toBe(3);
    expect(streak.lastActiveDate).toBe("2026-09-28");
  });
});
