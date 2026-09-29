import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageSanctuaryRepository } from "@/modules/sanctuary/infrastructure/LocalStorageSanctuaryRepository";
import { LocalStorageDriver } from "@/shared/infrastructure/LocalStorageDriver";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";

describe("LocalStorageSanctuaryRepository", () => {
  let driver: LocalStorageDriver;
  let repo: LocalStorageSanctuaryRepository;

  beforeEach(() => {
    localStorage.clear();
    driver = new LocalStorageDriver("test_");
    repo = new LocalStorageSanctuaryRepository(driver, "test_sanctuary_actions");
  });

  it("should save and find micro-action by ID", async () => {
    const action = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Write 1 sentence",
      scaleDownTitle: "Open notebook",
      estimatedMinutes: 2,
      category: "mindset",
    }).unwrap();

    const saveRes = await repo.save(action);
    expect(saveRes.isOk()).toBe(true);

    const findRes = await repo.findById("act-1");
    expect(findRes.isOk()).toBe(true);
    const found = findRes.unwrap();
    expect(found).not.toBeNull();
    expect(found?.title).toBe("Write 1 sentence");
    expect(found?.estimatedMinutes).toBe(2);
    expect(found?.category).toBe("mindset");
  });

  it("should filter findDailyFocusActions for active today only", async () => {
    const active = MicroAction.create({
      id: "act-active",
      goalId: "goal-1",
      title: "Active task",
      scaleDownTitle: "Active SD",
      estimatedMinutes: 1,
      isActiveToday: true,
    }).unwrap();

    const inactive = MicroAction.create({
      id: "act-inactive",
      goalId: "goal-1",
      title: "Inactive task",
      scaleDownTitle: "Inactive SD",
      estimatedMinutes: 1,
      isActiveToday: false,
    }).unwrap();

    await repo.save(active);
    await repo.save(inactive);

    const focusRes = await repo.findDailyFocusActions();
    expect(focusRes.isOk()).toBe(true);
    const focusList = focusRes.unwrap();
    expect(focusList).toHaveLength(1);
    expect(focusList[0].id).toBe("act-active");
  });

  it("should delete micro-action by id", async () => {
    const action = MicroAction.create({
      id: "act-to-delete",
      goalId: "goal-1",
      title: "Delete me",
      scaleDownTitle: "SD",
      estimatedMinutes: 1,
    }).unwrap();

    await repo.save(action);
    expect((await repo.findById("act-to-delete")).unwrap()).not.toBeNull();

    await repo.delete("act-to-delete");
    expect((await repo.findById("act-to-delete")).unwrap()).toBeNull();
  });

  it("should reset isCompletedToday to false on midnight rollover if completed yesterday", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const action = MicroAction.create({
      id: "act-yesterday",
      goalId: "goal-1",
      title: "Daily habit",
      scaleDownTitle: "Easy habit",
      estimatedMinutes: 2,
      isActiveToday: true,
      isCompletedToday: true,
      completedAt: yesterday,
    }).unwrap();

    await repo.save(action);

    const focusRes = await repo.findDailyFocusActions();
    expect(focusRes.isOk()).toBe(true);
    const list = focusRes.unwrap();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("act-yesterday");
    // Should be automatically reset to false for the new day
    expect(list[0].isCompletedToday).toBe(false);
  });
});

