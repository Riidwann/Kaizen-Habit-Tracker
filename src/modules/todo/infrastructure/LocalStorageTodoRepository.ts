import { TodoRepositoryPort } from "../domain/TodoRepositoryPort";
import { TodoItem, TodoItemProps } from "../domain/TodoItem";

const DEFAULT_STORAGE_KEY = "kaizen_todos";

export class LocalStorageTodoRepository implements TodoRepositoryPort {
  private readonly storageKey: string;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  public async getAll(): Promise<TodoItem[]> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      const items: TodoItemProps[] = JSON.parse(raw);
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          const res = TodoItem.create(item);
          return res.isOk() ? res.unwrap() : null;
        })
        .filter((item): item is TodoItem => item !== null);
    } catch {
      return [];
    }
  }

  public async findById(id: string): Promise<TodoItem | null> {
    const todos = await this.getAll();
    return todos.find((t) => t.id === id) || null;
  }

  public async save(todo: TodoItem): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const todos = await this.getAll();
    const existingIndex = todos.findIndex((t) => t.id === todo.id);
    if (existingIndex >= 0) {
      todos[existingIndex] = todo;
    } else {
      todos.push(todo);
    }
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(todos.map((t) => t.toJSON()))
    );
    return true;
  }

  public async delete(id: string): Promise<boolean> {
    if (typeof window === "undefined" && typeof localStorage === "undefined") {
      return false;
    }
    const todos = await this.getAll();
    const filtered = todos.filter((t) => t.id !== id);
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filtered.map((t) => t.toJSON()))
    );
    return true;
  }
}
