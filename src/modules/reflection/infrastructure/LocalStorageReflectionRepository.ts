import { ReflectionRepositoryPort } from "../domain/ReflectionRepositoryPort";
import { HanseiReflection } from "../domain/HanseiReflection";
import { Result } from "@/shared/domain/Result";
import {
  LocalStorageDriver,
  localStorageDriver as defaultStorageDriver,
} from "@/shared/infrastructure/LocalStorageDriver";

interface HanseiReflectionSerialized {
  id: string;
  date: string;
  winOfTheDay: string;
  tomorrowAdjustment: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageReflectionRepository implements ReflectionRepositoryPort {
  private readonly reflectionsKey: string;
  private readonly activeDatesKey: string;
  private readonly driver: LocalStorageDriver;

  constructor(
    driver: LocalStorageDriver = defaultStorageDriver,
    reflectionsKey: string = "kaizen_reflections",
    activeDatesKey: string = "kaizen_active_dates"
  ) {
    this.driver = driver;
    this.reflectionsKey = reflectionsKey;
    this.activeDatesKey = activeDatesKey;
  }

  private mapToSerialized(reflection: HanseiReflection): HanseiReflectionSerialized {
    return {
      id: reflection.id,
      date: reflection.date,
      winOfTheDay: reflection.winOfTheDay,
      tomorrowAdjustment: reflection.tomorrowAdjustment,
      submittedAt: reflection.submittedAt.toISOString(),
      createdAt: reflection.createdAt.toISOString(),
      updatedAt: reflection.updatedAt.toISOString(),
    };
  }

  private mapToDomain(serialized: HanseiReflectionSerialized): HanseiReflection | null {
    try {
      return new HanseiReflection({
        id: serialized.id,
        date: serialized.date,
        winOfTheDay: serialized.winOfTheDay,
        tomorrowAdjustment: serialized.tomorrowAdjustment,
        submittedAt: new Date(serialized.submittedAt),
        createdAt: new Date(serialized.createdAt),
        updatedAt: new Date(serialized.updatedAt),
      });
    } catch (err) {
      console.warn("[LocalStorageReflectionRepository] Failed to deserialize reflection:", err);
      return null;
    }
  }

  private getStoredReflections(): HanseiReflectionSerialized[] {
    return this.driver.getItem<HanseiReflectionSerialized[]>(this.reflectionsKey, []) || [];
  }

  private getStoredActiveDates(): string[] {
    return this.driver.getItem<string[]>(this.activeDatesKey, []) || [];
  }

  public async saveReflection(reflection: HanseiReflection): Promise<Result<void, Error>> {
    try {
      const list = this.getStoredReflections();
      const serialized = this.mapToSerialized(reflection);
      const index = list.findIndex(
        (item) => item.id === reflection.id || item.date === reflection.date
      );

      if (index >= 0) {
        list[index] = serialized;
      } else {
        list.push(serialized);
      }

      const success = this.driver.setItem(this.reflectionsKey, list);
      if (!success) {
        return Result.err(new Error("Failed to write reflection to local storage"));
      }

      // Also ensure date is in active dates
      await this.recordActiveDate(reflection.date);

      return Result.ok(undefined);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findReflectionById(id: string): Promise<Result<HanseiReflection | null, Error>> {
    try {
      const list = this.getStoredReflections();
      const found = list.find((item) => item.id === id);
      if (!found) {
        return Result.ok(null);
      }
      return Result.ok(this.mapToDomain(found));
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findReflectionByDate(date: string): Promise<Result<HanseiReflection | null, Error>> {
    try {
      const list = this.getStoredReflections();
      const found = list.find((item) => item.date === date);
      if (!found) {
        return Result.ok(null);
      }
      return Result.ok(this.mapToDomain(found));
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async findAllReflections(): Promise<Result<HanseiReflection[], Error>> {
    try {
      const list = this.getStoredReflections();
      const reflections: HanseiReflection[] = [];
      for (const item of list) {
        const domain = this.mapToDomain(item);
        if (domain) {
          reflections.push(domain);
        }
      }
      return Result.ok(reflections);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async getActiveDates(): Promise<Result<string[], Error>> {
    try {
      const dates = this.getStoredActiveDates();
      return Result.ok(dates);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async recordActiveDate(date: string): Promise<Result<void, Error>> {
    try {
      const dates = this.getStoredActiveDates();
      if (!dates.includes(date)) {
        dates.push(date);
        this.driver.setItem(this.activeDatesKey, dates);
      }
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
