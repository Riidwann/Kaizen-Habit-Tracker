import { describe, it, expect, vi, beforeEach } from "vitest";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { DomainEvent } from "@/shared/domain/DomainEvent";

class HabitCompletedEvent implements DomainEvent {
  readonly eventId = "evt-123";
  readonly occurredAt = new Date();
  readonly eventName = "HabitCompleted";
  constructor(public readonly habitId: string) {}
}

class GoalCreatedEvent implements DomainEvent {
  readonly eventId = "evt-456";
  readonly occurredAt = new Date();
  readonly eventName = "GoalCreated";
  constructor(public readonly goalId: string) {}
}

describe("InMemoryEventBus", () => {
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
  });

  it("should subscribe to an event and receive it upon publish", async () => {
    const handler = vi.fn();
    eventBus.subscribe<HabitCompletedEvent>("HabitCompleted", handler);

    const event = new HabitCompletedEvent("h-1");
    await eventBus.publish(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("should not call handler if different event is published", async () => {
    const handler = vi.fn();
    eventBus.subscribe<HabitCompletedEvent>("HabitCompleted", handler);

    const event = new GoalCreatedEvent("g-1");
    await eventBus.publish(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should call multiple handlers subscribed to the same event", async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventBus.subscribe("HabitCompleted", handler1);
    eventBus.subscribe("HabitCompleted", handler2);

    await eventBus.publish(new HabitCompletedEvent("h-2"));

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("should allow unsubscribing via returned unsubscribe function", async () => {
    const handler = vi.fn();
    const unsubscribe = eventBus.subscribe("HabitCompleted", handler);

    await eventBus.publish(new HabitCompletedEvent("h-3"));
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();

    await eventBus.publish(new HabitCompletedEvent("h-4"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should allow unsubscribing via explicit unsubscribe method", async () => {
    const handler = vi.fn();
    eventBus.subscribe("HabitCompleted", handler);

    await eventBus.publish(new HabitCompletedEvent("h-5"));
    expect(handler).toHaveBeenCalledTimes(1);

    eventBus.unsubscribe("HabitCompleted", handler);

    await eventBus.publish(new HabitCompletedEvent("h-6"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should handle async handlers gracefully", async () => {
    let resolved = false;
    const asyncHandler = async () => {
      await new Promise((r) => setTimeout(r, 10));
      resolved = true;
    };

    eventBus.subscribe("HabitCompleted", asyncHandler);
    await eventBus.publish(new HabitCompletedEvent("h-async"));

    expect(resolved).toBe(true);
  });

  it("should isolate errors in handlers so remaining handlers still execute", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const faultyHandler = vi.fn().mockImplementation(() => {
      throw new Error("Handler exploded");
    });
    const goodHandler = vi.fn();

    eventBus.subscribe("HabitCompleted", faultyHandler);
    eventBus.subscribe("HabitCompleted", goodHandler);

    await eventBus.publish(new HabitCompletedEvent("h-err"));

    expect(faultyHandler).toHaveBeenCalledTimes(1);
    expect(goodHandler).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  it("should clear all subscribers when clear is called", async () => {
    const handler = vi.fn();
    eventBus.subscribe("HabitCompleted", handler);
    eventBus.clear();

    await eventBus.publish(new HabitCompletedEvent("h-clear"));
    expect(handler).not.toHaveBeenCalled();
  });
});
