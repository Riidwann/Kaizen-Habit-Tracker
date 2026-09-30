import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRewardController } from "@/modules/rewards/presentation/useRewardController";
import { LocalStorageRewardRepository } from "@/modules/rewards/infrastructure/LocalStorageRewardRepository";

describe("useRewardController", () => {
  let repo: LocalStorageRewardRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRewardRepository("kaizen_rewards_hook_test");
  });

  it("initializes default pending reward when storage is empty", async () => {
    const { result } = renderHook(() =>
      useRewardController({ currentStreak: 3, repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activeReward).not.toBeNull();
    expect(result.current.activeReward?.targetStreak).toBe(7);
    expect(result.current.activeReward?.status).toBe("pending");
    expect(result.current.isEarned).toBe(false);
  });

  it("marks reward earned when currentStreak reaches target", async () => {
    const { result } = renderHook(() =>
      useRewardController({ currentStreak: 7, repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activeReward).not.toBeNull();
    expect(result.current.isEarned).toBe(true);
    expect(result.current.activeReward?.status).toBe("earned");
  });

  it("updates active reward title", async () => {
    const { result } = renderHook(() =>
      useRewardController({ currentStreak: 2, repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateRewardTitle("Hadiah Makan Malam Spesial");
    });

    expect(result.current.activeReward?.title).toBe("Hadiah Makan Malam Spesial");
  });

  it("claims active reward and queues next milestone target", async () => {
    const { result } = renderHook(() =>
      useRewardController({ currentStreak: 7, repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isEarned).toBe(true);
    });

    await act(async () => {
      await result.current.claimReward("Hadiah 14 Hari");
    });

    // After claim, the active reward should be the new pending milestone (14 days)
    expect(result.current.activeReward).not.toBeNull();
    expect(result.current.activeReward?.targetStreak).toBe(14);
    expect(result.current.activeReward?.status).toBe("pending");
    expect(result.current.isEarned).toBe(false);
    expect(result.current.rewardHistory.length).toBe(2);
    expect(result.current.rewardHistory[0].status).toBe("claimed");
  });
});
