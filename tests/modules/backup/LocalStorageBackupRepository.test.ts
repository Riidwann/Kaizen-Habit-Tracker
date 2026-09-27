import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageBackupRepository } from "@/modules/backup/infrastructure/LocalStorageBackupRepository";
import { LocalStorageDriver } from "@/shared/infrastructure/LocalStorageDriver";
import { SystemSnapshot } from "@/modules/backup/domain/SystemSnapshot";

describe("LocalStorageBackupRepository", () => {
  let driver: LocalStorageDriver;
  let repo: LocalStorageBackupRepository;

  const mockSnapshot: SystemSnapshot = {
    version: "1.0.0",
    appName: "KaizenFlow",
    exportedAt: "2026-09-28T00:00:00.000Z",
    data: {
      goals: [
        {
          id: "g1",
          title: "Belajar Typescript",
          whyText: "Mengembangkan skill",
          category: "learning",
        },
      ],
      microActions: [
        {
          id: "a1",
          goalId: "g1",
          title: "Baca 1 halaman",
          estimatedMinutes: 2,
        },
      ],
      hanseiEntries: [
        {
          id: "h1",
          date: "2026-09-27",
          winOfTheDay: "Selesai baca",
          tomorrowAdjustment: "Lanjut halaman berikutnya",
        },
      ],
      dailyLogs: [
        {
          id: "l1",
          date: "2026-09-27",
          completedActionIds: ["a1"],
          totalActions: 1,
          isAllCompleted: true,
        },
      ],
    },
  };

  beforeEach(() => {
    window.localStorage.clear();
    driver = new LocalStorageDriver("test_");
    repo = new LocalStorageBackupRepository(driver, {
      goalsKey: "test_goals",
      sanctuaryKey: "test_sanctuary",
      reflectionsKey: "test_reflections",
      dailyLogsKey: "test_daily_logs",
      activeDatesKey: "test_active_dates",
    });
  });

  it("exports empty snapshot when no data exists in localStorage", async () => {
    const result = await repo.getSnapshot();

    expect(result.isOk()).toBe(true);
    const snapshot = result.unwrap();
    expect(snapshot.appName).toBe("KaizenFlow");
    expect(snapshot.data.goals).toEqual([]);
    expect(snapshot.data.microActions).toEqual([]);
    expect(snapshot.data.hanseiEntries).toEqual([]);
    expect(snapshot.data.dailyLogs).toEqual([]);
  });

  it("restores snapshot into respective localStorage keys and aggregates active dates", async () => {
    const restoreResult = await repo.restoreSnapshot(mockSnapshot);
    expect(restoreResult.isOk()).toBe(true);

    const snapshotResult = await repo.getSnapshot();
    expect(snapshotResult.isOk()).toBe(true);
    const current = snapshotResult.unwrap();

    expect(current.data.goals).toHaveLength(1);
    expect(current.data.goals[0].title).toBe("Belajar Typescript");
    expect(current.data.microActions).toHaveLength(1);
    expect(current.data.hanseiEntries).toHaveLength(1);
    expect(current.data.dailyLogs).toHaveLength(1);

    const activeDates = driver.getItem<string[]>("test_active_dates", []);
    expect(activeDates).toContain("2026-09-27");
  });

  it("clears all backup-related keys upon clearAll", async () => {
    await repo.restoreSnapshot(mockSnapshot);

    const clearResult = await repo.clearAll();
    expect(clearResult.isOk()).toBe(true);

    const snapshotResult = await repo.getSnapshot();
    expect(snapshotResult.isOk()).toBe(true);
    expect(snapshotResult.unwrap().data.goals).toHaveLength(0);
    expect(snapshotResult.unwrap().data.microActions).toHaveLength(0);
  });
});
