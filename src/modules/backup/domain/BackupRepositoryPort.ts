import { Result } from "@/shared/domain/Result";
import { SystemSnapshot } from "./SystemSnapshot";

export interface BackupRepositoryPort {
  getSnapshot(): Promise<Result<SystemSnapshot, Error>>;
  exportSnapshot?(): Promise<Result<SystemSnapshot, Error>>;
  restoreSnapshot(snapshot: SystemSnapshot): Promise<Result<void, Error>>;
  clearAll(): Promise<Result<void, Error>>;
}
