import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { MicroAction } from "../domain/MicroAction";
import { EmergencyScaleDownTriggeredEvent } from "../domain/events/EmergencyScaleDownTriggeredEvent";
import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export class ScaleDownMicroActionUseCase {
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

    action.toggleScaleDown();

    const saveResult = await this.sanctuaryRepo.save(action);
    if (saveResult.isErr()) {
      return Result.err(saveResult.getError()?.message || "Failed to save micro-action");
    }

    if (action.isScaledDown && this.eventBus) {
      await this.eventBus.publish(
        new EmergencyScaleDownTriggeredEvent({
          microActionId: action.id,
          goalId: action.goalId,
          title: action.title,
          scaleDownTitle: action.scaleDownTitle,
          isScaledDown: true,
          triggeredAt: new Date(),
        })
      );
    }

    return Result.ok(action);
  }
}
