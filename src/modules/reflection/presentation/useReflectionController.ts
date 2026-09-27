import { useState, useEffect, useCallback, useMemo } from "react";
import { HanseiReflection } from "../domain/HanseiReflection";
import { ReflectionRepositoryPort } from "../domain/ReflectionRepositoryPort";
import { LocalStorageReflectionRepository } from "../infrastructure/LocalStorageReflectionRepository";
import {
  GetConsistencyStatsUseCase,
  ConsistencyStats,
} from "../application/GetConsistencyStatsUseCase";
import { GetHanseiHistoryUseCase } from "../application/GetHanseiHistoryUseCase";
import {
  RecordHanseiUseCase,
  RecordHanseiDTO,
} from "../application/RecordHanseiUseCase";
import {
  InMemoryEventBus,
  inMemoryEventBus as defaultEventBus,
} from "@/shared/infrastructure/InMemoryEventBus";
import { Result } from "@/shared/domain/Result";

export interface UseReflectionControllerOptions {
  repository?: ReflectionRepositoryPort;
  eventBus?: InMemoryEventBus;
  autoLoad?: boolean;
  referenceDate?: Date | string;
}

export interface ReflectionController {
  stats: ConsistencyStats;
  reflections: HanseiReflection[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isHanseiModalOpen: boolean;
  openHanseiModal: () => void;
  closeHanseiModal: () => void;
  recordHansei: (dto: RecordHanseiDTO) => Promise<Result<HanseiReflection, string>>;
  refreshStats: () => Promise<void>;
  refreshReflections: () => Promise<void>;
}

const defaultStats: ConsistencyStats = {
  currentStreak: 0,
  longestStreak: 0,
  isGracePeriod: false,
  lastActiveDate: "",
  totalActiveDays: 0,
  totalMicroWins: 0,
  compoundMultiplier: 1.0,
  percentageGain: 0,
};

export function useReflectionController(
  options: UseReflectionControllerOptions = {}
): ReflectionController {
  const {
    repository = new LocalStorageReflectionRepository(),
    eventBus = defaultEventBus,
    autoLoad = true,
    referenceDate,
  } = options;

  const [stats, setStats] = useState<ConsistencyStats>(defaultStats);
  const [reflections, setReflections] = useState<HanseiReflection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHanseiModalOpen, setIsHanseiModalOpen] = useState<boolean>(false);

  const getStatsUseCase = useMemo(
    () => new GetConsistencyStatsUseCase(repository),
    [repository]
  );
  const getHistoryUseCase = useMemo(
    () => new GetHanseiHistoryUseCase(repository),
    [repository]
  );
  const recordUseCase = useMemo(
    () => new RecordHanseiUseCase(repository, eventBus),
    [repository, eventBus]
  );

  const refreshStats = useCallback(async () => {
    try {
      const statsRes = await getStatsUseCase.execute(referenceDate);
      if (statsRes.isOk()) {
        setStats(statsRes.unwrap());
      } else {
        setError(statsRes.getError()?.message || "Gagal memuat statistik konsistensi");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [getStatsUseCase, referenceDate]);

  const refreshReflections = useCallback(async () => {
    try {
      const historyRes = await getHistoryUseCase.execute("desc");
      if (historyRes.isOk()) {
        setReflections(historyRes.unwrap());
      } else {
        setError(historyRes.getError()?.message || "Gagal memuat riwayat refleksi");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [getHistoryUseCase]);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([refreshStats(), refreshReflections()]);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats, refreshReflections]);

  useEffect(() => {
    if (autoLoad) {
      loadAll();
    }
  }, [autoLoad, loadAll]);

  // Listen to MicroActionCompletedEvent and HanseiRecorded from EventBus
  useEffect(() => {
    if (!eventBus) return;

    const unsubscribeMicroAction = eventBus.subscribe(
      "MicroActionCompleted",
      async (event: any) => {
        try {
          const completedAt = event?.payload?.completedAt
            ? new Date(event.payload.completedAt)
            : new Date();
          const dateStr = completedAt.toISOString().split("T")[0];
          await repository.recordActiveDate(dateStr);
          await refreshStats();
        } catch (e) {
          console.warn("[useReflectionController] Error handling MicroActionCompleted:", e);
        }
      }
    );

    const unsubscribeHansei = eventBus.subscribe("HanseiRecorded", async () => {
      try {
        await Promise.all([refreshStats(), refreshReflections()]);
      } catch (e) {
        console.warn("[useReflectionController] Error handling HanseiRecorded:", e);
      }
    });

    return () => {
      unsubscribeMicroAction();
      unsubscribeHansei();
    };
  }, [eventBus, repository, refreshStats, refreshReflections]);

  const openHanseiModal = useCallback(() => {
    setIsHanseiModalOpen(true);
  }, []);

  const closeHanseiModal = useCallback(() => {
    setIsHanseiModalOpen(false);
  }, []);

  const recordHansei = useCallback(
    async (dto: RecordHanseiDTO): Promise<Result<HanseiReflection, string>> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await recordUseCase.execute(dto);
        if (result.isOk()) {
          await Promise.all([refreshStats(), refreshReflections()]);
          closeHanseiModal();
        } else {
          setError(result.getError());
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        return Result.err(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [recordUseCase, refreshStats, refreshReflections, closeHanseiModal]
  );

  return {
    stats,
    reflections,
    isLoading,
    isSubmitting,
    error,
    isHanseiModalOpen,
    openHanseiModal,
    closeHanseiModal,
    recordHansei,
    refreshStats,
    refreshReflections,
  };
}
