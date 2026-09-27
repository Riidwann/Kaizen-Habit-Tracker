import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateGoalUseCase, CreateGoalDTO } from "@/modules/goals/application/CreateGoalUseCase";
import { GoalRepositoryPort } from "@/modules/goals/domain/GoalRepositoryPort";
import { Goal } from "@/modules/goals/domain/Goal";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { GoalCreatedEvent } from "@/modules/goals/domain/events/GoalCreatedEvent";

class MockGoalRepository implements GoalRepositoryPort {
  public goals: Map<string, Goal> = new Map();

  async save(goal: Goal): Promise<Result<void, Error>> {
    this.goals.set(goal.id, goal);
    return Result.ok(undefined);
  }

  async findById(id: string): Promise<Result<Goal | null, Error>> {
    const goal = this.goals.get(id) || null;
    return Result.ok(goal);
  }

  async findAll(): Promise<Result<Goal[], Error>> {
    return Result.ok(Array.from(this.goals.values()));
  }

  async delete(id: string): Promise<Result<void, Error>> {
    this.goals.delete(id);
    return Result.ok(undefined);
  }
}

describe("CreateGoalUseCase", () => {
  let repository: MockGoalRepository;
  let eventBus: InMemoryEventBus;
  let useCase: CreateGoalUseCase;

  beforeEach(() => {
    repository = new MockGoalRepository();
    eventBus = new InMemoryEventBus();
    useCase = new CreateGoalUseCase(repository, eventBus);
  });

  it("should create and persist a goal with valid inputs", async () => {
    const dto: CreateGoalDTO = {
      title: "Run 10km Marathon",
      category: "health",
      whyText: "Build endurance and stay disciplined",
      microAction: "Put on running shoes",
      scaleDownFallback: "Do 10 jumping jacks in room",
    };

    const result = await useCase.execute(dto);

    expect(result.isOk()).toBe(true);
    const createdGoal = result.unwrap();

    expect(createdGoal.id).toBeTruthy();
    expect(createdGoal.title).toBe("Run 10km Marathon");
    expect(createdGoal.category).toBe("health");
    expect(createdGoal.whyStatement.whyText).toBe("Build endurance and stay disciplined");
    expect(createdGoal.microAction).toBe("Put on running shoes");
    expect(createdGoal.scaleDownFallback).toBe("Do 10 jumping jacks in room");
    expect(createdGoal.status).toBe("active");

    // Check persistence
    const saved = await repository.findById(createdGoal.id);
    expect(saved.isOk()).toBe(true);
    expect(saved.unwrap()?.title).toBe("Run 10km Marathon");
  });

  it("should create first milestone when firstMilestoneTitle is provided", async () => {
    const dto: CreateGoalDTO = {
      title: "Write a Science Fiction Novel",
      category: "creativity",
      whyText: "Express imagination and finish a creative manuscript",
      firstMilestoneTitle: "Draft chapter 1 outline",
    };

    const result = await useCase.execute(dto);

    expect(result.isOk()).toBe(true);
    const goal = result.unwrap();
    expect(goal.milestones).toHaveLength(1);
    expect(goal.milestones[0].title).toBe("Draft chapter 1 outline");
    expect(goal.milestones[0].order).toBe(1);
    expect(goal.milestones[0].isCompleted).toBe(false);
  });

  it("should fail validation if title is empty or whitespace", async () => {
    const dto: CreateGoalDTO = {
      title: "   ",
      category: "learning",
      whyText: "Gain deep skills",
    };

    const result = await useCase.execute(dto);

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/title/i);
    expect(repository.goals.size).toBe(0);
  });

  it("should fail validation if whyText is empty or whitespace", async () => {
    const dto: CreateGoalDTO = {
      title: "Read 20 books",
      category: "learning",
      whyText: "   ",
    };

    const result = await useCase.execute(dto);

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/emotional anchor|why/i);
    expect(repository.goals.size).toBe(0);
  });

  it("should publish GoalCreatedEvent when goal is created", async () => {
    const eventHandler = vi.fn();
    eventBus.subscribe("GoalCreated", eventHandler);

    const dto: CreateGoalDTO = {
      title: "Daily Meditation",
      category: "mindset",
      whyText: "Find calm and inner stillness",
    };

    const result = await useCase.execute(dto);
    expect(result.isOk()).toBe(true);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    const emittedEvent = eventHandler.mock.calls[0][0] as GoalCreatedEvent;
    expect(emittedEvent.eventName).toBe("GoalCreated");
    expect(emittedEvent.payload.title).toBe("Daily Meditation");
    expect(emittedEvent.payload.category).toBe("mindset");
  });
});
