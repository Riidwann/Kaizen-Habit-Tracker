import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";
import { Goal, GoalStatus } from "../domain/Goal";
import { GoalCategory } from "../domain/GoalCategory";
import { EmotionalAnchor } from "../domain/EmotionalAnchor";
import { Milestone } from "../domain/Milestone";
import { Result } from "@/shared/domain/Result";
import {
  LocalStorageDriver,
  localStorageDriver as defaultStorageDriver,
} from "@/shared/infrastructure/LocalStorageDriver";

interface MilestoneSerialized {
  id: string;
  goalId: string;
  title: string;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GoalSerialized {
  id: string;
  title: string;
  whyText: string;
  category: GoalCategory;
  status: GoalStatus;
  milestones: MilestoneSerialized[];
  microAction?: string;
  scaleDownFallback?: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageGoalRepository implements GoalRepositoryPort {
  private readonly storageKey: string;
  private readonly driver: LocalStorageDriver;

  constructor(
    driver: LocalStorageDriver = defaultStorageDriver,
    storageKey: string = "kaizen_goals"
  ) {
    this.driver = driver;
    this.storageKey = storageKey;
  }

  private mapToSerialized(goal: Goal): GoalSerialized {
    return {
      id: goal.id,
      title: goal.title,
      whyText: goal.whyStatement.whyText,
      category: goal.category,
      status: goal.status,
      milestones: goal.milestones.map((m) => ({
        id: m.id,
        goalId: m.goalId,
        title: m.title,
        order: m.order,
        isCompleted: m.isCompleted,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
      microAction: goal.microAction,
      scaleDownFallback: goal.scaleDownFallback,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    };
  }

  private mapToDomain(serialized: GoalSerialized): Goal | null {
    const whyRes = EmotionalAnchor.create(serialized.whyText);
    if (whyRes.isErr()) {
      return null;
    }

    const milestones = (serialized.milestones || []).map(
      (m) =>
        new Milestone({
          id: m.id,
          goalId: m.goalId,
          title: m.title,
          order: m.order,
          isCompleted: m.isCompleted,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        })
    );

    return new Goal({
      id: serialized.id,
      title: serialized.title,
      whyStatement: whyRes.unwrap(),
      category: serialized.category,
      status: serialized.status,
      milestones,
      microAction: serialized.microAction,
      scaleDownFallback: serialized.scaleDownFallback,
      createdAt: new Date(serialized.createdAt),
      updatedAt: new Date(serialized.updatedAt),
    });
  }

  private getStoredList(): GoalSerialized[] {
    return this.driver.getItem<GoalSerialized[]>(this.storageKey, []) || [];
  }

  public async save(goal: Goal): Promise<Result<void, Error>> {
    try {
      const list = this.getStoredList();
      const serialized = this.mapToSerialized(goal);
      const index = list.findIndex((item) => item.id === goal.id);

      if (index >= 0) {
        list[index] = serialized;
      } else {
        list.push(serialized);
      }

      const success = this.driver.setItem(this.storageKey, list);
      if (!success) {
        return Result.err(new Error("Failed to write goals to local storage"));
      }
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  public async findById(id: string): Promise<Result<Goal | null, Error>> {
    try {
      const list = this.getStoredList();
      const found = list.find((item) => item.id === id);
      if (!found) {
        return Result.ok(null);
      }
      const goal = this.mapToDomain(found);
      return Result.ok(goal);
    } catch (err) {
      return Result.err(
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  public async findAll(): Promise<Result<Goal[], Error>> {
    try {
      const list = this.getStoredList();
      const goals: Goal[] = [];
      for (const item of list) {
        const goal = this.mapToDomain(item);
        if (goal) {
          goals.push(goal);
        }
      }
      return Result.ok(goals);
    } catch (err) {
      return Result.err(
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  public async delete(id: string): Promise<Result<void, Error>> {
    try {
      const list = this.getStoredList();
      const filtered = list.filter((item) => item.id !== id);
      this.driver.setItem(this.storageKey, filtered);
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }
}
