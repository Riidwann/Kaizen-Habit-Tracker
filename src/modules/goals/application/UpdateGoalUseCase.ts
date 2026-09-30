import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";
import { Goal, GoalStatus } from "../domain/Goal";
import { GoalCategory } from "../domain/GoalCategory";
import { EmotionalAnchor } from "../domain/EmotionalAnchor";
import { Milestone } from "../domain/Milestone";
import { GoalUpdatedEvent } from "../domain/events/GoalUpdatedEvent";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export interface UpdateGoalDTO {
  id: string;
  title?: string;
  category?: GoalCategory;
  whyText?: string;
  status?: GoalStatus;
  microAction?: string;
  scaleDownFallback?: string;
  milestones?: string[];
}

export class UpdateGoalUseCase {
  constructor(
    private readonly goalRepo: GoalRepositoryPort,
    private readonly eventBus?: InMemoryEventBus
  ) {}

  public async execute(dto: UpdateGoalDTO): Promise<Result<Goal, string>> {
    const findResult = await this.goalRepo.findById(dto.id);
    if (findResult.isErr()) {
      return Result.err(findResult.getError()?.message || "Failed to find goal");
    }

    const goal = findResult.unwrap();
    if (!goal) {
      return Result.err(`Goal with id ${dto.id} not found`);
    }

    if (dto.title !== undefined) {
      const updateTitleRes = goal.updateTitle(dto.title);
      if (updateTitleRes.isErr()) {
        return Result.err(updateTitleRes.getError() || "Invalid title");
      }
    }

    if (dto.category !== undefined) {
      goal.updateCategory(dto.category);
    }

    if (dto.whyText !== undefined) {
      const whyRes = EmotionalAnchor.create(dto.whyText);
      if (whyRes.isErr()) {
        return Result.err(whyRes.getError() || "Invalid emotional anchor");
      }
      goal.updateWhy(whyRes.unwrap());
    }

    if (dto.status !== undefined) {
      goal.updateStatus(dto.status);
    }

    if (dto.microAction !== undefined || dto.scaleDownFallback !== undefined) {
      goal.updateMicroAction(
        dto.microAction !== undefined ? dto.microAction : goal.microAction,
        dto.scaleDownFallback !== undefined
          ? dto.scaleDownFallback
          : goal.scaleDownFallback
      );
    }

    if (dto.milestones !== undefined) {
      const newMilestones: Milestone[] = [];
      dto.milestones.forEach((mTitle, idx) => {
        const trimmed = mTitle.trim();
        if (!trimmed) return;
        const existing = goal.milestones.find((m) => m.title === trimmed);
        if (existing) {
          existing.updateOrder(idx + 1);
          newMilestones.push(existing);
        } else {
          const created = Milestone.create(goal.id, trimmed, idx + 1);
          if (created.isOk()) {
            newMilestones.push(created.unwrap());
          }
        }
      });
      goal.replaceMilestones(newMilestones);
    }

    const saveResult = await this.goalRepo.save(goal);
    if (saveResult.isErr()) {
      return Result.err(
        saveResult.getError()?.message || "Failed to save updated goal"
      );
    }

    if (this.eventBus) {
      await this.eventBus.publish(
        new GoalUpdatedEvent({
          goalId: goal.id,
          title: goal.title,
          status: goal.status,
          category: goal.category,
          microAction: goal.microAction,
          scaleDownFallback: goal.scaleDownFallback,
        })
      );
    }

    return Result.ok(goal);
  }
}
