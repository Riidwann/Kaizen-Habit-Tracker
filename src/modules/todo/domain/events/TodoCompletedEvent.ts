import { DomainEvent } from "@/shared/domain/DomainEvent";

export interface TodoCompletedPayload {
  todoId: string;
  title: string;
  completedAt: string;
}

export class TodoCompletedEvent implements DomainEvent<TodoCompletedPayload> {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly eventName = "TodoCompleted";
  public readonly payload: TodoCompletedPayload;

  constructor(payload: TodoCompletedPayload) {
    this.eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.occurredAt = new Date();
    this.payload = payload;
  }

  public get occurredOn(): Date {
    return this.occurredAt;
  }
}
