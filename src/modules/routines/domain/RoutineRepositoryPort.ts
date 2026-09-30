import { RoutineSchedule } from "./RoutineSchedule";

export interface RoutineRepositoryPort {
  getAll(): Promise<RoutineSchedule[]>;
  findById(id: string): Promise<RoutineSchedule | null>;
  save(routine: RoutineSchedule): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
