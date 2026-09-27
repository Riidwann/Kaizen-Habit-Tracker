import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export interface HanseiReflectionProps {
  id?: string;
  date?: string; // YYYY-MM-DD
  winOfTheDay: string;
  tomorrowAdjustment: string;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class HanseiReflection extends BaseEntity<string> {
  public readonly date: string;
  public winOfTheDay: string;
  public tomorrowAdjustment: string;
  public readonly submittedAt: Date;

  constructor(props: HanseiReflectionProps) {
    const id =
      props.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `hansei_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
    super(id, props.createdAt, props.updatedAt);

    this.date = props.date || new Date().toISOString().split("T")[0];
    this.winOfTheDay = props.winOfTheDay;
    this.tomorrowAdjustment = props.tomorrowAdjustment;
    this.submittedAt = props.submittedAt || new Date();
  }

  public static create(props: HanseiReflectionProps): Result<HanseiReflection, string> {
    const trimmedWin = props.winOfTheDay ? props.winOfTheDay.trim() : "";
    if (!trimmedWin) {
      return Result.err("Win of the day cannot be empty");
    }

    const trimmedAdjustment = props.tomorrowAdjustment ? props.tomorrowAdjustment.trim() : "";
    if (!trimmedAdjustment) {
      return Result.err("Tomorrow adjustment cannot be empty");
    }

    let date = props.date ? props.date.trim() : new Date().toISOString().split("T")[0];
    if (props.date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Result.err("Invalid date format. Expected YYYY-MM-DD");
    }

    const reflection = new HanseiReflection({
      ...props,
      date,
      winOfTheDay: trimmedWin,
      tomorrowAdjustment: trimmedAdjustment,
      submittedAt: props.submittedAt || new Date(),
    });

    return Result.ok(reflection);
  }

  public updateContent(winOfTheDay: string, tomorrowAdjustment: string): Result<void, string> {
    const trimmedWin = winOfTheDay ? winOfTheDay.trim() : "";
    if (!trimmedWin) {
      return Result.err("Win of the day cannot be empty");
    }

    const trimmedAdjustment = tomorrowAdjustment ? tomorrowAdjustment.trim() : "";
    if (!trimmedAdjustment) {
      return Result.err("Tomorrow adjustment cannot be empty");
    }

    this.winOfTheDay = trimmedWin;
    this.tomorrowAdjustment = trimmedAdjustment;
    (this as any).updatedAt = new Date();

    return Result.ok(undefined);
  }
}
