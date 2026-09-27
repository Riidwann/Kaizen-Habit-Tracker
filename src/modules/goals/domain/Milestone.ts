import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export interface MilestoneProps {
  id: string;
  goalId: string;
  title: string;
  order: number;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Milestone extends BaseEntity<string> {
  private _goalId: string;
  private _title: string;
  private _order: number;
  private _isCompleted: boolean;

  constructor(props: MilestoneProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._goalId = props.goalId;
    this._title = props.title;
    this._order = props.order;
    this._isCompleted = props.isCompleted ?? false;
  }

  public static create(
    goalId: string,
    title: string,
    order: number,
    id?: string
  ): Result<Milestone, string> {
    if (!title || title.trim().length === 0) {
      return Result.err("Milestone title cannot be empty");
    }

    const milestoneId =
      id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `milestone-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

    return Result.ok(
      new Milestone({
        id: milestoneId,
        goalId,
        title: title.trim(),
        order,
        isCompleted: false,
      })
    );
  }

  public get goalId(): string {
    return this._goalId;
  }

  public get title(): string {
    return this._title;
  }

  public get order(): number {
    return this._order;
  }

  public get isCompleted(): boolean {
    return this._isCompleted;
  }

  public markComplete(): void {
    this._isCompleted = true;
  }

  public markIncomplete(): void {
    this._isCompleted = false;
  }

  public toggleComplete(): void {
    this._isCompleted = !this._isCompleted;
  }

  public updateTitle(title: string): Result<void, string> {
    if (!title || title.trim().length === 0) {
      return Result.err("Milestone title cannot be empty");
    }
    this._title = title.trim();
    return Result.ok(undefined);
  }

  public updateOrder(order: number): void {
    this._order = order;
  }
}
