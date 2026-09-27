import { DomainEvent } from "../domain/DomainEvent";

export type DomainEventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

export interface IEventBus {
  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): () => void;
  unsubscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): void;
  publish<T extends DomainEvent>(event: T): Promise<void>;
  clear(): void;
}

export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Set<DomainEventHandler<any>>> = new Map();

  public subscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }

    const set = this.handlers.get(eventName)!;
    set.add(handler as DomainEventHandler<any>);

    return () => {
      this.unsubscribe(eventName, handler);
    };
  }

  public unsubscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): void {
    const set = this.handlers.get(eventName);
    if (set) {
      set.delete(handler as DomainEventHandler<any>);
      if (set.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  public async publish<T extends DomainEvent>(event: T): Promise<void> {
    const set = this.handlers.get(event.eventName);
    if (!set || set.size === 0) {
      return;
    }

    const handlerPromises = Array.from(set).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(
          `[InMemoryEventBus] Error in handler for event "${event.eventName}":`,
          error
        );
      }
    });

    await Promise.all(handlerPromises);
  }

  public clear(): void {
    this.handlers.clear();
  }
}

export const inMemoryEventBus = new InMemoryEventBus();
