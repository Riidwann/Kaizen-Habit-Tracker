import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import { BackupExportedEvent } from "../domain/events/BackupExportedEvent";

export class ExportBackupUseCase {
  constructor(
    private readonly backupRepo: BackupRepositoryPort,
    private readonly eventBus?: IEventBus
  ) {}

  public async execute(): Promise<Result<string, Error>> {
    const snapshotResult = await this.backupRepo.getSnapshot();
    if (snapshotResult.isErr()) {
      return Result.err(snapshotResult.getError()!);
    }

    const snapshot = snapshotResult.unwrap();
    const jsonString = JSON.stringify(snapshot, null, 2);

    if (this.eventBus) {
      await this.eventBus.publish(
        new BackupExportedEvent({
          version: snapshot.version,
          exportedAt: new Date(snapshot.exportedAt),
          goalCount: snapshot.data.goals.length,
          microActionCount: snapshot.data.microActions.length,
          hanseiCount: snapshot.data.hanseiEntries.length,
        })
      );
    }

    return Result.ok(jsonString);
  }
}
