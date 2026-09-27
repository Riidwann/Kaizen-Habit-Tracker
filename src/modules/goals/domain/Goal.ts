import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";
import { EmotionalAnchor } from "./EmotionalAnchor";
import { Milestone } from "./Milestone";
import { GoalCategory } from "./GoalCategory";

export type GoalStatus = "active" | "paused" | "achieved";

export interface GoalProps {
  id: string;
  title: string;
  whyStatement: EmotionalAnchor;
  category: GoalCategory;
  status?: GoalStatus;
  milestones?: Milestone[];
  microAction?: string;
  scaleDownFallback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGoalProps {
  id?: string;
  title: string;
  whyStatement: EmotionalAnchor;
  category: GoalCategory;
  milestones?: Milestone[];
  microAction?: string;
  scaleDownFallback?: string;
}

export class Goal extends BaseEntity<string> {
  private _title: string;
  private _whyStatement: EmotionalAnchor;
  private _category: GoalCategory;
  private _status: GoalStatus;
  private _milestones: Milestone[];
  private _microAction?: string;
  private _scaleDownFallback?: string;

  constructor(props: GoalProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._title = props.title;
    this._whyStatement = props.whyStatement;
    this._category = props.category;
    this._status = props.status ?? "active";
    this._milestones = props.milestones ? [...props.milestones] : [];
    this._microAction = props.microAction;
    this._scaleDownFallback = props.scaleDownFallback;
  }

  public static create(props: CreateGoalProps): Result<Goal, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Goal title cannot be empty");
    }

    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

    const goal = new Goal({
      id,
      title: props.title.trim(),
      whyStatement: props.whyStatement,
      category: props.category,
      status: "active",
      milestones: props.milestones ?? [],
      microAction: props.microAction?.trim(),
      scaleDownFallback: props.scaleDownFallback?.trim(),
    });

    return Result.ok(goal);
  }

  public get title(): string {
    return this._title;
  }

  public get whyStatement(): EmotionalAnchor {
    return this._whyStatement;
  }

  public get category(): GoalCategory {
    return this._category;
  }

  public get status(): GoalStatus {
    return this._status;
  }

  public get milestones(): Milestone[] {
    return [...this._milestones].sort((a, b) => a.order - b.order);
  }

  public get microAction(): string | undefined {
    return this._microAction;
  }

  public get scaleDownFallback(): string | undefined {
    return this._scaleDownFallback;
  }

  public updateTitle(newTitle: string): Result<void, string> {
    if (!newTitle || newTitle.trim().length === 0) {
      return Result.err("Goal title cannot be empty");
    }
    this._title = newTitle.trim();
    return Result.ok(undefined);
  }

  public updateCategory(category: GoalCategory): void {
    this._category = category;
  }

  public updateWhy(whyStatement: EmotionalAnchor): void {
    this._whyStatement = whyStatement;
  }

  public updateStatus(status: GoalStatus): void {
    this._status = status;
  }

  public updateMicroAction(microAction?: string, scaleDownFallback?: string): void {
    this._microAction = microAction?.trim();
    this._scaleDownFallback = scaleDownFallback?.trim();
  }

  public addMilestone(milestone: Milestone): Result<void, string> {
    const existing = this._milestones.find((m) => m.id === milestone.id);
    if (existing) {
      return Result.err(`Milestone with id ${milestone.id} already exists`);
    }
    this._milestones.push(milestone);
    return Result.ok(undefined);
  }

  public removeMilestone(milestoneId: string): Result<void, string> {
    const initialLen = this._milestones.length;
    this._milestones = this._milestones.filter((m) => m.id !== milestoneId);
    if (this._milestones.length === initialLen) {
      return Result.err(`Milestone with id ${milestoneId} not found`);
    }
    return Result.ok(undefined);
  }

  public toggleMilestone(milestoneId: string): Result<boolean, string> {
    const milestone = this._milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return Result.err(`Milestone with id ${milestoneId} not found`);
    }
    milestone.toggleComplete();
    return Result.ok(milestone.isCompleted);
  }

  public getProgress(): number {
    if (this._milestones.length === 0) {
      return 0;
    }
    const completedCount = this._milestones.filter((m) => m.isCompleted).length;
    return Math.round((completedCount / this._milestones.length) * 100);
  }
}
