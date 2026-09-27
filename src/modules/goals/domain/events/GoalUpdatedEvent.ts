import { DomainEvent } from "@/shared/domain/DomainEvent";
import { GoalStatus } from "../Goal";

export interface GoalUpdatedPayload {
  goalId: string;
  title: string;
  status: GoalStatus;
}

export class GoalUpdatedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "GoalUpdated";
  public readonly payload: GoalUpdatedPayload;

  constructor(payload: GoalUpdatedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
