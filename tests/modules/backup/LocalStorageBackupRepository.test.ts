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
      todosKey: "test_todos",
      routinesKey: "test_routines",
      rewardsKey: "test_rewards",
      customCategoriesKey: "test_categories",
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
    expect(snapshot.data.todos).toEqual([]);
    expect(snapshot.data.routines).toEqual([]);
    expect(snapshot.data.rewards).toEqual([]);
    expect(snapshot.data.customCategories).toEqual([]);
  });

  it("restores older snapshot into respective localStorage keys safely (backward compatibility)", async () => {
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
    // Backward compatibility: missing new arrays are initialized safely
    expect(current.data.todos).toEqual([]);
    expect(current.data.routines).toEqual([]);
    expect(current.data.rewards).toEqual([]);
    expect(current.data.customCategories?.length).toBeGreaterThan(0);

    const activeDates = driver.getItem<string[]>("test_active_dates", []);
    expect(activeDates).toContain("2026-09-27");
  });

  it("exports and restores snapshots with todos, routines, rewards, and custom categories", async () => {
    const fullSnapshot: SystemSnapshot = {
      version: "1.0.0",
      appName: "KaizenFlow",
      exportedAt: "2026-09-29T12:00:00.000Z",
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
        todos: [
          {
            id: "t1",
            title: "Membaca buku 1 bab",
            isCompleted: false,
            priority: "medium",
          },
        ],
        routines: [
          {
            id: "r1",
            title: "06:30 Olahraga Ringan",
            time: "06:30",
            isCompletedToday: true,
            streakCount: 3,
          },
        ],
        rewards: [
          {
            id: "rw1",
            title: "Kopi Spesial",
            costPoints: 50,
            status: "pending",
          },
        ],
        customCategories: [
          {
            id: "finance",
            label: "Keuangan & Investasi",
            badgeVariant: "amber",
            colorClass: "text-amber-800",
            pastelBg: "bg-amber-50",
            borderColor: "border-amber-200",
            iconName: "Coins",
            description: "Financial habits",
            isCustom: true,
          },
        ],
      },
    };

    const restoreResult = await repo.restoreSnapshot(fullSnapshot);
    expect(restoreResult.isOk()).toBe(true);

    const snapshotResult = await repo.exportSnapshot!();
    expect(snapshotResult.isOk()).toBe(true);
    const restored = snapshotResult.unwrap();

    expect(restored.data.todos).toHaveLength(1);
    expect(restored.data.todos![0].title).toBe("Membaca buku 1 bab");
    expect(restored.data.routines).toHaveLength(1);
    expect(restored.data.routines![0].title).toBe("06:30 Olahraga Ringan");
    expect(restored.data.rewards).toHaveLength(1);
    expect(restored.data.rewards![0].title).toBe("Kopi Spesial");
    expect(restored.data.customCategories).toHaveLength(1);
    expect(restored.data.customCategories![0].id).toBe("finance");
  });

  it("clears all backup-related keys upon clearAll", async () => {
    await repo.restoreSnapshot(mockSnapshot);

    const clearResult = await repo.clearAll();
    expect(clearResult.isOk()).toBe(true);

    const snapshotResult = await repo.getSnapshot();
    expect(snapshotResult.isOk()).toBe(true);
    expect(snapshotResult.unwrap().data.goals).toHaveLength(0);
    expect(snapshotResult.unwrap().data.microActions).toHaveLength(0);
    expect(snapshotResult.unwrap().data.todos).toHaveLength(0);
    expect(snapshotResult.unwrap().data.routines).toHaveLength(0);
    expect(snapshotResult.unwrap().data.rewards).toHaveLength(0);
    expect(snapshotResult.unwrap().data.customCategories).toHaveLength(0);
  });
});
