import { SelfRewardRepositoryPort } from "../domain/SelfRewardRepositoryPort";
import { SelfReward, SelfRewardProps } from "../domain/SelfReward";

const DEFAULT_STORAGE_KEY = "kaizen_self_rewards";

export class LocalStorageRewardRepository implements SelfRewardRepositoryPort {
  private readonly storageKey: string;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  public async getAll(): Promise<SelfReward[]> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      const items: SelfRewardProps[] = JSON.parse(raw);
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          const res = SelfReward.create(item);
          return res.isOk() ? res.unwrap() : null;
        })
        .filter((item): item is SelfReward => item !== null);
    } catch {
      return [];
    }
  }

  public async getActiveReward(): Promise<SelfReward | null> {
    const rewards = await this.getAll();
    // Prioritize earned reward awaiting claim, then pending reward in progress
    const earned = rewards.find((r) => r.status === "earned");
    if (earned) return earned;
    const pending = rewards.find((r) => r.status === "pending");
    return pending || null;
  }

  public async save(reward: SelfReward): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const rewards = await this.getAll();
    const existingIndex = rewards.findIndex((r) => r.id === reward.id);
    if (existingIndex >= 0) {
      rewards[existingIndex] = reward;
    } else {
      rewards.push(reward);
    }
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(rewards.map((r) => r.toJSON()))
    );
    return true;
  }

  public async delete(id: string): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const rewards = await this.getAll();
    const filtered = rewards.filter((r) => r.id !== id);
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filtered.map((r) => r.toJSON()))
    );
    return true;
  }
}
