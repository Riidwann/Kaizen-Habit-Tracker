import { ValueObject } from "@/shared/domain/ValueObject";

export interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  isGracePeriod: boolean;
  lastActiveDate: string;
}

export class StreakCounter extends ValueObject<StreakCounterProps> {
  constructor(props: StreakCounterProps) {
    super({
      currentStreak: Math.max(0, props.currentStreak),
      longestStreak: Math.max(0, props.longestStreak),
      isGracePeriod: Boolean(props.isGracePeriod),
      lastActiveDate: props.lastActiveDate || "",
    });
  }

  public get currentStreak(): number {
    return this.props.currentStreak;
  }

  public get longestStreak(): number {
    return this.props.longestStreak;
  }

  public get isGracePeriod(): boolean {
    return this.props.isGracePeriod;
  }

  public get lastActiveDate(): string {
    return this.props.lastActiveDate;
  }

  public static empty(): StreakCounter {
    return new StreakCounter({
      currentStreak: 0,
      longestStreak: 0,
      isGracePeriod: false,
      lastActiveDate: "",
    });
  }

  public static create(props: StreakCounterProps): StreakCounter {
    return new StreakCounter(props);
  }
}
