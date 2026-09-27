// Domain
export { MicroAction, type MicroActionProps } from "./domain/MicroAction";
export {
  DailyFocusPolicy,
  MAX_DAILY_FOCUS_ACTIONS,
} from "./domain/DailyFocusPolicy";
export type { SanctuaryRepositoryPort } from "./domain/SanctuaryRepositoryPort";
export {
  MicroActionCompletedEvent,
  type MicroActionCompletedPayload,
} from "./domain/events/MicroActionCompletedEvent";
export {
  EmergencyScaleDownTriggeredEvent,
  type EmergencyScaleDownTriggeredPayload,
} from "./domain/events/EmergencyScaleDownTriggeredEvent";

// Application
export { GetDailyFocusActionsUseCase } from "./application/GetDailyFocusActionsUseCase";
export { CompleteMicroActionUseCase } from "./application/CompleteMicroActionUseCase";
export { ScaleDownMicroActionUseCase } from "./application/ScaleDownMicroActionUseCase";
export {
  CreateMicroActionUseCase,
  type CreateMicroActionDTO,
} from "./application/CreateMicroActionUseCase";

// Infrastructure
export { LocalStorageSanctuaryRepository } from "./infrastructure/LocalStorageSanctuaryRepository";

// Presentation
export { DailySanctuaryView, type DailySanctuaryViewProps } from "./presentation/DailySanctuaryView";
export { MicroActionCard, type MicroActionCardProps } from "./presentation/MicroActionCard";
export { ActionTimerModal, type ActionTimerModalProps } from "./presentation/ActionTimerModal";
export { DailyCompletionState, type DailyCompletionStateProps } from "./presentation/DailyCompletionState";
export {
  useSanctuaryController,
  type SanctuaryController,
  type UseSanctuaryControllerOptions,
} from "./presentation/useSanctuaryController";
