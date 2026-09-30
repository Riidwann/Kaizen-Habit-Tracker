import { describe, it, expect, vi } from "vitest";
import { UpdateGoalUseCase } from "@/modules/goals/application/UpdateGoalUseCase";
import { Goal } from "@/modules/goals/domain/Goal";
import { Milestone } from "@/modules/goals/domain/Milestone";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

class MockGoalRepo {
  public goals: Map<string, Goal> = new Map();
  async findById(id: string) {
    const g = this.goals.get(id);
    return { isErr: () => !g, isOk: () => !!g, unwrap: () => g, getError: () => null };
  }
  async save(goal: Goal) {
    this.goals.set(goal.id, goal);
    return { isErr: () => false, isOk: () => true, unwrap: () => goal, getError: () => null };
  }
}

describe("UpdateGoalUseCase Full Edit", () => {
  it("updates title, category, why, micro-action, and emergency fallback", async () => {
    const repo = new MockGoalRepo() as any;
    const bus = new InMemoryEventBus();
    const publishSpy = vi.spyOn(bus, "publish");
    const useCase = new UpdateGoalUseCase(repo, bus);

    const goal = Goal.create({
      title: "Initial Title",
      category: "health",
      whyStatement: "Initial Why",
      microAction: "Pushup 2 mnt",
      scaleDownFallback: "Pushup 10 dtk",
    }).unwrap();
    repo.goals.set(goal.id, goal);

    const result = await useCase.execute({
      id: goal.id,
      title: "Updated Title",
      category: "learning",
      whyText: "Updated Why Reason",
      microAction: "Baca 1 lembar",
      scaleDownFallback: "Baca 1 paragraf",
    });

    expect(result.isOk()).toBe(true);
    const updated = repo.goals.get(goal.id);
    expect(updated.title).toBe("Updated Title");
    expect(updated.category).toBe("learning");
    expect(updated.whyStatement.whyText).toBe("Updated Why Reason");
    expect(updated.microAction).toBe("Baca 1 lembar");
    expect(updated.scaleDownFallback).toBe("Baca 1 paragraf");
    expect(publishSpy).toHaveBeenCalled();
  });

  it("updates milestones when milestones array is provided", async () => {
    const repo = new MockGoalRepo() as any;
    const bus = new InMemoryEventBus();
    const useCase = new UpdateGoalUseCase(repo, bus);

    const goal = Goal.create({
      title: "Goal with Milestones",
      category: "career",
      whyStatement: "Grow skills",
    }).unwrap();
    goal.addMilestone(Milestone.create(goal.id, "Existing M1", 1).unwrap());
    repo.goals.set(goal.id, goal);

    const result = await useCase.execute({
      id: goal.id,
      milestones: ["Existing M1", "New M2"],
    });

    expect(result.isOk()).toBe(true);
    const updated = repo.goals.get(goal.id);
    expect(updated.milestones.length).toBe(2);
    expect(updated.milestones[0].title).toBe("Existing M1");
    expect(updated.milestones[1].title).toBe("New M2");
  });
});
