import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import { BackupValidator } from "../domain/BackupValidator";
import { SystemSnapshot } from "../domain/SystemSnapshot";
import { BackupRestoredEvent } from "../domain/events/BackupRestoredEvent";

export class ImportBackupUseCase {
  constructor(
    private readonly backupRepo: BackupRepositoryPort,
    private readonly validator: typeof BackupValidator = BackupValidator,
    private readonly eventBus?: IEventBus
  ) {}

  public async execute(jsonInput: string | unknown): Promise<Result<SystemSnapshot, Error>> {
    const validationResult = this.validator.validate(jsonInput);
    if (validationResult.isErr()) {
      return Result.err(validationResult.getError()!);
    }

    const snapshot = validationResult.unwrap();
    const restoreResult = await this.backupRepo.restoreSnapshot(snapshot);
    if (restoreResult.isErr()) {
      return Result.err(restoreResult.getError()!);
    }

    if (this.eventBus) {
      await this.eventBus.publish(
        new BackupRestoredEvent({
          version: snapshot.version,
          restoredAt: new Date(),
          goalCount: snapshot.data.goals.length,
          microActionCount: snapshot.data.microActions.length,
          hanseiCount: snapshot.data.hanseiEntries.length,
          source: "import",
        })
      );
    }

    return Result.ok(snapshot);
  }
}
