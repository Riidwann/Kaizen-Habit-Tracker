import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { MicroAction } from "../domain/MicroAction";
import { Result } from "@/shared/domain/Result";
import {
  LocalStorageDriver,
  localStorageDriver as defaultStorageDriver,
} from "@/shared/infrastructure/LocalStorageDriver";

interface MicroActionSerialized {
  id: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  scaleDownTitle: string;
  estimatedMinutes: number;
  isScaledDown: boolean;
  isActiveToday: boolean;
  isCompletedToday: boolean;
  completedAt?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageSanctuaryRepository implements SanctuaryRepositoryPort {
  private readonly storageKey: string;
  private readonly driver: LocalStorageDriver;

  constructor(
    driver: LocalStorageDriver = defaultStorageDriver,
    storageKey: string = "kaizen_sanctuary_actions"
  ) {
    this.driver = driver;
    this.storageKey = storageKey;
  }

  private mapToSerialized(action: MicroAction): MicroActionSerialized {
    return {
      id: action.id,
      goalId: action.goalId,
      milestoneId: action.milestoneId,
      title: action.title,
      scaleDownTitle: action.scaleDownTitle,
      estimatedMinutes: action.estimatedMinutes,
      isScaledDown: action.isScaledDown,
      isActiveToday: action.isActiveToday,
      isCompletedToday: action.isCompletedToday,
      completedAt: action.completedAt ? action.completedAt.toISOString() : undefined,
      category: action.category,
      createdAt: action.createdAt.toISOString(),
      updatedAt: action.updatedAt.toISOString(),
    };
  }

  private mapToDomain(serialized: MicroActionSerialized): MicroAction | null {
    try {
      return new MicroAction({
        id: serialized.id,
        goalId: serialized.goalId,
        milestoneId: serialized.milestoneId,
        title: serialized.title,
        scaleDownTitle: serialized.scaleDownTitle,
        estimatedMinutes: serialized.estimatedMinutes,
        isScaledDown: serialized.isScaledDown,
        isActiveToday: serialized.isActiveToday,
        isCompletedToday: serialized.isCompletedToday,
        completedAt: serialized.completedAt ? new Date(serialized.completedAt) : undefined,
        category: serialized.category,
        createdAt: new Date(serialized.createdAt),
        updatedAt: new Date(serialized.updatedAt),
      });
    } catch (err) {
      console.warn("[LocalStorageSanctuaryRepository] Failed to deserialize MicroAction:", err);
      return null;
    }
  }

  private getStoredList(): MicroActionSerialized[] {
    return this.driver.getItem<MicroActionSerialized[]>(this.storageKey, []) || [];
  }

  public async save(action: MicroAction): Promise<Result<void, Error>> {
    try {
      const list = this.getStoredList();
      const serialized = this.mapToSerialized(action);
      const index = list.findIndex((item) => item.id === action.id);

      if (index >= 0) {
        list[index] = serialized;
      } else {
        list.push(serialized);
      }

      const success = this.driver.setItem(this.storageKey, list);
      if (!success) {
        return Result.err(new Error("Failed to write micro-actions to local storage"));
      }
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findById(id: string): Promise<Result<MicroAction | null, Error>> {
    try {
      const list = this.getStoredList();
      const found = list.find((item) => item.id === id);
      if (!found) {
        return Result.ok(null);
      }
      const action = this.mapToDomain(found);
      return Result.ok(action);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findAll(): Promise<Result<MicroAction[], Error>> {
    try {
      const list = this.getStoredList();
      const actions: MicroAction[] = [];
      for (const item of list) {
        const action = this.mapToDomain(item);
        if (action) {
          actions.push(action);
        }
      }
      return Result.ok(actions);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findDailyFocusActions(): Promise<Result<MicroAction[], Error>> {
    try {
      const allResult = await this.findAll();
      if (allResult.isErr()) {
        return allResult;
      }
      const activeActions = allResult.unwrap().filter((action) => action.isActiveToday);
      return Result.ok(activeActions);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async delete(id: string): Promise<Result<void, Error>> {
    try {
      const list = this.getStoredList();
      const filtered = list.filter((item) => item.id !== id);
      this.driver.setItem(this.storageKey, filtered);
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
