import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecordHanseiUseCase } from "@/modules/reflection/application/RecordHanseiUseCase";
import { ReflectionRepositoryPort } from "@/modules/reflection/domain/ReflectionRepositoryPort";
import { HanseiReflection } from "@/modules/reflection/domain/HanseiReflection";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { Result } from "@/shared/domain/Result";

class MockReflectionRepository implements ReflectionRepositoryPort {
  public reflections: HanseiReflection[] = [];
  public activeDates: string[] = [];

  async saveReflection(reflection: HanseiReflection): Promise<Result<void, Error>> {
    const idx = this.reflections.findIndex((r) => r.id === reflection.id || r.date === reflection.date);
    if (idx >= 0) {
      this.reflections[idx] = reflection;
    } else {
      this.reflections.push(reflection);
    }
    return Result.ok(undefined);
  }

  async findReflectionById(id: string): Promise<Result<HanseiReflection | null, Error>> {
    const found = this.reflections.find((r) => r.id === id) || null;
    return Result.ok(found);
  }

  async findReflectionByDate(date: string): Promise<Result<HanseiReflection | null, Error>> {
    const found = this.reflections.find((r) => r.date === date) || null;
    return Result.ok(found);
  }

  async findAllReflections(): Promise<Result<HanseiReflection[], Error>> {
    return Result.ok([...this.reflections]);
  }

  async getActiveDates(): Promise<Result<string[], Error>> {
    return Result.ok([...this.activeDates]);
  }

  async recordActiveDate(date: string): Promise<Result<void, Error>> {
    if (!this.activeDates.includes(date)) {
      this.activeDates.push(date);
    }
    return Result.ok(undefined);
  }
}

describe("RecordHanseiUseCase", () => {
  let repository: MockReflectionRepository;
  let eventBus: InMemoryEventBus;
  let useCase: RecordHanseiUseCase;

  beforeEach(() => {
    repository = new MockReflectionRepository();
    eventBus = new InMemoryEventBus();
    useCase = new RecordHanseiUseCase(repository, eventBus);
  });

  it("successfully records a valid evening Hansei reflection", async () => {
    const eventHandler = vi.fn();
    eventBus.subscribe("HanseiRecorded", eventHandler);

    const result = await useCase.execute({
      date: "2026-09-28",
      winOfTheDay: "Selesai membaca 1 lembar buku",
      tomorrowAdjustment: "Siapkan buku di atas meja malam ini",
    });

    expect(result.isOk()).toBe(true);
    const reflection = result.unwrap();

    expect(reflection.id).toBeDefined();
    expect(reflection.date).toBe("2026-09-28");
    expect(reflection.winOfTheDay).toBe("Selesai membaca 1 lembar buku");
    expect(reflection.tomorrowAdjustment).toBe("Siapkan buku di atas meja malam ini");
    expect(reflection.submittedAt).toBeInstanceOf(Date);

    // Repository state
    expect(repository.reflections.length).toBe(1);
    expect(repository.activeDates).toContain("2026-09-28");

    // Event bus notification
    expect(eventHandler).toHaveBeenCalledTimes(1);
    const event = eventHandler.mock.calls[0][0];
    expect(event.eventName).toBe("HanseiRecorded");
    expect(event.payload.reflectionId).toBe(reflection.id);
    expect(event.payload.winOfTheDay).toBe("Selesai membaca 1 lembar buku");
  });

  it("defaults date to today's date when not explicitly provided", async () => {
    const result = await useCase.execute({
      winOfTheDay: "Menulis 1 baris kode",
      tomorrowAdjustment: "Buka VS Code jam 8 pagi",
    });

    expect(result.isOk()).toBe(true);
    const reflection = result.unwrap();
    const todayStr = new Date().toISOString().split("T")[0];
    expect(reflection.date).toBe(todayStr);
    expect(repository.activeDates).toContain(todayStr);
  });

  it("fails if winOfTheDay is empty or only whitespace", async () => {
    const result = await useCase.execute({
      date: "2026-09-28",
      winOfTheDay: "   ",
      tomorrowAdjustment: "Siapkan buku",
    });

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/win.*empty/i);
    expect(repository.reflections.length).toBe(0);
  });

  it("fails if tomorrowAdjustment is empty or only whitespace", async () => {
    const result = await useCase.execute({
      date: "2026-09-28",
      winOfTheDay: "Selesai 1 task",
      tomorrowAdjustment: "",
    });

    expect(result.isErr()).toBe(true);
    expect(result.getError()).toMatch(/tomorrow.*empty|penyesuaian.*kosong/i);
    expect(repository.reflections.length).toBe(0);
  });

  it("updates existing reflection when submitted again for the same date", async () => {
    await useCase.execute({
      date: "2026-09-28",
      winOfTheDay: "Micro win pertama",
      tomorrowAdjustment: "Adjustment pertama",
    });

    const secondResult = await useCase.execute({
      date: "2026-09-28",
      winOfTheDay: "Micro win yang diperbarui",
      tomorrowAdjustment: "Adjustment kedua",
    });

    expect(secondResult.isOk()).toBe(true);
    expect(repository.reflections.length).toBe(1);
    expect(repository.reflections[0].winOfTheDay).toBe("Micro win yang diperbarui");
  });
});
