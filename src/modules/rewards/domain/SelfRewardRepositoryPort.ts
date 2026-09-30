import { SelfReward } from "./SelfReward";

export interface SelfRewardRepositoryPort {
  getAll(): Promise<SelfReward[]>;
  getActiveReward(): Promise<SelfReward | null>;
  save(reward: SelfReward): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
