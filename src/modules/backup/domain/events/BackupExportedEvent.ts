import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface BackupExportedPayload {
  version: string;
  exportedAt: Date;
  goalCount: number;
  microActionCount: number;
  hanseiCount: number;
}

export class BackupExportedEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "BackupExported";
  public readonly payload: BackupExportedPayload;

  constructor(payload: BackupExportedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
