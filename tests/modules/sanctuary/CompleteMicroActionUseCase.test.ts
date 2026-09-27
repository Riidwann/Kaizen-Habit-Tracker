import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompleteMicroActionUseCase } from "@/modules/sanctuary/application/CompleteMicroActionUseCase";
import { ScaleDownMicroActionUseCase } from "@/modules/sanctuary/application/ScaleDownMicroActionUseCase";
import { CreateMicroActionUseCase } from "@/modules/sanctuary/application/CreateMicroActionUseCase";
import { GetDailyFocusActionsUseCase } from "@/modules/sanctuary/application/GetDailyFocusActionsUseCase";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";
import { SanctuaryRepositoryPort } from "@/modules/sanctuary/domain/SanctuaryRepositoryPort";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { Result } from "@/shared/domain/Result";

describe("Sanctuary Application Use Cases", () => {
  let mockRepo: SanctuaryRepositoryPort;
  let eventBus: InMemoryEventBus;
  let sampleAction: MicroAction;

  beforeEach(() => {
    sampleAction = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      milestoneId: "m-1",
      title: "Write 1 type definition",
      scaleDownTitle: "Read 1 type definition",
      estimatedMinutes: 2,
      category: "learning",
      isActiveToday: true,
      isCompletedToday: false,
    }).unwrap();

    mockRepo = {
      save: vi.fn().mockResolvedValue(Result.ok(undefined)),
      findById: vi.fn().mockImplementation(async (id: string) => {
        if (id === sampleAction.id) return Result.ok(sampleAction);
        return Result.ok(null);
      }),
      findAll: vi.fn().mockResolvedValue(Result.ok([sampleAction])),
      findDailyFocusActions: vi.fn().mockResolvedValue(Result.ok([sampleAction])),
      delete: vi.fn().mockResolvedValue(Result.ok(undefined)),
    };

    eventBus = new InMemoryEventBus();
  });

  describe("CompleteMicroActionUseCase", () => {
    it("should complete action, save to repository, and publish MicroActionCompletedEvent", async () => {
      const useCase = new CompleteMicroActionUseCase(mockRepo, eventBus);
      const publishSpy = vi.spyOn(eventBus, "publish");

      const result = await useCase.execute("act-1");

      expect(result.isOk()).toBe(true);
      const completed = result.unwrap();
      expect(completed.isCompletedToday).toBe(true);
      expect(completed.completedAt).toBeDefined();

      expect(mockRepo.save).toHaveBeenCalledWith(completed);
      expect(publishSpy).toHaveBeenCalled();
      const publishedEvent = publishSpy.mock.calls[0][0];
      expect(publishedEvent.eventName).toBe("MicroActionCompleted");
      expect(publishedEvent.payload.microActionId).toBe("act-1");
    });

    it("should return error if action is not found", async () => {
      const useCase = new CompleteMicroActionUseCase(mockRepo, eventBus);
      const result = await useCase.execute("non-existent");

      expect(result.isErr()).toBe(true);
      expect(result.getError()).toMatch(/not found/i);
    });
  });

  describe("ScaleDownMicroActionUseCase", () => {
    it("should toggle emergency scale-down and dispatch EmergencyScaleDownTriggeredEvent when scaled down", async () => {
      const useCase = new ScaleDownMicroActionUseCase(mockRepo, eventBus);
      const publishSpy = vi.spyOn(eventBus, "publish");

      expect(sampleAction.isScaledDown).toBe(false);

      const result = await useCase.execute("act-1");
      expect(result.isOk()).toBe(true);
      const scaled = result.unwrap();
      expect(scaled.isScaledDown).toBe(true);
      expect(mockRepo.save).toHaveBeenCalledWith(scaled);

      expect(publishSpy).toHaveBeenCalled();
      const event = publishSpy.mock.calls[0][0];
      expect(event.eventName).toBe("EmergencyScaleDownTriggered");
      expect(event.payload.microActionId).toBe("act-1");
      expect(event.payload.scaleDownTitle).toBe("Read 1 type definition");
    });

    it("should return error if action to scale down is not found", async () => {
      const useCase = new ScaleDownMicroActionUseCase(mockRepo, eventBus);
      const result = await useCase.execute("non-existent");

      expect(result.isErr()).toBe(true);
    });
  });

  describe("CreateMicroActionUseCase", () => {
    it("should create micro-action adhering to <= 2 min invariant and save to repository", async () => {
      const useCase = new CreateMicroActionUseCase(mockRepo, eventBus);

      const result = await useCase.execute({
        goalId: "goal-2",
        title: "Do 5 gentle stretches",
        scaleDownTitle: "Do 1 stretch",
        estimatedMinutes: 2,
        category: "health",
      });

      expect(result.isOk()).toBe(true);
      const created = result.unwrap();
      expect(created.title).toBe("Do 5 gentle stretches");
      expect(created.estimatedMinutes).toBe(2);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it("should reject creation if estimated minutes exceed 2", async () => {
      const useCase = new CreateMicroActionUseCase(mockRepo, eventBus);

      const result = await useCase.execute({
        goalId: "goal-2",
        title: "Read whole chapter",
        scaleDownTitle: "Read 1 line",
        estimatedMinutes: 5,
      });

      expect(result.isErr()).toBe(true);
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("GetDailyFocusActionsUseCase", () => {
    it("should return at most 3 daily focus actions via DailyFocusPolicy", async () => {
      const actions = [1, 2, 3, 4].map((n) =>
        MicroAction.create({
          id: `act-${n}`,
          goalId: "goal-1",
          title: `Action ${n}`,
          scaleDownTitle: `SD ${n}`,
          estimatedMinutes: 1,
          isActiveToday: true,
        }).unwrap()
      );

      mockRepo.findDailyFocusActions = vi.fn().mockResolvedValue(Result.ok(actions));

      const useCase = new GetDailyFocusActionsUseCase(mockRepo);
      const result = await useCase.execute();

      expect(result.isOk()).toBe(true);
      const focusActions = result.unwrap();
      expect(focusActions).toHaveLength(3);
    });
  });
});
