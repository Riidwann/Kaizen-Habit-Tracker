import { describe, it, expect } from "vitest";
import { EmotionalAnchor } from "@/modules/goals/domain/EmotionalAnchor";
import { Milestone } from "@/modules/goals/domain/Milestone";
import { Goal } from "@/modules/goals/domain/Goal";
import { GOAL_CATEGORIES, getGoalCategoryMeta } from "@/modules/goals/domain/GoalCategory";

describe("GoalCategory", () => {
  it("should provide metadata and pastel styling for all 6 categories", () => {
    const categories = ["health", "career", "learning", "mindset", "creativity", "custom"] as const;
    
    categories.forEach((cat) => {
      const meta = getGoalCategoryMeta(cat);
      expect(meta).toBeDefined();
      expect(meta.id).toBe(cat);
      expect(meta.label).toBeTruthy();
      expect(meta.badgeVariant).toBeDefined();
    });

    expect(GOAL_CATEGORIES.health.label).toMatch(/health/i);
    expect(GOAL_CATEGORIES.mindset.label).toMatch(/mindset/i);
  });
});

describe("EmotionalAnchor (Value Object)", () => {
  it("should create successfully with non-empty whyText", () => {
    const result = EmotionalAnchor.create("To cultivate deep peace and physical longevity");
    expect(result.isOk()).toBe(true);
    const anchor = result.unwrap();
    expect(anchor.whyText).toBe("To cultivate deep peace and physical longevity");
  });

  it("should trim whyText upon creation", () => {
    const result = EmotionalAnchor.create("   Build financial freedom for my family   ");
    expect(result.isOk()).toBe(true);
    expect(result.unwrap().whyText).toBe("Build financial freedom for my family");
  });

  it("should fail when whyText is empty or whitespace only", () => {
    const emptyResult = EmotionalAnchor.create("");
    expect(emptyResult.isErr()).toBe(true);

    const spaceResult = EmotionalAnchor.create("    ");
    expect(spaceResult.isErr()).toBe(true);
  });

  it("should implement value equality based on whyText", () => {
    const anchor1 = EmotionalAnchor.create("Daily writing practice").unwrap();
    const anchor2 = EmotionalAnchor.create("Daily writing practice").unwrap();
    const anchor3 = EmotionalAnchor.create("Different reason").unwrap();

    expect(anchor1.equals(anchor2)).toBe(true);
    expect(anchor1.equals(anchor3)).toBe(false);
  });
});

describe("Milestone (Entity)", () => {
  it("should create milestone with valid properties", () => {
    const milestoneResult = Milestone.create("goal-1", "Complete chapter 1", 1);
    expect(milestoneResult.isOk()).toBe(true);
    const milestone = milestoneResult.unwrap();

    expect(milestone.id).toBeTruthy();
    expect(milestone.goalId).toBe("goal-1");
    expect(milestone.title).toBe("Complete chapter 1");
    expect(milestone.order).toBe(1);
    expect(milestone.isCompleted).toBe(false);
  });

  it("should fail creation if title is empty", () => {
    const result = Milestone.create("goal-1", "", 1);
    expect(result.isErr()).toBe(true);
  });

  it("should toggle completion status", () => {
    const milestone = Milestone.create("goal-1", "Run 5k", 1).unwrap();
    expect(milestone.isCompleted).toBe(false);

    milestone.markComplete();
    expect(milestone.isCompleted).toBe(true);

    milestone.markIncomplete();
    expect(milestone.isCompleted).toBe(false);
  });

  it("should update title and order", () => {
    const milestone = Milestone.create("goal-1", "Original Title", 1).unwrap();
    const updateRes = milestone.updateTitle("Updated Title");
    expect(updateRes.isOk()).toBe(true);
    expect(milestone.title).toBe("Updated Title");

    milestone.updateOrder(3);
    expect(milestone.order).toBe(3);

    const emptyUpdate = milestone.updateTitle("  ");
    expect(emptyUpdate.isErr()).toBe(true);
    expect(milestone.title).toBe("Updated Title");
  });
});

describe("Goal (Aggregate Root Entity)", () => {
  const sampleWhy = EmotionalAnchor.create("Live a purposeful, vibrant life").unwrap();

  it("should create goal with default active status and empty milestones", () => {
    const goalResult = Goal.create({
      title: "Master TypeScript & Architecture",
      category: "learning",
      whyStatement: sampleWhy,
      microAction: "Write 1 TypeScript type",
      scaleDownFallback: "Open IDE and read 1 definition",
    });

    expect(goalResult.isOk()).toBe(true);
    const goal = goalResult.unwrap();

    expect(goal.id).toBeTruthy();
    expect(goal.title).toBe("Master TypeScript & Architecture");
    expect(goal.category).toBe("learning");
    expect(goal.whyStatement.whyText).toBe("Live a purposeful, vibrant life");
    expect(goal.status).toBe("active");
    expect(goal.milestones).toHaveLength(0);
    expect(goal.microAction).toBe("Write 1 TypeScript type");
    expect(goal.scaleDownFallback).toBe("Open IDE and read 1 definition");
    expect(goal.getProgress()).toBe(0);
  });

  it("should reject goal creation with empty title", () => {
    const result = Goal.create({
      title: "   ",
      category: "learning",
      whyStatement: sampleWhy,
    });
    expect(result.isErr()).toBe(true);
  });

  it("should manage milestones and calculate progress correctly", () => {
    const goal = Goal.create({
      title: "Run a Marathon",
      category: "health",
      whyStatement: sampleWhy,
    }).unwrap();

    const m1 = Milestone.create(goal.id, "Run 5k", 1).unwrap();
    const m2 = Milestone.create(goal.id, "Run 10k", 2).unwrap();
    const m3 = Milestone.create(goal.id, "Run Half-Marathon", 3).unwrap();
    const m4 = Milestone.create(goal.id, "Run Marathon", 4).unwrap();

    goal.addMilestone(m1);
    goal.addMilestone(m2);
    goal.addMilestone(m3);
    goal.addMilestone(m4);

    expect(goal.milestones).toHaveLength(4);
    expect(goal.getProgress()).toBe(0);

    // Complete 1 of 4 -> 25%
    goal.toggleMilestone(m1.id);
    expect(goal.getProgress()).toBe(25);

    // Complete 2 of 4 -> 50%
    goal.toggleMilestone(m2.id);
    expect(goal.getProgress()).toBe(50);

    // Remove milestone 4 -> 2 of 3 completed -> 67%
    goal.removeMilestone(m4.id);
    expect(goal.milestones).toHaveLength(3);
    expect(goal.getProgress()).toBe(67);
  });

  it("should update status, title, and emotional anchor", () => {
    const goal = Goal.create({
      title: "Original Goal",
      category: "career",
      whyStatement: sampleWhy,
    }).unwrap();

    goal.updateStatus("paused");
    expect(goal.status).toBe("paused");

    goal.updateStatus("achieved");
    expect(goal.status).toBe("achieved");

    const updateTitleRes = goal.updateTitle("Refined Goal");
    expect(updateTitleRes.isOk()).toBe(true);
    expect(goal.title).toBe("Refined Goal");

    const newWhy = EmotionalAnchor.create("New compelling reason").unwrap();
    goal.updateWhy(newWhy);
    expect(goal.whyStatement.whyText).toBe("New compelling reason");
  });
});
