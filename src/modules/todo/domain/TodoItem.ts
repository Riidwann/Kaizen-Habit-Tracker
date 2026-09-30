import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export type TodoPriority = "low" | "medium" | "high";

export interface TodoItemProps {
  id?: string;
  title: string;
  priority?: TodoPriority;
  dueDate?: string | null;
  isCompleted?: boolean;
  completedAt?: string | null;
  createdAt?: string | Date;
}

export interface TodoItemJSON {
  id: string;
  title: string;
  priority: TodoPriority;
  dueDate: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
}

export class TodoItem extends BaseEntity<string> {
  private _title: string;
  private _priority: TodoPriority;
  private _dueDate: string | null;
  private _isCompleted: boolean;
  private _completedAt: string | null;

  private constructor(props: TodoItemProps) {
    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `todo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
    const createdAtDate = props.createdAt
      ? typeof props.createdAt === "string"
        ? new Date(props.createdAt)
        : props.createdAt
      : new Date();

    super(id, createdAtDate);

    this._title = props.title.trim();
    this._priority = props.priority || "medium";
    this._dueDate = props.dueDate || null;
    this._isCompleted = Boolean(props.isCompleted);
    this._completedAt = props.completedAt || null;
  }

  public get title(): string {
    return this._title;
  }

  public get priority(): TodoPriority {
    return this._priority;
  }

  public get dueDate(): string | null {
    return this._dueDate;
  }

  public get isCompleted(): boolean {
    return this._isCompleted;
  }

  public get completedAt(): string | null {
    return this._completedAt;
  }

  public toggleComplete(): void {
    this._isCompleted = !this._isCompleted;
    this._completedAt = this._isCompleted ? new Date().toISOString() : null;
  }

  public static create(props: TodoItemProps): Result<TodoItem, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Judul tugas tidak boleh kosong");
    }
    return Result.ok(new TodoItem(props));
  }

  public toJSON(): TodoItemJSON {
    return {
      id: this.id,
      title: this._title,
      priority: this._priority,
      dueDate: this._dueDate,
      isCompleted: this._isCompleted,
      completedAt: this._completedAt,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
