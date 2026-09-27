export interface DomainEvent<TPayload = any> {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName: string;
  readonly payload?: TPayload;
}
