import { RoutineRepositoryPort } from "../domain/RoutineRepositoryPort";
import { RoutineSchedule, RoutineScheduleProps } from "../domain/RoutineSchedule";

const DEFAULT_STORAGE_KEY = "kaizen_routines";

export class LocalStorageRoutineRepository implements RoutineRepositoryPort {
  private readonly storageKey: string;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  public async getAll(): Promise<RoutineSchedule[]> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      const items: RoutineScheduleProps[] = JSON.parse(raw);
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          const res = RoutineSchedule.create(item);
          return res.isOk() ? res.unwrap() : null;
        })
        .filter((item): item is RoutineSchedule => item !== null);
    } catch {
      return [];
    }
  }

  public async findById(id: string): Promise<RoutineSchedule | null> {
    const routines = await this.getAll();
    return routines.find((r) => r.id === id) || null;
  }

  public async save(routine: RoutineSchedule): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const routines = await this.getAll();
    const existingIndex = routines.findIndex((r) => r.id === routine.id);
    if (existingIndex >= 0) {
      routines[existingIndex] = routine;
    } else {
      routines.push(routine);
    }
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(routines.map((r) => r.toJSON()))
    );
    return true;
  }

  public async delete(id: string): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const routines = await this.getAll();
    const filtered = routines.filter((r) => r.id !== id);
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filtered.map((r) => r.toJSON()))
    );
    return true;
  }
}
