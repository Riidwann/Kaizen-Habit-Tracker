import { describe, it, expect, beforeEach } from "vitest";
import { GetConsistencyStatsUseCase } from "@/modules/reflection/application/GetConsistencyStatsUseCase";
import { GetHanseiHistoryUseCase } from "@/modules/reflection/application/GetHanseiHistoryUseCase";
import { ReflectionRepositoryPort } from "@/modules/reflection/domain/ReflectionRepositoryPort";
import { HanseiReflection } from "@/modules/reflection/domain/HanseiReflection";
import { Result } from "@/shared/domain/Result";

class MockReflectionRepo implements ReflectionRepositoryPort {
  public reflections: HanseiReflection[] = [];
  public activeDates: string[] = [];

  async saveReflection(reflection: HanseiReflection): Promise<Result<void, Error>> {
    this.reflections.push(reflection);
    return Result.ok(undefined);
  }

  async findReflectionById(id: string): Promise<Result<HanseiReflection | null, Error>> {
    return Result.ok(this.reflections.find((r) => r.id === id) || null);
  }

  async findReflectionByDate(date: string): Promise<Result<HanseiReflection | null, Error>> {
    return Result.ok(this.reflections.find((r) => r.date === date) || null);
  }

  async findAllReflections(): Promise<Result<HanseiReflection[], Error>> {
    return Result.ok([...this.reflections]);
  }

  async getActiveDates(): Promise<Result<string[], Error>> {
    return Result.ok([...this.activeDates]);
  }

  async recordActiveDate(date: string): Promise<Result<void, Error>> {
    if (!this.activeDates.includes(date)) {
      this.activeDates.push(date);
    }
    return Result.ok(undefined);
  }
}

describe("Reflection Application Use Cases", () => {
  let repo: MockReflectionRepo;

  beforeEach(() => {
    repo = new MockMockReflectionRepo();
  });

  class MockMockReflectionRepo extends MockReflectionRepo {}

  describe("GetConsistencyStatsUseCase", () => {
    it("calculates streak, grace period, multiplier and micro-wins accurately", async () => {
      repo.activeDates = ["2026-09-25", "2026-09-26", "2026-09-27"];
      repo.reflections = [
        new HanseiReflection({
          date: "2026-09-27",
          winOfTheDay: "Win",
          tomorrowAdjustment: "Adj",
        }),
      ];

      const useCase = new GetConsistencyStatsUseCase(repo);
      const res = await useCase.execute("2026-09-27");

      expect(res.isOk()).toBe(true);
      const stats = res.unwrap();

      expect(stats.currentStreak).toBe(3);
      expect(stats.longestStreak).toBe(3);
      expect(stats.isGracePeriod).toBe(false);
      expect(stats.lastActiveDate).toBe("2026-09-27");
      expect(stats.totalActiveDays).toBe(3);
      expect(stats.totalMicroWins).toBe(3);
      expect(stats.compoundMultiplier).toBeCloseTo(Math.pow(1.01, 3), 4);
      expect(stats.percentageGain).toBeCloseTo((Math.pow(1.01, 3) - 1) * 100, 2);
    });

    it("correctly identifies grace period when yesterday was missed", async () => {
      repo.activeDates = ["2026-09-25", "2026-09-26"];
      const useCase = new GetConsistencyStatsUseCase(repo);
      const res = await useCase.execute("2026-09-28"); // Sep 27 missed

      expect(res.isOk()).toBe(true);
      const stats = res.unwrap();
      expect(stats.isGracePeriod).toBe(true);
      expect(stats.currentStreak).toBe(2);
    });
  });

  describe("GetHanseiHistoryUseCase", () => {
    it("returns reflections sorted chronologically descending by default", async () => {
      repo.reflections = [
        new HanseiReflection({
          id: "r1",
          date: "2026-09-25",
          winOfTheDay: "Win 25",
          tomorrowAdjustment: "Adj 25",
        }),
        new HanseiReflection({
          id: "r3",
          date: "2026-09-28",
          winOfTheDay: "Win 28",
          tomorrowAdjustment: "Adj 28",
        }),
        new HanseiReflection({
          id: "r2",
          date: "2026-09-26",
          winOfTheDay: "Win 26",
          tomorrowAdjustment: "Adj 26",
        }),
      ];

      const useCase = new GetHanseiHistoryUseCase(repo);
      const descRes = await useCase.execute("desc");
      expect(descRes.isOk()).toBe(true);
      const descList = descRes.unwrap();
      expect(descList.map((r) => r.date)).toEqual([
        "2026-09-28",
        "2026-09-26",
        "2026-09-25",
      ]);

      const ascRes = await useCase.execute("asc");
      expect(ascRes.isOk()).toBe(true);
      const ascList = ascRes.unwrap();
      expect(ascList.map((r) => r.date)).toEqual([
        "2026-09-25",
        "2026-09-26",
        "2026-09-28",
      ]);
    });
  });
});
