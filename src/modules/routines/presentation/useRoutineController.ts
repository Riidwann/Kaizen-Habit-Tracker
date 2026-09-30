import { useState, useEffect, useCallback, useMemo } from "react";
import { RoutineSchedule } from "../domain/RoutineSchedule";
import { RoutineRepositoryPort } from "../domain/RoutineRepositoryPort";
import { LocalStorageRoutineRepository } from "../infrastructure/LocalStorageRoutineRepository";

export interface AddRoutineInput {
  title: string;
  time: string; // HH:mm
  daysOfWeek: number[]; // 0..6 (0=Minggu, 1=Senin, ..., 6=Sabtu)
}

export interface UseRoutineControllerProps {
  repository?: RoutineRepositoryPort;
  enabled?: boolean;
}

export function useRoutineController(props?: UseRoutineControllerProps) {
  const repo = useMemo(
    () => props?.repository || new LocalStorageRoutineRepository(),
    [props?.repository]
  );

  const [rawRoutines, setRawRoutines] = useState<RoutineSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(props?.enabled !== false);
  const [error, setError] = useState<string | null>(null);

  const refreshRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await repo.getAll();
      setRawRoutines(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat jadwal rutinitas");
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    if (props?.enabled !== false) {
      refreshRoutines();
    }
  }, [refreshRoutines, props?.enabled]);

  // Routines sorted chronologically by time (HH:mm)
  const routines = useMemo(() => {
    return [...rawRoutines].sort((a, b) => a.time.localeCompare(b.time));
  }, [rawRoutines]);

  // Routines active today (0=Minggu, 1=Senin, etc.)
  const todayRoutines = useMemo(() => {
    const todayDay = new Date().getDay();
    return routines.filter((r) => r.daysOfWeek.includes(todayDay));
  }, [routines]);

  const remainingCountToday = useMemo(
    () => todayRoutines.filter((r) => !r.isCompletedToday).length,
    [todayRoutines]
  );

  const completedCountToday = useMemo(
    () => todayRoutines.filter((r) => r.isCompletedToday).length,
    [todayRoutines]
  );

  const addRoutine = useCallback(
    async (input: AddRoutineInput): Promise<boolean> => {
      setError(null);
      const res = RoutineSchedule.create({
        title: input.title,
        time: input.time,
        daysOfWeek: input.daysOfWeek,
      });

      if (res.isErr()) {
        setError(res.getError() || "Gagal membuat rutinitas");
        return false;
      }

      const newRoutine = res.unwrap();
      const saved = await repo.save(newRoutine);
      if (saved) {
        await refreshRoutines();
        return true;
      }
      setError("Gagal menyimpan rutinitas");
      return false;
    },
    [repo, refreshRoutines]
  );

  const toggleCompleteToday = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);
      const target = await repo.findById(id);
      if (!target) {
        setError("Rutinitas tidak ditemukan");
        return false;
      }

      target.toggleCompleteToday();
      const saved = await repo.save(target);
      if (saved) {
        await refreshRoutines();
        return true;
      }
      setError("Gagal memperbarui status rutinitas");
      return false;
    },
    [repo, refreshRoutines]
  );

  const deleteRoutine = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);
      const deleted = await repo.delete(id);
      if (deleted) {
        await refreshRoutines();
        return true;
      }
      setError("Gagal menghapus rutinitas");
      return false;
    },
    [repo, refreshRoutines]
  );

  return {
    routines,
    allRoutines: routines,
    todayRoutines,
    remainingCountToday,
    completedCountToday,
    addRoutine,
    toggleCompleteToday,
    deleteRoutine,
    isLoading,
    error,
    refreshRoutines,
  };
}
