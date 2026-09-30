import { describe, it, expect } from "vitest";
import { RoutineSchedule } from "@/modules/routines/domain/RoutineSchedule";

describe("RoutineSchedule Domain Entity", () => {
  it("creates a valid routine schedule", () => {
    const res = RoutineSchedule.create({
      title: "Olahraga Pagi 15 Menit",
      time: "06:30",
      daysOfWeek: [1, 2, 3, 4, 5],
    });
    expect(res.isOk()).toBe(true);
    const routine = res.unwrap();
    expect(routine.title).toBe("Olahraga Pagi 15 Menit");
    expect(routine.time).toBe("06:30");
    expect(routine.daysOfWeek).toEqual([1, 2, 3, 4, 5]);
    expect(routine.isCompletedToday).toBe(false);
    expect(routine.lastCompletedDate).toBeNull();
  });

  it("fails if title is empty or whitespace", () => {
    const res = RoutineSchedule.create({
      title: "   ",
      time: "08:00",
      daysOfWeek: [1],
    });
    expect(res.isErr()).toBe(true);
    expect(res.getError()).toBe("Nama rutinitas tidak boleh kosong");
  });

  it("fails if time format is invalid", () => {
    const res = RoutineSchedule.create({
      title: "Meditasi",
      time: "8:00", // not HH:mm
      daysOfWeek: [1],
    });
    expect(res.isErr()).toBe(true);
    expect(res.getError()).toBe("Format jam harus HH:mm");
  });

  it("fails if daysOfWeek is empty", () => {
    const res = RoutineSchedule.create({
      title: "Meditasi",
      time: "08:00",
      daysOfWeek: [],
    });
    expect(res.isErr()).toBe(true);
    expect(res.getError()).toBe("Pilih minimal 1 hari aktif");
  });

  it("evaluates isCompletedToday based on lastCompletedDate", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const routine = RoutineSchedule.create({
      title: "Membaca Buku",
      time: "20:00",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      lastCompletedDate: todayStr,
    }).unwrap();

    expect(routine.isCompletedToday).toBe(true);

    const oldRoutine = RoutineSchedule.create({
      title: "Membaca Buku",
      time: "20:00",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      lastCompletedDate: "2026-01-01",
    }).unwrap();

    expect(oldRoutine.isCompletedToday).toBe(false);
  });

  it("toggles completion today correctly", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const routine = RoutineSchedule.create({
      title: "Journaling",
      time: "21:00",
      daysOfWeek: [1, 2, 3],
    }).unwrap();

    expect(routine.isCompletedToday).toBe(false);

    routine.toggleCompleteToday();
    expect(routine.isCompletedToday).toBe(true);
    expect(routine.lastCompletedDate).toBe(todayStr);

    routine.toggleCompleteToday();
    expect(routine.isCompletedToday).toBe(false);
    expect(routine.lastCompletedDate).toBeNull();
  });

  it("serializes to JSON accurately", () => {
    const routine = RoutineSchedule.create({
      title: "Minum Air",
      time: "07:00",
      daysOfWeek: [0, 1],
    }).unwrap();

    const json = routine.toJSON();
    expect(json.id).toBe(routine.id);
    expect(json.title).toBe("Minum Air");
    expect(json.time).toBe("07:00");
    expect(json.daysOfWeek).toEqual([0, 1]);
  });
});
