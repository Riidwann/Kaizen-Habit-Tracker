import { useState, useCallback, useMemo } from "react";
import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import { LocalStorageBackupRepository } from "../infrastructure/LocalStorageBackupRepository";
import { ExportBackupUseCase } from "../application/ExportBackupUseCase";
import { ImportBackupUseCase } from "../application/ImportBackupUseCase";
import { LoadSampleDataUseCase } from "../application/LoadSampleDataUseCase";
import {
  FileBlobDownloader,
  fileBlobDownloader as defaultDownloader,
} from "../infrastructure/FileBlobDownloader";
import {
  InMemoryEventBus,
  inMemoryEventBus as defaultEventBus,
} from "@/shared/infrastructure/InMemoryEventBus";

export interface UseBackupControllerOptions {
  repository?: BackupRepositoryPort;
  eventBus?: InMemoryEventBus;
  downloader?: FileBlobDownloader;
}

export interface BackupController {
  isExporting: boolean;
  isImporting: boolean;
  isLoadingSample: boolean;
  isClearing: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  lastExportedAt: string | null;
  handleExport: () => Promise<boolean>;
  handleImportFile: (file: File) => Promise<boolean>;
  handleImportJsonString: (jsonStr: string) => Promise<boolean>;
  handleLoadSampleData: () => Promise<boolean>;
  handleClearAllData: () => Promise<boolean>;
  clearMessages: () => void;
}

export function useBackupController(
  options: UseBackupControllerOptions = {}
): BackupController {
  const {
    repository = new LocalStorageBackupRepository(),
    eventBus = defaultEventBus,
    downloader = defaultDownloader,
  } = options;

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastExportedAt, setLastExportedAt] = useState<string | null>(null);

  const exportUseCase = useMemo(
    () => new ExportBackupUseCase(repository, eventBus),
    [repository, eventBus]
  );
  const importUseCase = useMemo(
    () => new ImportBackupUseCase(repository, undefined, eventBus),
    [repository, eventBus]
  );
  const loadSampleUseCase = useMemo(
    () => new LoadSampleDataUseCase(repository, eventBus),
    [repository, eventBus]
  );

  const clearMessages = useCallback(() => {
    setStatusMessage(null);
    setErrorMessage(null);
  }, []);

  const handleExport = useCallback(async (): Promise<boolean> => {
    setIsExporting(true);
    clearMessages();
    try {
      const result = await exportUseCase.execute();
      if (result.isErr()) {
        setErrorMessage(
          result.getError()?.message || "Gagal membuat cadangan data"
        );
        return false;
      }

      const jsonString = result.unwrap();
      const downloaded = downloader.download(jsonString);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastExportedAt(timestamp);
      setStatusMessage("Cadangan data JSON berhasil diunduh!");
      return downloaded;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [exportUseCase, downloader, clearMessages]);

  const handleImportJsonString = useCallback(
    async (jsonStr: string): Promise<boolean> => {
      setIsImporting(true);
      clearMessages();
      try {
        const result = await importUseCase.execute(jsonStr);
        if (result.isErr()) {
          setErrorMessage(
            result.getError()?.message || "Format data cadangan tidak valid"
          );
          return false;
        }

        setStatusMessage("Data cadangan berhasil dipulihkan!");
        return true;
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [importUseCase, clearMessages]
  );

  const handleImportFile = useCallback(
    async (file: File): Promise<boolean> => {
      clearMessages();
      try {
        let text = "";
        if (typeof file.text === "function") {
          text = await file.text();
        } else {
          text = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
          });
        }
        return await handleImportJsonString(text);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Gagal membaca berkas file cadangan"
        );
        return false;
      }
    },
    [handleImportJsonString, clearMessages]
  );

  const handleLoadSampleData = useCallback(async (): Promise<boolean> => {
    setIsLoadingSample(true);
    clearMessages();
    try {
      const result = await loadSampleUseCase.execute();
      if (result.isErr()) {
        setErrorMessage(
          result.getError()?.message || "Gagal memuat contoh data"
        );
        return false;
      }

      setStatusMessage("Contoh data Kaizen berhasil dimuat!");
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setIsLoadingSample(false);
    }
  }, [loadSampleUseCase, clearMessages]);

  const handleClearAllData = useCallback(async (): Promise<boolean> => {
    setIsClearing(true);
    clearMessages();
    try {
      const result = await repository.clearAll();
      if (result.isErr()) {
        setErrorMessage(
          result.getError()?.message || "Gagal mereset data lokal"
        );
        return false;
      }

      setStatusMessage("Seluruh data lokal berhasil direset.");
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setIsClearing(false);
    }
  }, [repository, clearMessages]);

  return {
    isExporting,
    isImporting,
    isLoadingSample,
    isClearing,
    statusMessage,
    errorMessage,
    lastExportedAt,
    handleExport,
    handleImportFile,
    handleImportJsonString,
    handleLoadSampleData,
    handleClearAllData,
    clearMessages,
  };
}
