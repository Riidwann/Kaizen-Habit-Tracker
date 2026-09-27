import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { MicroAction } from "../domain/MicroAction";
import { DailyFocusPolicy } from "../domain/DailyFocusPolicy";
import { Result } from "@/shared/domain/Result";

export class GetDailyFocusActionsUseCase {
  constructor(private readonly sanctuaryRepo: SanctuaryRepositoryPort) {}

  public async execute(): Promise<Result<MicroAction[], Error>> {
    const actionsResult = await this.sanctuaryRepo.findDailyFocusActions();
    if (actionsResult.isErr()) {
      return actionsResult;
    }

    const allActions = actionsResult.unwrap();
    const focusActions = DailyFocusPolicy.filterFocusActions(allActions);
    return Result.ok(focusActions);
  }
}
