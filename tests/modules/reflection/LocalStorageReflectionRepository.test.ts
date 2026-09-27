import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageReflectionRepository } from "@/modules/reflection/infrastructure/LocalStorageReflectionRepository";
import { HanseiReflection } from "@/modules/reflection/domain/HanseiReflection";
import { LocalStorageDriver } from "@/shared/infrastructure/LocalStorageDriver";

class InMemoryStorageDriver extends LocalStorageDriver {
  private store: Record<string, string> = {};

  public override getItem<T>(key: string, defaultValue?: T): T | null {
    const val = this.store[key];
    if (!val) return defaultValue ?? null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return defaultValue ?? null;
    }
  }

  public override setItem<T>(key: string, value: T): boolean {
    this.store[key] = JSON.stringify(value);
    return true;
  }

  public override removeItem(key: string): boolean {
    delete this.store[key];
    return true;
  }

  public override clear(): boolean {
    this.store = {};
    return true;
  }
}

describe("LocalStorageReflectionRepository", () => {
  let driver: InMemoryStorageDriver;
  let repo: LocalStorageReflectionRepository;

  beforeEach(() => {
    driver = new InMemoryStorageDriver();
    repo = new LocalStorageReflectionRepository(driver, "test_reflections", "test_active_dates");
  });

  it("saves and retrieves reflections by id and date", async () => {
    const reflection = new HanseiReflection({
      id: "ref-100",
      date: "2026-09-28",
      winOfTheDay: "Menulis 1 baris kode",
      tomorrowAdjustment: "Buka laptop jam 9",
    });

    const saveRes = await repo.saveReflection(reflection);
    expect(saveRes.isOk()).toBe(true);

    const byIdRes = await repo.findReflectionById("ref-100");
    expect(byIdRes.isOk()).toBe(true);
    expect(byIdRes.unwrap()?.winOfTheDay).toBe("Menulis 1 baris kode");

    const byDateRes = await repo.findReflectionByDate("2026-09-28");
    expect(byDateRes.isOk()).toBe(true);
    expect(byDateRes.unwrap()?.tomorrowAdjustment).toBe("Buka laptop jam 9");
  });

  it("returns null when reflection is not found", async () => {
    const res = await repo.findReflectionById("non-existent");
    expect(res.isOk()).toBe(true);
    expect(res.unwrap()).toBeNull();
  });

  it("automatically records active date when saving reflection", async () => {
    const reflection = new HanseiReflection({
      id: "ref-101",
      date: "2026-09-28",
      winOfTheDay: "Berjalan 2 menit",
      tomorrowAdjustment: "Siapkan sepatu",
    });

    await repo.saveReflection(reflection);

    const datesRes = await repo.getActiveDates();
    expect(datesRes.isOk()).toBe(true);
    expect(datesRes.unwrap()).toContain("2026-09-28");
  });

  it("allows recording active dates independently without duplication", async () => {
    await repo.recordActiveDate("2026-09-25");
    await repo.recordActiveDate("2026-09-26");
    await repo.recordActiveDate("2026-09-25"); // duplicate

    const datesRes = await repo.getActiveDates();
    expect(datesRes.isOk()).toBe(true);
    expect(datesRes.unwrap()).toEqual(["2026-09-25", "2026-09-26"]);
  });

  it("returns all reflections mapped to domain entities", async () => {
    await repo.saveReflection(
      new HanseiReflection({
        id: "ref-1",
        date: "2026-09-27",
        winOfTheDay: "Win 1",
        tomorrowAdjustment: "Adj 1",
      })
    );
    await repo.saveReflection(
      new HanseiReflection({
        id: "ref-2",
        date: "2026-09-28",
        winOfTheDay: "Win 2",
        tomorrowAdjustment: "Adj 2",
      })
    );

    const allRes = await repo.findAllReflections();
    expect(allRes.isOk()).toBe(true);
    const list = allRes.unwrap();
    expect(list.length).toBe(2);
    expect(list[0]).toBeInstanceOf(HanseiReflection);
  });
});
