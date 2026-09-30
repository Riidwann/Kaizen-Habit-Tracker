import { TodoItem } from "./TodoItem";

export interface TodoRepositoryPort {
  getAll(): Promise<TodoItem[]>;
  findById(id: string): Promise<TodoItem | null>;
  save(todo: TodoItem): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
