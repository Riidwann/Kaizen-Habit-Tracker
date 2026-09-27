import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { MicroAction } from "../domain/MicroAction";
import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export interface CreateMicroActionDTO {
  id?: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  scaleDownTitle?: string;
  estimatedMinutes: number;
  category?: string;
  isActiveToday?: boolean;
}

export class CreateMicroActionUseCase {
  constructor(
    private readonly sanctuaryRepo: SanctuaryRepositoryPort,
    private readonly eventBus?: IEventBus
  ) {}

  public async execute(dto: CreateMicroActionDTO): Promise<Result<MicroAction, string>> {
    const actionResult = MicroAction.create({
      id: dto.id,
      goalId: dto.goalId,
      milestoneId: dto.milestoneId,
      title: dto.title,
      scaleDownTitle: dto.scaleDownTitle,
      estimatedMinutes: dto.estimatedMinutes,
      category: dto.category,
      isActiveToday: dto.isActiveToday ?? true,
    });

    if (actionResult.isErr()) {
      return actionResult;
    }

    const action = actionResult.unwrap();
    const saveResult = await this.sanctuaryRepo.save(action);
    if (saveResult.isErr()) {
      return Result.err(saveResult.getError()?.message || "Failed to save micro-action");
    }

    return Result.ok(action);
  }
}
