import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRoutineController } from "@/modules/routines/presentation/useRoutineController";
import { LocalStorageRoutineRepository } from "@/modules/routines/infrastructure/LocalStorageRoutineRepository";

describe("useRoutineController", () => {
  let repo: LocalStorageRoutineRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRoutineRepository("kaizen_routines_hook_test");
  });

  it("adds routines and sorts them chronologically by time", async () => {
    const { result } = renderHook(() =>
      useRoutineController({ repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addRoutine({
        title: "Tidur Siang",
        time: "13:00",
        daysOfWeek: [1, 2, 3],
      });
      await result.current.addRoutine({
        title: "Bangun Pagi",
        time: "05:00",
        daysOfWeek: [1, 2, 3],
      });
      await result.current.addRoutine({
        title: "Makan Malam",
        time: "19:00",
        daysOfWeek: [1, 2, 3],
      });
    });

    expect(result.current.routines).toHaveLength(3);
    expect(result.current.routines[0].time).toBe("05:00");
    expect(result.current.routines[1].time).toBe("13:00");
    expect(result.current.routines[2].time).toBe("19:00");
  });

  it("filters todayRoutines and calculates remaining/completed counts", async () => {
    const todayDay = new Date().getDay();
    const otherDay = (todayDay + 1) % 7;

    const { result } = renderHook(() =>
      useRoutineController({ repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addRoutine({
        title: "Rutinitas Hari Ini",
        time: "08:00",
        daysOfWeek: [todayDay],
      });
      await result.current.addRoutine({
        title: "Rutinitas Hari Lain",
        time: "09:00",
        daysOfWeek: [otherDay],
      });
    });

    expect(result.current.routines).toHaveLength(2);
    expect(result.current.todayRoutines).toHaveLength(1);
    expect(result.current.todayRoutines[0].title).toBe("Rutinitas Hari Ini");
    expect(result.current.remainingCountToday).toBe(1);
    expect(result.current.completedCountToday).toBe(0);

    const routineId = result.current.todayRoutines[0].id;
    await act(async () => {
      await result.current.toggleCompleteToday(routineId);
    });

    expect(result.current.remainingCountToday).toBe(0);
    expect(result.current.completedCountToday).toBe(1);
    expect(result.current.todayRoutines[0].isCompletedToday).toBe(true);

    // Toggle back
    await act(async () => {
      await result.current.toggleCompleteToday(routineId);
    });
    expect(result.current.remainingCountToday).toBe(1);
    expect(result.current.completedCountToday).toBe(0);
    expect(result.current.todayRoutines[0].isCompletedToday).toBe(false);
  });

  it("handles validation error when adding routine", async () => {
    const { result } = renderHook(() =>
      useRoutineController({ repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success = true;
    await act(async () => {
      success = await result.current.addRoutine({
        title: "",
        time: "08:00",
        daysOfWeek: [1],
      });
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe("Nama rutinitas tidak boleh kosong");
    expect(result.current.routines).toHaveLength(0);
  });

  it("deletes a routine", async () => {
    const { result } = renderHook(() =>
      useRoutineController({ repository: repo })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addRoutine({
        title: "Rutinitas Hapus",
        time: "10:00",
        daysOfWeek: [0, 1, 2],
      });
    });

    expect(result.current.routines).toHaveLength(1);
    const id = result.current.routines[0].id;

    await act(async () => {
      await result.current.deleteRoutine(id);
    });

    expect(result.current.routines).toHaveLength(0);
  });
});
