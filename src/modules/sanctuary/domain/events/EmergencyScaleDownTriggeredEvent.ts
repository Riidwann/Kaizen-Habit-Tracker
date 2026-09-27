import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface EmergencyScaleDownTriggeredPayload {
  microActionId: string;
  goalId?: string;
  title: string;
  scaleDownTitle: string;
  isScaledDown: boolean;
  triggeredAt: Date;
}

export class EmergencyScaleDownTriggeredEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "EmergencyScaleDownTriggered";
  public readonly payload: EmergencyScaleDownTriggeredPayload;

  constructor(payload: EmergencyScaleDownTriggeredPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
