import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageGoalRepository } from "@/modules/goals/infrastructure/LocalStorageGoalRepository";
import { LocalStorageDriver } from "@/shared/infrastructure/LocalStorageDriver";
import { Goal } from "@/modules/goals/domain/Goal";
import { EmotionalAnchor } from "@/modules/goals/domain/EmotionalAnchor";
import { Milestone } from "@/modules/goals/domain/Milestone";

describe("LocalStorageGoalRepository", () => {
  let driver: LocalStorageDriver;
  let repo: LocalStorageGoalRepository;

  beforeEach(() => {
    driver = new LocalStorageDriver("test_");
    driver.clear();
    repo = new LocalStorageGoalRepository(driver, "test_goals");
  });

  it("should save and retrieve a goal with milestones", async () => {
    const why = EmotionalAnchor.create("Achieve mastery").unwrap();
    const goal = Goal.create({
      title: "Write Clean Code",
      category: "career",
      whyStatement: why,
      microAction: "Refactor 1 function",
      scaleDownFallback: "Review 1 git commit",
    }).unwrap();

    const m1 = Milestone.create(goal.id, "Read Refactoring book", 1).unwrap();
    goal.addMilestone(m1);

    const saveResult = await repo.save(goal);
    expect(saveResult.isOk()).toBe(true);

    const findResult = await repo.findById(goal.id);
    expect(findResult.isOk()).toBe(true);
    const retrieved = findResult.unwrap();

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(goal.id);
    expect(retrieved?.title).toBe("Write Clean Code");
    expect(retrieved?.category).toBe("career");
    expect(retrieved?.whyStatement.whyText).toBe("Achieve mastery");
    expect(retrieved?.milestones).toHaveLength(1);
    expect(retrieved?.milestones[0].title).toBe("Read Refactoring book");
    expect(retrieved?.microAction).toBe("Refactor 1 function");
    expect(retrieved?.scaleDownFallback).toBe("Review 1 git commit");
  });

  it("should list all saved goals", async () => {
    const why = EmotionalAnchor.create("Daily stillness").unwrap();
    const g1 = Goal.create({ title: "Zen Habit 1", category: "mindset", whyStatement: why }).unwrap();
    const g2 = Goal.create({ title: "Zen Habit 2", category: "health", whyStatement: why }).unwrap();

    await repo.save(g1);
    await repo.save(g2);

    const allResult = await repo.findAll();
    expect(allResult.isOk()).toBe(true);
    expect(allResult.unwrap()).toHaveLength(2);
  });

  it("should delete a goal by id", async () => {
    const why = EmotionalAnchor.create("Daily stillness").unwrap();
    const g1 = Goal.create({ title: "To Delete", category: "mindset", whyStatement: why }).unwrap();

    await repo.save(g1);
    expect((await repo.findAll()).unwrap()).toHaveLength(1);

    const deleteRes = await repo.delete(g1.id);
    expect(deleteRes.isOk()).toBe(true);
    expect((await repo.findAll()).unwrap()).toHaveLength(0);
  });
});
