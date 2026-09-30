import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageTodoRepository } from "@/modules/todo/infrastructure/LocalStorageTodoRepository";
import { TodoItem } from "@/modules/todo/domain/TodoItem";

describe("LocalStorageTodoRepository", () => {
  let repo: LocalStorageTodoRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageTodoRepository("kaizen_todos");
  });

  it("returns empty array when no todos exist", async () => {
    const todos = await repo.getAll();
    expect(todos).toEqual([]);
  });

  it("saves and retrieves todos", async () => {
    const todo1 = TodoItem.create({ title: "Tugas 1", priority: "high" }).unwrap();
    const todo2 = TodoItem.create({ title: "Tugas 2", priority: "medium" }).unwrap();

    const ok1 = await repo.save(todo1);
    const ok2 = await repo.save(todo2);

    expect(ok1).toBe(true);
    expect(ok2).toBe(true);

    const all = await repo.getAll();
    expect(all).toHaveLength(2);
    expect(all.some((t) => t.id === todo1.id)).toBe(true);
    expect(all.some((t) => t.id === todo2.id)).toBe(true);
  });

  it("finds a todo by id", async () => {
    const todo = TodoItem.create({ title: "Tugas Unik" }).unwrap();
    await repo.save(todo);

    const found = await repo.findById(todo.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe("Tugas Unik");

    const notFound = await repo.findById("non-existent-id");
    expect(notFound).toBeNull();
  });

  it("updates an existing todo on save", async () => {
    const todo = TodoItem.create({ title: "Tugas Awal" }).unwrap();
    await repo.save(todo);

    todo.toggleComplete();
    await repo.save(todo);

    const found = await repo.findById(todo.id);
    expect(found?.isCompleted).toBe(true);
    expect(found?.completedAt).not.toBeNull();
  });

  it("deletes a todo by id", async () => {
    const todo = TodoItem.create({ title: "Tugas Dihapus" }).unwrap();
    await repo.save(todo);

    const deleteOk = await repo.delete(todo.id);
    expect(deleteOk).toBe(true);

    const all = await repo.getAll();
    expect(all.some((t) => t.id === todo.id)).toBe(false);
  });
});
