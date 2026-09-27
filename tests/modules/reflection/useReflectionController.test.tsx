import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReflectionController } from "@/modules/reflection/presentation/useReflectionController";
import { ReflectionRepositoryPort } from "@/modules/reflection/domain/ReflectionRepositoryPort";
import { HanseiReflection } from "@/modules/reflection/domain/HanseiReflection";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { Result } from "@/shared/domain/Result";

class MockReflectionRepo implements ReflectionRepositoryPort {
  public reflections: HanseiReflection[] = [];
  public activeDates: string[] = [];

  async saveReflection(reflection: HanseiReflection): Promise<Result<void, Error>> {
    const idx = this.reflections.findIndex((r) => r.id === reflection.id || r.date === reflection.date);
    if (idx >= 0) {
      this.reflections[idx] = reflection;
    } else {
      this.reflections.push(reflection);
    }
    return Result.ok(undefined);
  }

  async findReflectionById(id: string): Promise<Result<HanseiReflection | null, Error>> {
    return Result.ok(this.reflections.find((r) => r.id === id) || null);
  }

  async findReflectionByDate(date: string): Promise<Result<HanseiReflection | null, Error>> {
    return Result.ok(this.reflections.find((r) => r.date === date) || null);
  }

  async findAllReflections(): Promise<Result<HanseiReflection[], Error>> {
    return Result.ok([...this.reflections]);
  }

  async getActiveDates(): Promise<Result<string[], Error>> {
    return Result.ok([...this.activeDates]);
  }

  async recordActiveDate(date: string): Promise<Result<void, Error>> {
    if (!this.activeDates.includes(date)) {
      this.activeDates.push(date);
    }
    return Result.ok(undefined);
  }
}

describe("useReflectionController", () => {
  let repo: MockReflectionRepo;
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    repo = new MockReflectionRepo();
    eventBus = new InMemoryEventBus();
  });

  it("initializes with default stats and loads data", async () => {
    repo.activeDates = ["2026-09-28"];
    const { result } = renderHook(() =>
      useReflectionController({
        repository: repo,
        eventBus,
        referenceDate: "2026-09-28",
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats.currentStreak).toBe(1);
    expect(result.current.stats.totalMicroWins).toBe(1);
  });

  it("handles modal open and close", () => {
    const { result } = renderHook(() =>
      useReflectionController({
        repository: repo,
        eventBus,
        autoLoad: false,
      })
    );

    expect(result.current.isHanseiModalOpen).toBe(false);

    act(() => {
      result.current.openHanseiModal();
    });
    expect(result.current.isHanseiModalOpen).toBe(true);

    act(() => {
      result.current.closeHanseiModal();
    });
    expect(result.current.isHanseiModalOpen).toBe(false);
  });

  it("records Hansei reflection and refreshes stats and history", async () => {
    const { result } = renderHook(() =>
      useReflectionController({
        repository: repo,
        eventBus,
        referenceDate: "2026-09-28",
      })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      const res = await result.current.recordHansei({
        date: "2026-09-28",
        winOfTheDay: "Menyelesaikan modul refleksi",
        tomorrowAdjustment: "Mulai integrasi",
      });
      expect(res.isOk()).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.reflections.length).toBe(1);
      expect(result.current.reflections[0].winOfTheDay).toBe("Menyelesaikan modul refleksi");
      expect(result.current.stats.currentStreak).toBe(1);
      expect(result.current.isHanseiModalOpen).toBe(false);
    });
  });

  it("updates stats automatically when MicroActionCompleted event is published", async () => {
    const { result } = renderHook(() =>
      useReflectionController({
        repository: repo,
        eventBus,
        referenceDate: "2026-09-28",
      })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.currentStreak).toBe(0);

    // Publish MicroActionCompleted
    await act(async () => {
      await eventBus.publish({
        eventId: "test-act-1",
        occurredAt: new Date("2026-09-28T10:00:00Z"),
        eventName: "MicroActionCompleted",
        payload: {
          microActionId: "act-1",
          completedAt: new Date("2026-09-28T10:00:00Z"),
        },
      });
    });

    await waitFor(() => {
      expect(result.current.stats.currentStreak).toBe(1);
      expect(result.current.stats.totalMicroWins).toBe(1);
    });
  });
});
