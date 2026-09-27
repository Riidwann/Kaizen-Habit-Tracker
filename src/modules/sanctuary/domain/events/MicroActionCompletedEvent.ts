import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface MicroActionCompletedPayload {
  microActionId: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  isScaledDown: boolean;
  completedAt: Date;
}

export class MicroActionCompletedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "MicroActionCompleted";
  public readonly payload: MicroActionCompletedPayload;

  constructor(payload: MicroActionCompletedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
