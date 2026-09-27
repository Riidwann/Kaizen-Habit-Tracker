import { MicroAction } from "./MicroAction";
import { Result } from "@/shared/domain/Result";

export interface SanctuaryRepositoryPort {
  save(action: MicroAction): Promise<Result<void, Error>>;
  findById(id: string): Promise<Result<MicroAction | null, Error>>;
  findAll(): Promise<Result<MicroAction[], Error>>;
  findDailyFocusActions(): Promise<Result<MicroAction[], Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
