import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import {
  SystemSnapshot,
  GoalProps,
  MicroActionProps,
  HanseiEntryProps,
  DailySanctuaryLogProps,
} from "../domain/SystemSnapshot";
import { GOAL_CATEGORIES } from "@/modules/goals/domain/GoalCategory";
import { Result } from "@/shared/domain/Result";
import {
  LocalStorageDriver,
  localStorageDriver as defaultStorageDriver,
} from "@/shared/infrastructure/LocalStorageDriver";

export interface BackupStorageKeys {
  goalsKey?: string;
  sanctuaryKey?: string;
  reflectionsKey?: string;
  dailyLogsKey?: string;
  activeDatesKey?: string;
  todosKey?: string;
  routinesKey?: string;
  rewardsKey?: string;
  customCategoriesKey?: string;
}

export class LocalStorageBackupRepository implements BackupRepositoryPort {
  private readonly driver: LocalStorageDriver;
  private readonly goalsKey: string;
  private readonly sanctuaryKey: string;
  private readonly reflectionsKey: string;
  private readonly dailyLogsKey: string;
  private readonly activeDatesKey: string;
  private readonly todosKey: string;
  private readonly routinesKey: string;
  private readonly rewardsKey: string;
  private readonly customCategoriesKey: string;

  constructor(
    driver: LocalStorageDriver = defaultStorageDriver,
    keys: BackupStorageKeys = {}
  ) {
    this.driver = driver;
    this.goalsKey = keys.goalsKey || "kaizen_goals";
    this.sanctuaryKey = keys.sanctuaryKey || "kaizen_sanctuary_actions";
    this.reflectionsKey = keys.reflectionsKey || "kaizen_reflections";
    this.dailyLogsKey = keys.dailyLogsKey || "kaizen_daily_logs";
    this.activeDatesKey = keys.activeDatesKey || "kaizen_active_dates";
    this.todosKey = keys.todosKey || "kaizen_todos";
    this.routinesKey = keys.routinesKey || "kaizen_routines";
    this.rewardsKey = keys.rewardsKey || "kaizen_self_rewards";
    this.customCategoriesKey = keys.customCategoriesKey || "kaizen_goal_categories";
  }

  public async getSnapshot(): Promise<Result<SystemSnapshot, Error>> {
    try {
      const goals = this.driver.getItem<GoalProps[]>(this.goalsKey, []) || [];
      const microActions =
        this.driver.getItem<MicroActionProps[]>(this.sanctuaryKey, []) || [];
      const hanseiEntries =
        this.driver.getItem<HanseiEntryProps[]>(this.reflectionsKey, []) || [];
      const dailyLogs =
        this.driver.getItem<DailySanctuaryLogProps[]>(this.dailyLogsKey, []) || [];
      const todos = this.driver.getItem<any[]>(this.todosKey, []) || [];
      const routines = this.driver.getItem<any[]>(this.routinesKey, []) || [];
      const rewards = this.driver.getItem<any[]>(this.rewardsKey, []) || [];
      const customCategories = this.driver.getItem<any[]>(this.customCategoriesKey, []) || [];

      const snapshot: SystemSnapshot = {
        version: "1.0.0",
        appName: "KaizenFlow",
        exportedAt: new Date().toISOString(),
        data: {
          goals,
          microActions,
          hanseiEntries,
          dailyLogs,
          todos,
          routines,
          rewards,
          customCategories,
        },
        todos,
        routines,
        rewards,
        customCategories,
      };

      return Result.ok(snapshot);
    } catch (err) {
      return Result.err(
        err instanceof Error
          ? err
          : new Error("Failed to export snapshot from local storage")
      );
    }
  }

  public async exportSnapshot(): Promise<Result<SystemSnapshot, Error>> {
    return this.getSnapshot();
  }

  public async restoreSnapshot(snapshot: SystemSnapshot): Promise<Result<void, Error>> {
    try {
      // Normalize goals to ensure whyText is present for LocalStorageGoalRepository
      const normalizedGoals = (snapshot.data?.goals || []).map((goal) => {
        let whyText = goal.whyText;
        if (!whyText && goal.whyStatement) {
          if (typeof goal.whyStatement === "string") {
            whyText = goal.whyStatement;
          } else if (
            typeof goal.whyStatement === "object" &&
            "whyText" in goal.whyStatement
          ) {
            whyText = (goal.whyStatement as { whyText: string }).whyText;
          }
        }
        return {
          ...goal,
          whyText: whyText || "Inspirasi Kaizen",
        };
      });

      const restoredTodos = snapshot.data?.todos ?? snapshot.todos ?? [];
      const restoredRoutines = snapshot.data?.routines ?? snapshot.routines ?? [];
      const restoredRewards = snapshot.data?.rewards ?? snapshot.rewards ?? [];
      const restoredCustomCategories =
        snapshot.data?.customCategories ??
        snapshot.customCategories ??
        Object.values(GOAL_CATEGORIES);

      const goalsSuccess = this.driver.setItem(this.goalsKey, normalizedGoals);
      const sanctuarySuccess = this.driver.setItem(
        this.sanctuaryKey,
        snapshot.data?.microActions || []
      );
      const reflectionsSuccess = this.driver.setItem(
        this.reflectionsKey,
        snapshot.data?.hanseiEntries || []
      );
      const logsSuccess = this.driver.setItem(
        this.dailyLogsKey,
        snapshot.data?.dailyLogs || []
      );
      const todosSuccess = this.driver.setItem(this.todosKey, restoredTodos);
      const routinesSuccess = this.driver.setItem(this.routinesKey, restoredRoutines);
      const rewardsSuccess = this.driver.setItem(this.rewardsKey, restoredRewards);
      const categoriesSuccess = this.driver.setItem(this.customCategoriesKey, restoredCustomCategories);

      if (
        !goalsSuccess ||
        !sanctuarySuccess ||
        !reflectionsSuccess ||
        !logsSuccess ||
        !todosSuccess ||
        !routinesSuccess ||
        !rewardsSuccess ||
        !categoriesSuccess
      ) {
        return Result.err(
          new Error("Failed to write restored data to local storage driver")
        );
      }

      // Rebuild active dates from restored reflections and daily logs
      const reflectionDates = (snapshot.data?.hanseiEntries || [])
        .map((h) => h.date)
        .filter(Boolean);
      const logDates = (snapshot.data?.dailyLogs || [])
        .map((l) => l.date)
        .filter(Boolean);
      const activeDates = Array.from(new Set([...reflectionDates, ...logDates])).sort();

      if (activeDates.length > 0) {
        this.driver.setItem(this.activeDatesKey, activeDates);
      }

      return Result.ok(undefined);
    } catch (err) {
      return Result.err(
        err instanceof Error
          ? err
          : new Error("Failed to restore snapshot into local storage")
      );
    }
  }

  public async clearAll(): Promise<Result<void, Error>> {
    try {
      this.driver.removeItem(this.goalsKey);
      this.driver.removeItem(this.sanctuaryKey);
      this.driver.removeItem(this.reflectionsKey);
      this.driver.removeItem(this.dailyLogsKey);
      this.driver.removeItem(this.activeDatesKey);
      this.driver.removeItem(this.todosKey);
      this.driver.removeItem(this.routinesKey);
      this.driver.removeItem(this.rewardsKey);
      this.driver.removeItem(this.customCategoriesKey);
      return Result.ok(undefined);
    } catch (err) {
      return Result.err(
        err instanceof Error
          ? err
          : new Error("Failed to clear local storage data")
      );
    }
  }
}

export const localStorageBackupRepository = new LocalStorageBackupRepository();

