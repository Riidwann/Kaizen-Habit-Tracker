// Domain
export {
  HanseiReflection,
  type HanseiReflectionProps,
} from "./domain/HanseiReflection";
export {
  StreakCounter,
  type StreakCounterProps,
} from "./domain/StreakCounter";
export { NeverMissTwicePolicy } from "./domain/NeverMissTwicePolicy";
export {
  CompoundGrowthCalculator,
  type CompoundDataPoint,
} from "./domain/CompoundGrowthCalculator";
export type { ReflectionRepositoryPort } from "./domain/ReflectionRepositoryPort";
export {
  HanseiRecordedEvent,
  type HanseiRecordedPayload,
} from "./domain/events/HanseiRecordedEvent";
export {
  StreakUpdatedEvent,
  type StreakUpdatedPayload,
} from "./domain/events/StreakUpdatedEvent";

// Application
export {
  RecordHanseiUseCase,
  type RecordHanseiDTO,
} from "./application/RecordHanseiUseCase";
export {
  GetConsistencyStatsUseCase,
  type ConsistencyStats,
} from "./application/GetConsistencyStatsUseCase";
export { GetHanseiHistoryUseCase } from "./application/GetHanseiHistoryUseCase";

// Infrastructure
export { LocalStorageReflectionRepository } from "./infrastructure/LocalStorageReflectionRepository";

// Presentation
export {
  HanseiModal,
  type HanseiModalProps,
} from "./presentation/HanseiModal";
export {
  CompoundVisualizerView,
  type CompoundVisualizerViewProps,
} from "./presentation/CompoundVisualizerView";
export {
  StreakBadge,
  type StreakBadgeProps,
} from "./presentation/StreakBadge";
export {
  HanseiHistoryList,
  type HanseiHistoryListProps,
} from "./presentation/HanseiHistoryList";
export {
  useReflectionController,
  type ReflectionController,
  type UseReflectionControllerOptions,
} from "./presentation/useReflectionController";
