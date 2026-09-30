import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export interface RoutineScheduleProps {
  id?: string;
  title: string;
  time: string; // HH:mm
  daysOfWeek: number[]; // 0..6 (0=Minggu, 1=Senin, ..., 6=Sabtu)
  lastCompletedDate?: string | null;
  createdAt?: string | Date;
}

export interface RoutineScheduleJSON {
  id: string;
  title: string;
  time: string;
  daysOfWeek: number[];
  lastCompletedDate: string | null;
  createdAt: string;
}

export class RoutineSchedule extends BaseEntity<string> {
  private _title: string;
  private _time: string;
  private _daysOfWeek: number[];
  private _lastCompletedDate: string | null;

  private constructor(props: RoutineScheduleProps) {
    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `routine_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
    const createdAtDate = props.createdAt
      ? typeof props.createdAt === "string"
        ? new Date(props.createdAt)
        : props.createdAt
      : new Date();

    super(id, createdAtDate);

    this._title = props.title.trim();
    this._time = props.time;
    this._daysOfWeek = props.daysOfWeek;
    this._lastCompletedDate = props.lastCompletedDate || null;
  }

  public get title(): string {
    return this._title;
  }

  public get time(): string {
    return this._time;
  }

  public get daysOfWeek(): number[] {
    return this._daysOfWeek;
  }

  public get lastCompletedDate(): string | null {
    return this._lastCompletedDate;
  }

  public get isCompletedToday(): boolean {
    const today = new Date().toISOString().split("T")[0];
    return this._lastCompletedDate === today;
  }

  public toggleCompleteToday(): void {
    const today = new Date().toISOString().split("T")[0];
    if (this.isCompletedToday) {
      this._lastCompletedDate = null;
    } else {
      this._lastCompletedDate = today;
    }
  }

  public static create(props: RoutineScheduleProps): Result<RoutineSchedule, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Nama rutinitas tidak boleh kosong");
    }
    if (!props.time || !/^\d{2}:\d{2}$/.test(props.time)) {
      return Result.err("Format jam harus HH:mm");
    }
    if (!props.daysOfWeek || props.daysOfWeek.length === 0) {
      return Result.err("Pilih minimal 1 hari aktif");
    }
    return Result.ok(new RoutineSchedule(props));
  }

  public toJSON(): RoutineScheduleJSON {
    return {
      id: this.id,
      title: this._title,
      time: this._time,
      daysOfWeek: this._daysOfWeek,
      lastCompletedDate: this._lastCompletedDate,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
