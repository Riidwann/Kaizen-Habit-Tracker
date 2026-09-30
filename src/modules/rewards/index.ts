// Domain
export { SelfReward } from "./domain/SelfReward";
export type {
  RewardStatus,
  SelfRewardProps,
  SelfRewardJSON,
} from "./domain/SelfReward";
export type { SelfRewardRepositoryPort } from "./domain/SelfRewardRepositoryPort";

// Infrastructure
export { LocalStorageRewardRepository } from "./infrastructure/LocalStorageRewardRepository";

// Presentation
export {
  useRewardController,
  DEFAULT_REWARD_TITLE,
  DEFAULT_TARGET_STREAK,
} from "./presentation/useRewardController";
export type { UseRewardControllerProps } from "./presentation/useRewardController";
export { SelfRewardBanner } from "./presentation/SelfRewardBanner";
export type { SelfRewardBannerProps } from "./presentation/SelfRewardBanner";
