import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface GoalDeletedPayload {
  goalId: string;
}

export class GoalDeletedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "GoalDeleted";
  public readonly payload: GoalDeletedPayload;

  constructor(payload: GoalDeletedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
