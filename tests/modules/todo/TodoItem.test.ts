import { describe, it, expect } from "vitest";
import { TodoItem } from "@/modules/todo/domain/TodoItem";

describe("TodoItem Domain Entity", () => {
  it("creates a valid todo item", () => {
    const res = TodoItem.create({
      title: "Membeli buku jurnal",
      priority: "high",
      dueDate: "2026-10-05",
    });
    expect(res.isOk()).toBe(true);
    const todo = res.unwrap();
    expect(todo.title).toBe("Membeli buku jurnal");
    expect(todo.priority).toBe("high");
    expect(todo.isCompleted).toBe(false);
    expect(todo.completedAt).toBeNull();
  });

  it("fails if title is empty or whitespace", () => {
    const res = TodoItem.create({ title: "   " });
    expect(res.isErr()).toBe(true);
    expect(res.getError()).toBe("Judul tugas tidak boleh kosong");
  });

  it("toggles completion status and sets completedAt", () => {
    const todo = TodoItem.create({ title: "Valid title" }).unwrap();
    todo.toggleComplete();
    expect(todo.isCompleted).toBe(true);
    expect(todo.completedAt).not.toBeNull();

    todo.toggleComplete();
    expect(todo.isCompleted).toBe(false);
    expect(todo.completedAt).toBeNull();
  });

  it("serializes to JSON correctly", () => {
    const todo = TodoItem.create({
      title: "Task with JSON",
      priority: "low",
      dueDate: "2026-11-01",
    }).unwrap();
    const json = todo.toJSON();
    expect(json.id).toBe(todo.id);
    expect(json.title).toBe("Task with JSON");
    expect(json.priority).toBe("low");
    expect(json.dueDate).toBe("2026-11-01");
    expect(json.isCompleted).toBe(false);
    expect(json.completedAt).toBeNull();
    expect(typeof json.createdAt).toBe("string");
  });
});
