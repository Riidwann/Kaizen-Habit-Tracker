import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface StreakUpdatedPayload {
  currentStreak: number;
  longestStreak: number;
  isGracePeriod: boolean;
  lastActiveDate?: string;
  updatedAt: Date;
}

export class StreakUpdatedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "StreakUpdated";
  public readonly payload: StreakUpdatedPayload;

  constructor(payload: StreakUpdatedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
