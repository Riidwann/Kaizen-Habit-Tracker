import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface BackupRestoredPayload {
  version: string;
  restoredAt: Date;
  goalCount: number;
  microActionCount: number;
  hanseiCount: number;
  source: "import" | "sample_data";
}

export class BackupRestoredEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "BackupRestored";
  public readonly payload: BackupRestoredPayload;

  constructor(payload: BackupRestoredPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
