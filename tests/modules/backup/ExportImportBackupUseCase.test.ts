import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportBackupUseCase } from "@/modules/backup/application/ExportBackupUseCase";
import { ImportBackupUseCase } from "@/modules/backup/application/ImportBackupUseCase";
import { BackupRepositoryPort } from "@/modules/backup/domain/BackupRepositoryPort";
import { SystemSnapshot } from "@/modules/backup/domain/SystemSnapshot";
import { Result } from "@/shared/domain/Result";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupExportedEvent } from "@/modules/backup/domain/events/BackupExportedEvent";
import { BackupRestoredEvent } from "@/modules/backup/domain/events/BackupRestoredEvent";

describe("Export and Import Backup Use Cases", () => {
  let mockRepo: BackupRepositoryPort;
  let eventBus: InMemoryEventBus;
  let sampleSnapshot: SystemSnapshot;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    sampleSnapshot = {
      version: "1.0.0",
      appName: "KaizenFlow",
      exportedAt: "2026-09-28T00:00:00.000Z",
      data: {
        goals: [
          {
            id: "g1",
            title: "Tubuh Bugar",
            category: "health",
            whyText: "Tetap fit",
          },
        ],
        microActions: [
          {
            id: "a1",
            goalId: "g1",
            title: "2x Push-up",
            scaleDownTitle: "Gelar matras",
            estimatedMinutes: 2,
          },
        ],
        hanseiEntries: [
          {
            id: "h1",
            date: "2026-09-27",
            winOfTheDay: "Push-up selesai",
            tomorrowAdjustment: "Tidur lebih awal",
          },
        ],
        dailyLogs: [],
      },
    };

    mockRepo = {
      getSnapshot: vi.fn().mockResolvedValue(Result.ok(sampleSnapshot)),
      restoreSnapshot: vi.fn().mockResolvedValue(Result.ok(undefined)),
      clearAll: vi.fn().mockResolvedValue(Result.ok(undefined)),
    };
  });

  describe("ExportBackupUseCase", () => {
    it("fetches snapshot from repository, serializes to JSON string, and publishes event", async () => {
      let publishedEvent: BackupExportedEvent | null = null;
      eventBus.subscribe("BackupExported", (event) => {
        publishedEvent = event as BackupExportedEvent;
      });

      const useCase = new ExportBackupUseCase(mockRepo, eventBus);
      const result = await useCase.execute();

      expect(result.isOk()).toBe(true);
      const jsonString = result.unwrap();

      const parsed = JSON.parse(jsonString);
      expect(parsed.appName).toBe("KaizenFlow");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.data.goals).toHaveLength(1);
      expect(mockRepo.getSnapshot).toHaveBeenCalledTimes(1);

      expect(publishedEvent).not.toBeNull();
      expect((publishedEvent as any)?.payload.goalCount).toBe(1);
      expect((publishedEvent as any)?.payload.microActionCount).toBe(1);
      expect((publishedEvent as any)?.payload.hanseiCount).toBe(1);
    });

    it("returns error if repository fails to get snapshot", async () => {
      mockRepo.getSnapshot = vi
        .fn()
        .mockResolvedValue(Result.err(new Error("Storage disk error")));

      const useCase = new ExportBackupUseCase(mockRepo, eventBus);
      const result = await useCase.execute();

      expect(result.isErr()).toBe(true);
      expect(result.getError()?.message).toContain("Storage disk error");
    });
  });

  describe("ImportBackupUseCase", () => {
    it("validates valid JSON, restores to repository, and publishes BackupRestoredEvent", async () => {
      let publishedEvent: BackupRestoredEvent | null = null;
      eventBus.subscribe("BackupRestored", (event) => {
        publishedEvent = event as BackupRestoredEvent;
      });

      const useCase = new ImportBackupUseCase(mockRepo, undefined, eventBus);
      const jsonString = JSON.stringify(sampleSnapshot);

      const result = await useCase.execute(jsonString);

      expect(result.isOk()).toBe(true);
      expect(mockRepo.restoreSnapshot).toHaveBeenCalledWith(sampleSnapshot);

      expect(publishedEvent).not.toBeNull();
      expect((publishedEvent as any)?.payload.source).toBe("import");
      expect((publishedEvent as any)?.payload.goalCount).toBe(1);
    });

    it("rejects invalid JSON string without calling repository", async () => {
      const useCase = new ImportBackupUseCase(mockRepo, undefined, eventBus);
      const result = await useCase.execute("{ broken json");

      expect(result.isErr()).toBe(true);
      expect(mockRepo.restoreSnapshot).not.toHaveBeenCalled();
    });

    it("rejects invalid snapshot schema (e.g. wrong appName)", async () => {
      const corrupted = {
        ...sampleSnapshot,
        appName: "FraudApp",
      };

      const useCase = new ImportBackupUseCase(mockRepo, undefined, eventBus);
      const result = await useCase.execute(JSON.stringify(corrupted));

      expect(result.isErr()).toBe(true);
      expect(mockRepo.restoreSnapshot).not.toHaveBeenCalled();
    });

    it("returns error if repository fails to restore snapshot", async () => {
      mockRepo.restoreSnapshot = vi
        .fn()
        .mockResolvedValue(Result.err(new Error("Failed to write to storage")));

      const useCase = new ImportBackupUseCase(mockRepo, undefined, eventBus);
      const result = await useCase.execute(JSON.stringify(sampleSnapshot));

      expect(result.isErr()).toBe(true);
      expect(result.getError()?.message).toContain("Failed to write to storage");
    });
  });
});
