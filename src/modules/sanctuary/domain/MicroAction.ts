import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export interface MicroActionProps {
  id?: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  scaleDownTitle?: string;
  estimatedMinutes: number;
  isScaledDown?: boolean;
  isActiveToday?: boolean;
  isCompletedToday?: boolean;
  completedAt?: Date;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MicroAction extends BaseEntity<string> {
  public readonly goalId: string;
  public readonly milestoneId?: string;
  public title: string;
  public scaleDownTitle: string;
  public estimatedMinutes: number;
  public isScaledDown: boolean;
  public isActiveToday: boolean;
  public isCompletedToday: boolean;
  public completedAt?: Date;
  public category?: string;

  constructor(props: MicroActionProps) {
    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
    super(id, props.createdAt, props.updatedAt);

    this.goalId = props.goalId;
    this.milestoneId = props.milestoneId;
    this.title = props.title;
    this.scaleDownTitle = props.scaleDownTitle || props.title;
    this.estimatedMinutes = props.estimatedMinutes;
    this.isScaledDown = props.isScaledDown ?? false;
    this.isActiveToday = props.isActiveToday ?? true;
    this.isCompletedToday = props.isCompletedToday ?? false;
    this.completedAt = props.completedAt;
    this.category = props.category;
  }

  public static validateDuration(minutes: number): boolean {
    return typeof minutes === "number" && !isNaN(minutes) && minutes > 0 && minutes <= 2;
  }

  public static create(props: MicroActionProps): Result<MicroAction, string> {
    const trimmedTitle = props.title ? props.title.trim() : "";
    if (!trimmedTitle) {
      return Result.err("Micro-action title cannot be empty");
    }

    if (typeof props.estimatedMinutes !== "number" || isNaN(props.estimatedMinutes) || props.estimatedMinutes <= 0) {
      return Result.err("Estimated minutes must be a valid number greater than 0");
    }

    if (props.estimatedMinutes > 2) {
      return Result.err("Estimated minutes cannot exceed 2 minutes (2-minute rule)");
    }

    const trimmedScaleDown = props.scaleDownTitle ? props.scaleDownTitle.trim() : trimmedTitle;

    const action = new MicroAction({
      ...props,
      title: trimmedTitle,
      scaleDownTitle: trimmedScaleDown,
    });

    return Result.ok(action);
  }

  public toggleScaleDown(): void {
    this.isScaledDown = !this.isScaledDown;
    (this as any).updatedAt = new Date();
  }

  public complete(): void {
    this.isCompletedToday = true;
    this.completedAt = new Date();
    (this as any).updatedAt = new Date();
  }

  public uncomplete(): void {
    this.isCompletedToday = false;
    this.completedAt = undefined;
    (this as any).updatedAt = new Date();
  }

  public setActiveToday(active: boolean): void {
    this.isActiveToday = active;
    (this as any).updatedAt = new Date();
  }

  public updateTitle(newTitle: string): Result<void, string> {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      return Result.err("Title cannot be empty");
    }
    this.title = trimmed;
    (this as any).updatedAt = new Date();
    return Result.ok(undefined);
  }

  public updateScaleDownTitle(newTitle: string): Result<void, string> {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      return Result.err("Scale down title cannot be empty");
    }
    this.scaleDownTitle = trimmed;
    (this as any).updatedAt = new Date();
    return Result.ok(undefined);
  }
}
