import { useState, useEffect, useCallback, useMemo } from "react";
import { Goal, GoalStatus } from "../domain/Goal";
import { GoalCategory } from "../domain/GoalCategory";
import { Milestone } from "../domain/Milestone";
import { CreateGoalUseCase, CreateGoalDTO } from "../application/CreateGoalUseCase";
import { UpdateGoalUseCase } from "../application/UpdateGoalUseCase";
import { DeleteGoalUseCase } from "../application/DeleteGoalUseCase";
import { GetGoalsUseCase } from "../application/GetGoalsUseCase";
import { LocalStorageGoalRepository } from "../infrastructure/LocalStorageGoalRepository";
import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";

export interface UseGoalsControllerProps {
  repository?: GoalRepositoryPort;
  enabled?: boolean;
}

export function useGoalsController(props?: UseGoalsControllerProps) {
  const repository = useMemo(
    () => props?.repository || new LocalStorageGoalRepository(),
    [props?.repository]
  );

  const getGoalsUseCase = useMemo(() => new GetGoalsUseCase(repository), [repository]);
  const createGoalUseCase = useMemo(() => new CreateGoalUseCase(repository), [repository]);
  const updateGoalUseCase = useMemo(() => new UpdateGoalUseCase(repository), [repository]);
  const deleteGoalUseCase = useMemo(() => new DeleteGoalUseCase(repository), [repository]);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(props?.enabled !== false);
  const [error, setError] = useState<string | null>(null);
  const [isForgeOpen, setIsForgeOpen] = useState(false);

  const [filterCategory, setFilterCategory] = useState<GoalCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<GoalStatus | "all">("all");

  const refreshGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getGoalsUseCase.execute();
    if (result.isOk()) {
      setGoals(result.unwrap());
    } else {
      setError(result.getError() || "Failed to load goals");
    }
    setIsLoading(false);
  }, [getGoalsUseCase]);

  useEffect(() => {
    if (props?.enabled !== false) {
      refreshGoals();
    }
  }, [refreshGoals, props?.enabled]);

  const createGoal = useCallback(
    async (dto: CreateGoalDTO): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      const result = await createGoalUseCase.execute(dto);
      setIsLoading(false);
      if (result.isOk()) {
        await refreshGoals();
        setIsForgeOpen(false);
        return true;
      } else {
        setError(result.getError() || "Failed to create goal");
        return false;
      }
    },
    [createGoalUseCase, refreshGoals]
  );

  const deleteGoal = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await deleteGoalUseCase.execute(id);
      if (result.isOk()) {
        await refreshGoals();
        return true;
      } else {
        setError(result.getError() || "Failed to delete goal");
        return false;
      }
    },
    [deleteGoalUseCase, refreshGoals]
  );

  const updateGoalStatus = useCallback(
    async (id: string, status: GoalStatus): Promise<boolean> => {
      const result = await updateGoalUseCase.execute({ id, status });
      if (result.isOk()) {
        await refreshGoals();
        return true;
      } else {
        setError(result.getError() || "Failed to update goal status");
        return false;
      }
    },
    [updateGoalUseCase, refreshGoals]
  );

  const toggleMilestone = useCallback(
    async (goalId: string, milestoneId: string): Promise<boolean> => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return false;

      const toggleRes = goal.toggleMilestone(milestoneId);
      if (toggleRes.isErr()) {
        setError(toggleRes.getError() || "Milestone not found");
        return false;
      }

      const saveRes = await repository.save(goal);
      if (saveRes.isOk()) {
        await refreshGoals();
        return true;
      }
      return false;
    },
    [goals, repository, refreshGoals]
  );

  const addMilestone = useCallback(
    async (goalId: string, title: string): Promise<boolean> => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return false;

      const nextOrder = goal.milestones.length + 1;
      const milestoneRes = Milestone.create(goalId, title, nextOrder);
      if (milestoneRes.isErr()) {
        setError(milestoneRes.getError() || "Invalid milestone");
        return false;
      }

      goal.addMilestone(milestoneRes.unwrap());
      const saveRes = await repository.save(goal);
      if (saveRes.isOk()) {
        await refreshGoals();
        return true;
      }
      return false;
    },
    [goals, repository, refreshGoals]
  );

  const deleteMilestone = useCallback(
    async (goalId: string, milestoneId: string): Promise<boolean> => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return false;

      const removeRes = goal.removeMilestone(milestoneId);
      if (removeRes.isErr()) {
        setError(removeRes.getError() || "Failed to remove milestone");
        return false;
      }

      const saveRes = await repository.save(goal);
      if (saveRes.isOk()) {
        await refreshGoals();
        return true;
      }
      return false;
    },
    [goals, repository, refreshGoals]
  );

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const matchCat = filterCategory === "all" || g.category === filterCategory;
      const matchStatus = filterStatus === "all" || g.status === filterStatus;
      return matchCat && matchStatus;
    });
  }, [goals, filterCategory, filterStatus]);

  const openForgeModal = useCallback(() => setIsForgeOpen(true), []);
  const closeForgeModal = useCallback(() => setIsForgeOpen(false), []);

  return {
    goals,
    filteredGoals,
    isLoading,
    error,
    isForgeOpen,
    openForgeModal,
    closeForgeModal,
    createGoal,
    deleteGoal,
    updateGoalStatus,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    refreshGoals,
  };
}
