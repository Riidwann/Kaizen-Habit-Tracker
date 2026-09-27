import { useState, useEffect, useCallback, useMemo } from "react";
import { MicroAction } from "../domain/MicroAction";
import { SanctuaryRepositoryPort } from "../domain/SanctuaryRepositoryPort";
import { LocalStorageSanctuaryRepository } from "../infrastructure/LocalStorageSanctuaryRepository";
import { GetDailyFocusActionsUseCase } from "../application/GetDailyFocusActionsUseCase";
import { CompleteMicroActionUseCase } from "../application/CompleteMicroActionUseCase";
import { ScaleDownMicroActionUseCase } from "../application/ScaleDownMicroActionUseCase";
import { CreateMicroActionUseCase, CreateMicroActionDTO } from "../application/CreateMicroActionUseCase";
import { InMemoryEventBus, inMemoryEventBus as defaultEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { WebAudioService, webAudioService as defaultWebAudioService } from "@/shared/infrastructure/WebAudioService";

export interface UseSanctuaryControllerOptions {
  repository?: SanctuaryRepositoryPort;
  eventBus?: InMemoryEventBus;
  webAudioService?: WebAudioService;
  autoLoad?: boolean;
}

export interface SanctuaryController {
  actions: MicroAction[];
  isLoading: boolean;
  error: string | null;
  activeTimerAction: MicroAction | null;
  isTimerOpen: boolean;
  allCompleted: boolean;
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  handleToggleComplete: (id: string) => Promise<void>;
  handleToggleScaleDown: (id: string) => Promise<void>;
  handleOpenTimer: (action: MicroAction) => void;
  handleCloseTimer: () => void;
  handleTimerComplete: (id: string) => Promise<void>;
  createMicroAction: (dto: CreateMicroActionDTO) => Promise<boolean>;
  refreshActions: () => Promise<void>;
}

const defaultSanctuaryRepository = new LocalStorageSanctuaryRepository();

export function useSanctuaryController(
  options: UseSanctuaryControllerOptions = {}
): SanctuaryController {
  const repository = useMemo(
    () => options.repository || defaultSanctuaryRepository,
    [options.repository]
  );
  const eventBus = options.eventBus || defaultEventBus;
  const webAudioService = options.webAudioService || defaultWebAudioService;
  const autoLoad = options.autoLoad !== false;

  const [actions, setActions] = useState<MicroAction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimerAction, setActiveTimerAction] = useState<MicroAction | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);

  const getFocusUseCase = useMemo(
    () => new GetDailyFocusActionsUseCase(repository),
    [repository]
  );
  const completeUseCase = useMemo(
    () => new CompleteMicroActionUseCase(repository, eventBus),
    [repository, eventBus]
  );
  const scaleDownUseCase = useMemo(
    () => new ScaleDownMicroActionUseCase(repository, eventBus),
    [repository, eventBus]
  );
  const createUseCase = useMemo(
    () => new CreateMicroActionUseCase(repository, eventBus),
    [repository, eventBus]
  );

  const refreshActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFocusUseCase.execute();
      if (result.isOk()) {
        setActions(result.unwrap());
      } else {
        setError(result.getError()?.message || "Gagal memuat fokus harian");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [getFocusUseCase]);

  useEffect(() => {
    if (autoLoad) {
      refreshActions();
    }
  }, [autoLoad, refreshActions]);

  const handleToggleComplete = useCallback(
    async (id: string) => {
      const target = actions.find((a) => a.id === id);
      if (!target) return;

      if (!target.isCompletedToday) {
        const result = await completeUseCase.execute(id);
        if (result.isOk()) {
          const updated = result.unwrap();
          try {
            webAudioService.playSuccessChime();
          } catch {
            // Audio ignore
          }
          setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
        } else {
          setError(result.getError() || "Gagal menyelesaikan tindakan mikro");
        }
      } else {
        target.uncomplete();
        await repository.save(target);
        setActions((prev) => [...prev]);
      }
    },
    [actions, completeUseCase, repository, webAudioService]
  );

  const handleToggleScaleDown = useCallback(
    async (id: string) => {
      const result = await scaleDownUseCase.execute(id);
      if (result.isOk()) {
        const updated = result.unwrap();
        setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
      } else {
        setError(result.getError() || "Gagal mengubah mode darurat");
      }
    },
    [scaleDownUseCase]
  );

  const handleOpenTimer = useCallback((action: MicroAction) => {
    setActiveTimerAction(action);
    setIsTimerOpen(true);
  }, []);

  const handleCloseTimer = useCallback(() => {
    setIsTimerOpen(false);
    setActiveTimerAction(null);
  }, []);

  const handleTimerComplete = useCallback(
    async (id: string) => {
      await handleToggleComplete(id);
      handleCloseTimer();
    },
    [handleToggleComplete, handleCloseTimer]
  );

  const createMicroAction = useCallback(
    async (dto: CreateMicroActionDTO): Promise<boolean> => {
      const res = await createUseCase.execute(dto);
      if (res.isOk()) {
        await refreshActions();
        return true;
      } else {
        setError(res.getError() || "Gagal membuat tindakan mikro");
        return false;
      }
    },
    [createUseCase, refreshActions]
  );

  const completedCount = useMemo(
    () => actions.filter((a) => a.isCompletedToday).length,
    [actions]
  );
  const totalCount = actions.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return {
    actions,
    isLoading,
    error,
    activeTimerAction,
    isTimerOpen,
    allCompleted,
    completedCount,
    totalCount,
    progressPercentage,
    handleToggleComplete,
    handleToggleScaleDown,
    handleOpenTimer,
    handleCloseTimer,
    handleTimerComplete,
    createMicroAction,
    refreshActions,
  };
}
