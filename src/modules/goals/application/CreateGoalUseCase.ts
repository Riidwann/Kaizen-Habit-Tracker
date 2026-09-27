import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";
import { Goal } from "../domain/Goal";
import { EmotionalAnchor } from "../domain/EmotionalAnchor";
import { Milestone } from "../domain/Milestone";
import { GoalCategory } from "../domain/GoalCategory";
import { GoalCreatedEvent } from "../domain/events/GoalCreatedEvent";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export interface CreateGoalDTO {
  title: string;
  category: GoalCategory;
  whyText: string;
  firstMilestoneTitle?: string;
  microAction?: string;
  scaleDownFallback?: string;
}

export class CreateGoalUseCase {
  constructor(
    private readonly goalRepo: GoalRepositoryPort,
    private readonly eventBus?: InMemoryEventBus
  ) {}

  public async execute(dto: CreateGoalDTO): Promise<Result<Goal, string>> {
    // 1. Validate emotional anchor
    const whyResult = EmotionalAnchor.create(dto.whyText);
    if (whyResult.isErr()) {
      return Result.err(whyResult.getError() || "Invalid emotional anchor");
    }
    const whyStatement = whyResult.unwrap();

    // 2. Create Goal
    const goalResult = Goal.create({
      title: dto.title,
      category: dto.category,
      whyStatement,
      microAction: dto.microAction,
      scaleDownFallback: dto.scaleDownFallback,
    });
    if (goalResult.isErr()) {
      return Result.err(goalResult.getError() || "Failed to create goal");
    }
    const goal = goalResult.unwrap();

    // 3. Add first milestone if supplied
    if (dto.firstMilestoneTitle && dto.firstMilestoneTitle.trim().length > 0) {
      const milestoneResult = Milestone.create(
        goal.id,
        dto.firstMilestoneTitle.trim(),
        1
      );
      if (milestoneResult.isOk()) {
        goal.addMilestone(milestoneResult.unwrap());
      }
    }

    // 4. Save to repository
    const saveResult = await this.goalRepo.save(goal);
    if (saveResult.isErr()) {
      return Result.err(saveResult.getError()?.message || "Failed to save goal");
    }

    // 5. Emit event
    if (this.eventBus) {
      await this.eventBus.publish(
        new GoalCreatedEvent({
          goalId: goal.id,
          title: goal.title,
          category: goal.category,
          whyText: whyStatement.whyText,
        })
      );
    }

    return Result.ok(goal);
  }
}
