import { Result } from "@/shared/domain/Result";
import { HanseiReflection } from "./HanseiReflection";

export interface ReflectionRepositoryPort {
  saveReflection(reflection: HanseiReflection): Promise<Result<void, Error>>;
  findReflectionById(id: string): Promise<Result<HanseiReflection | null, Error>>;
  findReflectionByDate(date: string): Promise<Result<HanseiReflection | null, Error>>;
  findAllReflections(): Promise<Result<HanseiReflection[], Error>>;
  getActiveDates(): Promise<Result<string[], Error>>;
  recordActiveDate(date: string): Promise<Result<void, Error>>;
}
