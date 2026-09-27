import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoadSampleDataUseCase } from "@/modules/backup/application/LoadSampleDataUseCase";
import { BackupRepositoryPort } from "@/modules/backup/domain/BackupRepositoryPort";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupRestoredEvent } from "@/modules/backup/domain/events/BackupRestoredEvent";

describe("LoadSampleDataUseCase", () => {
  let mockRepo: BackupRepositoryPort;
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    mockRepo = {
      getSnapshot: vi.fn(),
      restoreSnapshot: vi.fn().mockResolvedValue(Result.ok(undefined)),
      clearAll: vi.fn().mockResolvedValue(Result.ok(undefined)),
    };
  });

  it("generates 3 starter Kaizen goals and micro-actions matching the specification", () => {
    const useCase = new LoadSampleDataUseCase(mockRepo, eventBus);
    const sample = useCase.getSampleSnapshot();

    expect(sample.appName).toBe("KaizenFlow");
    expect(sample.version).toBe("1.0.0");
    expect(sample.data.goals).toHaveLength(3);
    expect(sample.data.microActions).toHaveLength(3);

    // Goal 1: Kesehatan (Health)
    const g1 = sample.data.goals.find((g) => g.title === "Tubuh Bugar & Berenergi");
    expect(g1).toBeDefined();
    expect(g1?.category).toBe("health");
    expect(g1?.milestones?.[0].title).toBe("Membangun kebiasaan gerak harian");
    const a1 = sample.data.microActions.find((a) => a.goalId === g1?.id);
    expect(a1?.title).toBe("Lakukan 2 kali push-up saat bangun tidur");
    expect(a1?.scaleDownTitle).toBe("Cukup gelar matras yoga");

    // Goal 2: Karier / Architecture
    const g2 = sample.data.goals.find((g) => g.title === "Kuasai Frontend & Architecture");
    expect(g2).toBeDefined();
    expect(g2?.milestones?.[0].title).toBe("Membaca 1 konsep arsitektur setiap hari");
    const a2 = sample.data.microActions.find((a) => a.goalId === g2?.id);
    expect(a2?.title).toBe("Buka artikel DDD & baca 1 paragraf");
    expect(a2?.scaleDownTitle).toBe("Buka tab artikel di browser");

    // Goal 3: Mindset / Zen Mind
    const g3 = sample.data.goals.find((g) => g.title === "Ketenangan Pikiran (Zen Mind)");
    expect(g3).toBeDefined();
    expect(g3?.milestones?.[0].title).toBe("Meditasi pernapasan rutin");
    const a3 = sample.data.microActions.find((a) => a.goalId === g3?.id);
    expect(a3?.title).toBe("Tarik napas dalam 3 kali sebelum tidur");
    expect(a3?.scaleDownTitle).toBe("Tarik napas dalam 1 kali");
  });

  it("restores starter sample data to repository and publishes BackupRestoredEvent", async () => {
    let publishedEvent: BackupRestoredEvent | null = null;
    eventBus.subscribe("BackupRestored", (event) => {
      publishedEvent = event as BackupRestoredEvent;
    });

    const useCase = new LoadSampleDataUseCase(mockRepo, eventBus);
    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(mockRepo.restoreSnapshot).toHaveBeenCalledTimes(1);

    expect(publishedEvent).not.toBeNull();
    expect(publishedEvent?.payload.source).toBe("sample_data");
    expect(publishedEvent?.payload.goalCount).toBe(3);
    expect(publishedEvent?.payload.microActionCount).toBe(3);
  });
});
