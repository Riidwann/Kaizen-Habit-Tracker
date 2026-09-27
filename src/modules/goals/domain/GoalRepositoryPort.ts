import { Goal } from "./Goal";
import { Result } from "@/shared/domain/Result";

export interface GoalRepositoryPort {
  save(goal: Goal): Promise<Result<void, Error>>;
  findById(id: string): Promise<Result<Goal | null, Error>>;
  findAll(): Promise<Result<Goal[], Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
