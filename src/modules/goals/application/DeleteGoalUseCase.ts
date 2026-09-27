import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";
import { GoalDeletedEvent } from "../domain/events/GoalDeletedEvent";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export class DeleteGoalUseCase {
  constructor(
    private readonly goalRepo: GoalRepositoryPort,
    private readonly eventBus?: InMemoryEventBus
  ) {}

  public async execute(id: string): Promise<Result<void, string>> {
    if (!id || id.trim().length === 0) {
      return Result.err("Goal ID is required");
    }

    const deleteResult = await this.goalRepo.delete(id);
    if (deleteResult.isErr()) {
      return Result.err(
        deleteResult.getError()?.message || "Failed to delete goal"
      );
    }

    if (this.eventBus) {
      await this.eventBus.publish(new GoalDeletedEvent({ goalId: id }));
    }

    return Result.ok(undefined);
  }
}
