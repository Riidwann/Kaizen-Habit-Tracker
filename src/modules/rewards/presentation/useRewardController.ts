import { useState, useEffect, useCallback, useMemo } from "react";
import { SelfReward } from "../domain/SelfReward";
import { SelfRewardRepositoryPort } from "../domain/SelfRewardRepositoryPort";
import { LocalStorageRewardRepository } from "../infrastructure/LocalStorageRewardRepository";

export const DEFAULT_REWARD_TITLE = "Apresiasi diri: istirahat atau nikmati hadiah favorit";
export const DEFAULT_TARGET_STREAK = 7;

export interface UseRewardControllerProps {
  currentStreak: number;
  repository?: SelfRewardRepositoryPort;
  enabled?: boolean;
}

export function useRewardController({
  currentStreak,
  repository,
  enabled = true,
}: UseRewardControllerProps) {
  const repo = useMemo(
    () => repository || new LocalStorageRewardRepository(),
    [repository]
  );

  const [activeReward, setActiveReward] = useState<SelfReward | null>(null);
  const [rewardHistory, setRewardHistory] = useState<SelfReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const refreshRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let rewards = await repo.getAll();

      // If no reward exists, initialize default pending reward
      if (rewards.length === 0) {
        const defaultRewardRes = SelfReward.create({
          title: DEFAULT_REWARD_TITLE,
          targetStreak: DEFAULT_TARGET_STREAK,
          status: "pending",
        });
        if (defaultRewardRes.isOk()) {
          const defaultReward = defaultRewardRes.unwrap();
          await repo.save(defaultReward);
          rewards = [defaultReward];
        }
      }

      // Find active reward (prioritize earned, then pending)
      let active =
        rewards.find((r) => r.status === "earned") ||
        rewards.find((r) => r.status === "pending") ||
        null;

      // If all existing rewards are claimed, auto-queue next milestone target
      if (!active) {
        const highestTarget = rewards.reduce(
          (max, r) => Math.max(max, r.targetStreak),
          0
        );
        const nextTarget = highestTarget > 0 ? highestTarget + 7 : 7;
        const nextRewardRes = SelfReward.create({
          title: DEFAULT_REWARD_TITLE,
          targetStreak: nextTarget,
          status: "pending",
        });
        if (nextRewardRes.isOk()) {
          active = nextRewardRes.unwrap();
          await repo.save(active);
          rewards.push(active);
        }
      }

      // Evaluate eligibility against current streak
      if (active && active.status === "pending") {
        const newlyEarned = active.checkEligibility(currentStreak);
        if (newlyEarned) {
          await repo.save(active);
        }
      }

      setActiveReward(active);
      setRewardHistory(rewards);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data self-reward"
      );
    } finally {
      setIsLoading(false);
    }
  }, [repo, currentStreak]);

  useEffect(() => {
    if (enabled) {
      refreshRewards();
    }
  }, [refreshRewards, enabled]);

  const isEarned = Boolean(activeReward && activeReward.status === "earned");

  const claimReward = useCallback(
    async (nextTitle?: string): Promise<boolean> => {
      if (!activeReward) return false;
      try {
        activeReward.claim();
        await repo.save(activeReward);

        // Queue the next 7-day milestone target (e.g. current targetStreak + 7)
        const nextTarget = (activeReward.targetStreak || DEFAULT_TARGET_STREAK) + 7;
        const newRewardRes = SelfReward.create({
          title: nextTitle || DEFAULT_REWARD_TITLE,
          targetStreak: nextTarget,
          status: "pending",
        });

        if (newRewardRes.isOk()) {
          await repo.save(newRewardRes.unwrap());
        }

        await refreshRewards();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal mengklaim self-reward"
        );
        return false;
      }
    },
    [activeReward, repo, refreshRewards]
  );

  const updateRewardTitle = useCallback(
    async (title: string): Promise<boolean> => {
      if (!activeReward) return false;
      const trimmed = title.trim();
      if (!trimmed) {
        setError("Nama self-reward tidak boleh kosong");
        return false;
      }
      try {
        activeReward.updateTitle(trimmed);
        await repo.save(activeReward);
        await refreshRewards();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memperbarui self-reward"
        );
        return false;
      }
    },
    [activeReward, repo, refreshRewards]
  );

  return {
    activeReward,
    isEarned,
    rewardHistory,
    isLoading,
    error,
    refreshRewards,
    claimReward,
    updateRewardTitle,
  };
}
