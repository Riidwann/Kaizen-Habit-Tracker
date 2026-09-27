import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBackupController } from "@/modules/backup/presentation/useBackupController";
import { BackupRepositoryPort } from "@/modules/backup/domain/BackupRepositoryPort";
import { Result } from "@/shared/domain/Result";
import { SystemSnapshot } from "@/modules/backup/domain/SystemSnapshot";
import { FileBlobDownloader } from "@/modules/backup/infrastructure/FileBlobDownloader";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

describe("useBackupController", () => {
  let mockRepo: BackupRepositoryPort;
  let mockDownloader: FileBlobDownloader;
  let eventBus: InMemoryEventBus;

  const validSnapshot: SystemSnapshot = {
    version: "1.0.0",
    appName: "KaizenFlow",
    exportedAt: "2026-09-28T00:00:00.000Z",
    data: {
      goals: [],
      microActions: [],
      hanseiEntries: [],
      dailyLogs: [],
    },
  };

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    mockRepo = {
      getSnapshot: vi.fn().mockResolvedValue(Result.ok(validSnapshot)),
      restoreSnapshot: vi.fn().mockResolvedValue(Result.ok(undefined)),
      clearAll: vi.fn().mockResolvedValue(Result.ok(undefined)),
    };
    mockDownloader = {
      download: vi.fn().mockReturnValue(true),
    };
  });

  it("handles export successfully and triggers file download", async () => {
    const { result } = renderHook(() =>
      useBackupController({
        repository: mockRepo,
        downloader: mockDownloader,
        eventBus,
      })
    );

    let success = false;
    await act(async () => {
      success = await result.current.handleExport();
    });

    expect(success).toBe(true);
    expect(mockDownloader.download).toHaveBeenCalledTimes(1);
    expect(result.current.statusMessage).toContain("berhasil diunduh");
    expect(result.current.lastExportedAt).not.toBeNull();
  });

  it("handles import from JSON string successfully", async () => {
    const { result } = renderHook(() =>
      useBackupController({
        repository: mockRepo,
        downloader: mockDownloader,
        eventBus,
      })
    );

    let success = false;
    await act(async () => {
      success = await result.current.handleImportJsonString(
        JSON.stringify(validSnapshot)
      );
    });

    expect(success).toBe(true);
    expect(mockRepo.restoreSnapshot).toHaveBeenCalledWith(validSnapshot);
    expect(result.current.statusMessage).toContain("berhasil dipulihkan");
  });

  it("handles import failure with error message", async () => {
    const { result } = renderHook(() =>
      useBackupController({
        repository: mockRepo,
        downloader: mockDownloader,
        eventBus,
      })
    );

    let success = true;
    await act(async () => {
      success = await result.current.handleImportJsonString("{ invalid json");
    });

    expect(success).toBe(false);
    expect(result.current.errorMessage).not.toBeNull();
  });

  it("handles sample data loading successfully", async () => {
    const { result } = renderHook(() =>
      useBackupController({
        repository: mockRepo,
        downloader: mockDownloader,
        eventBus,
      })
    );

    let success = false;
    await act(async () => {
      success = await result.current.handleLoadSampleData();
    });

    expect(success).toBe(true);
    expect(mockRepo.restoreSnapshot).toHaveBeenCalledTimes(1);
    expect(result.current.statusMessage).toContain("berhasil dimuat");
  });

  it("handles clear all data successfully", async () => {
    const { result } = renderHook(() =>
      useBackupController({
        repository: mockRepo,
        downloader: mockDownloader,
        eventBus,
      })
    );

    let success = false;
    await act(async () => {
      success = await result.current.handleClearAllData();
    });

    expect(success).toBe(true);
    expect(mockRepo.clearAll).toHaveBeenCalledTimes(1);
    expect(result.current.statusMessage).toContain("berhasil direset");
  });
});
