import { describe, it, expect } from "vitest";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";
import { DailyFocusPolicy, MAX_DAILY_FOCUS_ACTIONS } from "@/modules/sanctuary/domain/DailyFocusPolicy";

describe("MicroAction (Domain Entity)", () => {
  it("should create a micro-action with valid properties adhering to <= 2 min invariant", () => {
    const result = MicroAction.create({
      goalId: "goal-1",
      milestoneId: "milestone-1",
      title: "Write 1 sentence in journal",
      scaleDownTitle: "Open journal notebook",
      estimatedMinutes: 2,
      category: "mindset",
    });

    expect(result.isOk()).toBe(true);
    const action = result.unwrap();

    expect(action.id).toBeTruthy();
    expect(action.goalId).toBe("goal-1");
    expect(action.milestoneId).toBe("milestone-1");
    expect(action.title).toBe("Write 1 sentence in journal");
    expect(action.scaleDownTitle).toBe("Open journal notebook");
    expect(action.estimatedMinutes).toBe(2);
    expect(action.category).toBe("mindset");
    expect(action.isScaledDown).toBe(false);
    expect(action.isActiveToday).toBe(true);
    expect(action.isCompletedToday).toBe(false);
    expect(action.completedAt).toBeUndefined();
  });

  it("should reject creation when estimatedMinutes exceeds 2 minutes", () => {
    const result = MicroAction.create({
      goalId: "goal-1",
      title: "Do 30 minute intense workout",
      scaleDownTitle: "Do 1 stretch",
      estimatedMinutes: 3,
    });

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/2 minute/i);
  });

  it("should reject creation when estimatedMinutes is less than or equal to 0", () => {
    const result = MicroAction.create({
      goalId: "goal-1",
      title: "Zero minute task",
      scaleDownTitle: "Just look at it",
      estimatedMinutes: 0,
    });

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/greater than 0|valid/i);
  });

  it("should reject creation when title is empty or whitespace", () => {
    const result = MicroAction.create({
      goalId: "goal-1",
      title: "   ",
      scaleDownTitle: "Scale down title",
      estimatedMinutes: 1,
    });

    expect(result.isErr()).toBe(true);
  });

  it("should toggle emergency scale-down without penalty", () => {
    const action = MicroAction.create({
      goalId: "goal-1",
      title: "Read 2 pages of book",
      scaleDownTitle: "Open book to page 1",
      estimatedMinutes: 2,
    }).unwrap();

    expect(action.isScaledDown).toBe(false);

    action.toggleScaleDown();
    expect(action.isScaledDown).toBe(true);

    action.toggleScaleDown();
    expect(action.isScaledDown).toBe(false);
  });

  it("should mark task as completed today and record completion timestamp", () => {
    const action = MicroAction.create({
      goalId: "goal-1",
      title: "Drink 1 glass of water",
      scaleDownTitle: "Pour water in glass",
      estimatedMinutes: 1,
    }).unwrap();

    expect(action.isCompletedToday).toBe(false);
    expect(action.completedAt).toBeUndefined();

    action.complete();
    expect(action.isCompletedToday).toBe(true);
    expect(action.completedAt).toBeInstanceOf(Date);

    action.uncomplete();
    expect(action.isCompletedToday).toBe(false);
    expect(action.completedAt).toBeUndefined();
  });

  it("should validate duration using static validateDuration", () => {
    expect(MicroAction.validateDuration(0.5)).toBe(true);
    expect(MicroAction.validateDuration(1)).toBe(true);
    expect(MicroAction.validateDuration(2)).toBe(true);
    expect(MicroAction.validateDuration(2.1)).toBe(false);
    expect(MicroAction.validateDuration(0)).toBe(false);
    expect(MicroAction.validateDuration(-1)).toBe(false);
  });
});

describe("DailyFocusPolicy (Domain Service)", () => {
  it("should enforce maximum of 3 focus actions for tunnel vision", () => {
    expect(MAX_DAILY_FOCUS_ACTIONS).toBe(3);

    const actions = [1, 2, 3, 4, 5].map((i) =>
      MicroAction.create({
        id: `act-${i}`,
        goalId: `goal-${i}`,
        title: `Micro action ${i}`,
        scaleDownTitle: `Scale down ${i}`,
        estimatedMinutes: 1,
        isActiveToday: true,
      }).unwrap()
    );

    const focusActions = DailyFocusPolicy.filterFocusActions(actions);
    expect(focusActions).toHaveLength(3);
    expect(focusActions.map((a) => a.id)).toEqual(["act-1", "act-2", "act-3"]);
  });

  it("should ignore actions that are not active today", () => {
    const act1 = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Active 1",
      scaleDownTitle: "SD 1",
      estimatedMinutes: 1,
      isActiveToday: true,
    }).unwrap();

    const act2 = MicroAction.create({
      id: "act-2",
      goalId: "goal-2",
      title: "Inactive 2",
      scaleDownTitle: "SD 2",
      estimatedMinutes: 1,
      isActiveToday: false,
    }).unwrap();

    const act3 = MicroAction.create({
      id: "act-3",
      goalId: "goal-3",
      title: "Active 3",
      scaleDownTitle: "SD 3",
      estimatedMinutes: 1,
      isActiveToday: true,
    }).unwrap();

    const focusActions = DailyFocusPolicy.filterFocusActions([act1, act2, act3]);
    expect(focusActions).toHaveLength(2);
    expect(focusActions.map((a) => a.id)).toEqual(["act-1", "act-3"]);
  });

  it("should validate focus capacity correctly", () => {
    expect(DailyFocusPolicy.canAddFocusAction(0)).toBe(true);
    expect(DailyFocusPolicy.canAddFocusAction(2)).toBe(true);
    expect(DailyFocusPolicy.canAddFocusAction(3)).toBe(false);
    expect(DailyFocusPolicy.canAddFocusAction(4)).toBe(false);
  });
});
