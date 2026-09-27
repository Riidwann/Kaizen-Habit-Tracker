import { DomainEvent } from "@/shared/domain/DomainEvent";
import { GoalCategory } from "../GoalCategory";

export interface GoalCreatedPayload {
  goalId: string;
  title: string;
  category: GoalCategory;
  whyText: string;
  microAction?: string;
  scaleDownFallback?: string;
}

export class GoalCreatedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "GoalCreated";
  public readonly payload: GoalCreatedPayload;

  constructor(payload: GoalCreatedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
