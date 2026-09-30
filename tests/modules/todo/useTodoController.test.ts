import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodoController } from "@/modules/todo/presentation/useTodoController";
import { LocalStorageTodoRepository } from "@/modules/todo/infrastructure/LocalStorageTodoRepository";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { TodoCompletedEvent } from "@/modules/todo/domain/events/TodoCompletedEvent";

describe("useTodoController", () => {
  let repo: LocalStorageTodoRepository;
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageTodoRepository("kaizen_todos_hook_test");
    eventBus = new InMemoryEventBus();
  });

  it("adds a todo and updates counts", async () => {
    const { result } = renderHook(() =>
      useTodoController({ repository: repo, eventBus })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.addTodo({
        title: "Tugas Baru",
        priority: "high",
        dueDate: "2026-10-10",
      });
    });

    expect(success).toBe(true);
    expect(result.current.todos.length).toBe(1);
    expect(result.current.activeTodosCount).toBe(1);
    expect(result.current.completedTodosCount).toBe(0);
    expect(result.current.todos[0].title).toBe("Tugas Baru");
    expect(result.current.todos[0].priority).toBe("high");
  });

  it("toggles a todo to completed and publishes TodoCompletedEvent", async () => {
    const publishedEvents: TodoCompletedEvent[] = [];
    eventBus.subscribe<TodoCompletedEvent>("TodoCompleted", (event) => {
      publishedEvents.push(event);
    });

    const { result } = renderHook(() =>
      useTodoController({ repository: repo, eventBus })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTodo({ title: "Belajar Next.js" });
    });

    const todoId = result.current.todos[0].id;

    await act(async () => {
      await result.current.toggleCompleteTodo(todoId);
    });

    expect(result.current.activeTodosCount).toBe(0);
    expect(result.current.completedTodosCount).toBe(1);
    expect(publishedEvents.length).toBe(1);
    expect(publishedEvents[0].eventName).toBe("TodoCompleted");
    expect(publishedEvents[0].payload.todoId).toBe(todoId);
    expect(publishedEvents[0].payload.title).toBe("Belajar Next.js");

    // Toggle back to active should not publish another completion event
    await act(async () => {
      await result.current.toggleCompleteTodo(todoId);
    });

    expect(result.current.activeTodosCount).toBe(1);
    expect(result.current.completedTodosCount).toBe(0);
    expect(publishedEvents.length).toBe(1);
  });

  it("filters todos by status", async () => {
    const { result } = renderHook(() =>
      useTodoController({ repository: repo, eventBus })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTodo({ title: "Tugas 1" });
      await result.current.addTodo({ title: "Tugas 2" });
    });

    const firstId = result.current.todos[0].id;
    await act(async () => {
      await result.current.toggleCompleteTodo(firstId);
    });

    expect(result.current.todos.length).toBe(2);

    act(() => {
      result.current.setFilter("active");
    });
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].isCompleted).toBe(false);

    act(() => {
      result.current.setFilter("completed");
    });
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].isCompleted).toBe(true);

    act(() => {
      result.current.setFilter("all");
    });
    expect(result.current.todos.length).toBe(2);
  });

  it("deletes a todo", async () => {
    const { result } = renderHook(() =>
      useTodoController({ repository: repo, eventBus })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTodo({ title: "Tugas Akan Dihapus" });
    });

    expect(result.current.todos.length).toBe(1);
    const idToDelete = result.current.todos[0].id;

    await act(async () => {
      await result.current.deleteTodo(idToDelete);
    });

    expect(result.current.todos.length).toBe(0);
    expect(result.current.activeTodosCount).toBe(0);
  });
});
