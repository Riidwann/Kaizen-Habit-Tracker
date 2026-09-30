import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageRoutineRepository } from "@/modules/routines/infrastructure/LocalStorageRoutineRepository";
import { RoutineSchedule } from "@/modules/routines/domain/RoutineSchedule";

describe("LocalStorageRoutineRepository", () => {
  let repo: LocalStorageRoutineRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRoutineRepository("kaizen_routines");
  });

  it("returns empty array when no routines exist", async () => {
    const routines = await repo.getAll();
    expect(routines).toEqual([]);
  });

  it("saves and retrieves routines", async () => {
    const routine1 = RoutineSchedule.create({
      title: "Olahraga Pagi",
      time: "06:00",
      daysOfWeek: [1, 2, 3, 4, 5],
    }).unwrap();
    const routine2 = RoutineSchedule.create({
      title: "Membaca Buku",
      time: "21:00",
      daysOfWeek: [0, 6],
    }).unwrap();

    const ok1 = await repo.save(routine1);
    const ok2 = await repo.save(routine2);

    expect(ok1).toBe(true);
    expect(ok2).toBe(true);

    const all = await repo.getAll();
    expect(all).toHaveLength(2);
    expect(all.some((r) => r.id === routine1.id)).toBe(true);
    expect(all.some((r) => r.id === routine2.id)).toBe(true);
  });

  it("finds a routine by id", async () => {
    const routine = RoutineSchedule.create({
      title: "Meditasi",
      time: "05:30",
      daysOfWeek: [1, 3, 5],
    }).unwrap();
    await repo.save(routine);

    const found = await repo.findById(routine.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe("Meditasi");
    expect(found?.time).toBe("05:30");

    const notFound = await repo.findById("non-existent-id");
    expect(notFound).toBeNull();
  });

  it("updates an existing routine on save", async () => {
    const routine = RoutineSchedule.create({
      title: "Jalan Santai",
      time: "17:00",
      daysOfWeek: [0, 6],
    }).unwrap();
    await repo.save(routine);

    routine.toggleCompleteToday();
    await repo.save(routine);

    const found = await repo.findById(routine.id);
    expect(found?.isCompletedToday).toBe(true);
  });

  it("deletes a routine by id", async () => {
    const routine = RoutineSchedule.create({
      title: "Rutinitas Dihapus",
      time: "12:00",
      daysOfWeek: [1, 2],
    }).unwrap();
    await repo.save(routine);

    const deleteOk = await repo.delete(routine.id);
    expect(deleteOk).toBe(true);

    const all = await repo.getAll();
    expect(all.some((r) => r.id === routine.id)).toBe(false);
  });
});
