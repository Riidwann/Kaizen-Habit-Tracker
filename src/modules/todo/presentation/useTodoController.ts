import { useState, useEffect, useCallback, useMemo } from "react";
import { TodoItem, TodoPriority } from "../domain/TodoItem";
import { TodoRepositoryPort } from "../domain/TodoRepositoryPort";
import { LocalStorageTodoRepository } from "../infrastructure/LocalStorageTodoRepository";
import { TodoCompletedEvent } from "../domain/events/TodoCompletedEvent";
import { InMemoryEventBus, inMemoryEventBus as defaultEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export type TodoFilter = "all" | "active" | "completed";

export interface AddTodoInput {
  title: string;
  priority?: TodoPriority;
  dueDate?: string | null;
}

export interface UseTodoControllerProps {
  repository?: TodoRepositoryPort;
  eventBus?: InMemoryEventBus;
  enabled?: boolean;
}

export function useTodoController(props?: UseTodoControllerProps) {
  const repo = useMemo(
    () => props?.repository || new LocalStorageTodoRepository(),
    [props?.repository]
  );
  const eventBus = props?.eventBus || defaultEventBus;

  const [rawTodos, setRawTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [isLoading, setIsLoading] = useState(props?.enabled !== false);
  const [error, setError] = useState<string | null>(null);

  const refreshTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await repo.getAll();
      setRawTodos(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat daftar tugas");
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    if (props?.enabled !== false) {
      refreshTodos();
    }
  }, [refreshTodos, props?.enabled]);

  const activeTodosCount = useMemo(
    () => rawTodos.filter((t) => !t.isCompleted).length,
    [rawTodos]
  );

  const completedTodosCount = useMemo(
    () => rawTodos.filter((t) => t.isCompleted).length,
    [rawTodos]
  );

  const todos = useMemo(() => {
    if (filter === "active") return rawTodos.filter((t) => !t.isCompleted);
    if (filter === "completed") return rawTodos.filter((t) => t.isCompleted);
    return rawTodos;
  }, [rawTodos, filter]);

  const addTodo = useCallback(
    async (input: AddTodoInput): Promise<boolean> => {
      setError(null);
      const res = TodoItem.create({
        title: input.title,
        priority: input.priority,
        dueDate: input.dueDate,
      });
      if (res.isErr()) {
        setError(res.getError() || "Gagal membuat tugas");
        return false;
      }
      const newTodo = res.unwrap();
      const saved = await repo.save(newTodo);
      if (saved) {
        await refreshTodos();
        return true;
      }
      setError("Gagal menyimpan tugas");
      return false;
    },
    [repo, refreshTodos]
  );

  const toggleCompleteTodo = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);
      const target = await repo.findById(id);
      if (!target) {
        setError("Tugas tidak ditemukan");
        return false;
      }

      target.toggleComplete();
      const saved = await repo.save(target);
      if (saved) {
        if (target.isCompleted) {
          await eventBus.publish(
            new TodoCompletedEvent({
              todoId: target.id,
              title: target.title,
              completedAt: target.completedAt || new Date().toISOString(),
            })
          );
        }
        await refreshTodos();
        return true;
      }
      setError("Gagal memperbarui status tugas");
      return false;
    },
    [repo, eventBus, refreshTodos]
  );

  const deleteTodo = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);
      const deleted = await repo.delete(id);
      if (deleted) {
        await refreshTodos();
        return true;
      }
      setError("Gagal menghapus tugas");
      return false;
    },
    [repo, refreshTodos]
  );

  return {
    todos,
    allTodos: rawTodos,
    activeTodosCount,
    completedTodosCount,
    filter,
    setFilter,
    addTodo,
    toggleCompleteTodo,
    deleteTodo,
    isLoading,
    error,
    refreshTodos,
  };
}
