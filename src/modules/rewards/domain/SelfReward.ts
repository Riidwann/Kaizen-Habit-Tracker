import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export type RewardStatus = "pending" | "earned" | "claimed";

export interface SelfRewardProps {
  id?: string;
  title: string;
  targetStreak: number;
  status?: RewardStatus;
  earnedDate?: string | null;
  claimedDate?: string | null;
  createdAt?: string | Date;
}

export interface SelfRewardJSON {
  id: string;
  title: string;
  targetStreak: number;
  status: RewardStatus;
  earnedDate: string | null;
  claimedDate: string | null;
  createdAt: string;
}

export class SelfReward extends BaseEntity<string> {
  private _title: string;
  private _targetStreak: number;
  private _status: RewardStatus;
  private _earnedDate: string | null;
  private _claimedDate: string | null;

  private constructor(props: SelfRewardProps) {
    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `reward_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

    const createdAtDate = props.createdAt
      ? typeof props.createdAt === "string"
        ? new Date(props.createdAt)
        : props.createdAt
      : new Date();

    super(id, createdAtDate);

    this._title = props.title.trim();
    this._targetStreak = props.targetStreak > 0 ? props.targetStreak : 7;
    this._status = props.status || "pending";
    this._earnedDate = props.earnedDate || null;
    this._claimedDate = props.claimedDate || null;
  }

  public get title(): string {
    return this._title;
  }

  public get targetStreak(): number {
    return this._targetStreak;
  }

  public get status(): RewardStatus {
    return this._status;
  }

  public get earnedDate(): string | null {
    return this._earnedDate;
  }

  public get claimedDate(): string | null {
    return this._claimedDate;
  }

  public updateTitle(newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed.length > 0) {
      this._title = trimmed;
    }
  }

  public checkEligibility(currentStreak: number): boolean {
    if (this._status === "pending" && currentStreak >= this._targetStreak) {
      this._status = "earned";
      this._earnedDate = new Date().toISOString().split("T")[0];
      return true;
    }
    return false;
  }

  public claim(): void {
    this._status = "claimed";
    this._claimedDate = new Date().toISOString().split("T")[0];
  }

  public static create(props: SelfRewardProps): Result<SelfReward, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Nama self-reward tidak boleh kosong");
    }
    return Result.ok(new SelfReward(props));
  }

  public toJSON(): SelfRewardJSON {
    return {
      id: this.id,
      title: this._title,
      targetStreak: this._targetStreak,
      status: this._status,
      earnedDate: this._earnedDate,
      claimedDate: this._claimedDate,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
