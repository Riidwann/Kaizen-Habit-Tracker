import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { MicroAction } from "../domain/MicroAction";
import { MicroActionCompletedEvent } from "../domain/events/MicroActionCompletedEvent";
import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export class CompleteMicroActionUseCase {
  constructor(
    private readonly sanctuaryRepo: SanctuaryRepositoryPort,
    private readonly eventBus?: IEventBus
  ) {}

  public async execute(actionId: string): Promise<Result<MicroAction, string>> {
    const actionResult = await this.sanctuaryRepo.findById(actionId);
    if (actionResult.isErr()) {
      return Result.err(actionResult.getError()?.message || "Failed to find micro-action");
    }

    const action = actionResult.unwrap();
    if (!action) {
      return Result.err(`Micro-action with id "${actionId}" not found`);
    }

    action.complete();

    const saveResult = await this.sanctuaryRepo.save(action);
    if (saveResult.isErr()) {
      return Result.err(saveResult.getError()?.message || "Failed to save micro-action");
    }

    if (this.eventBus) {
      await this.eventBus.publish(
        new MicroActionCompletedEvent({
          microActionId: action.id,
          goalId: action.goalId,
          milestoneId: action.milestoneId,
          title: action.title,
          isScaledDown: action.isScaledDown,
          completedAt: action.completedAt || new Date(),
        })
      );
    }

    return Result.ok(action);
  }
}
