import { Result } from "@/shared/domain/Result";
import { SystemSnapshot } from "./SystemSnapshot";

export class BackupValidator {
  public static validate(raw: unknown): Result<SystemSnapshot, Error> {
    if (raw === null || raw === undefined) {
      return Result.err(new Error("Invalid backup format: Input cannot be empty or null"));
    }

    let parsed: unknown = raw;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) {
        return Result.err(new Error("Invalid backup format: JSON string cannot be empty"));
      }
      try {
        parsed = JSON.parse(trimmed);
      } catch (err) {
        return Result.err(
          new Error("Invalid JSON: Unable to parse backup string into valid JSON")
        );
      }
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Result.err(new Error("Invalid backup format: Root must be a valid JSON object"));
    }

    const obj = parsed as Record<string, unknown>;

    // Validate appName
    if (obj.appName !== "KaizenFlow") {
      return Result.err(
        new Error("Invalid application backup: Expected appName 'KaizenFlow'")
      );
    }

    // Validate version
    if (typeof obj.version !== "string" || !obj.version.trim()) {
      return Result.err(new Error("Invalid backup format: Missing or invalid version string"));
    }

    // Validate exportedAt
    if (typeof obj.exportedAt !== "string" || !obj.exportedAt.trim()) {
      return Result.err(new Error("Invalid backup format: Missing or invalid exportedAt date"));
    }

    // Validate data object
    if (!obj.data || typeof obj.data !== "object" || Array.isArray(obj.data)) {
      return Result.err(new Error("Invalid backup format: 'data' property must be an object"));
    }

    const dataObj = obj.data as Record<string, unknown>;

    // Validate data.goals array
    if (!Array.isArray(dataObj.goals)) {
      return Result.err(new Error("Invalid backup format: data.goals must be an array"));
    }
    for (let i = 0; i < dataObj.goals.length; i++) {
      const goal = dataObj.goals[i];
      if (
        !goal ||
        typeof goal !== "object" ||
        typeof goal.id !== "string" ||
        !goal.id.trim() ||
        typeof goal.title !== "string" ||
        !goal.title.trim()
      ) {
        return Result.err(
          new Error(
            `Invalid goal in backup at index ${i}: missing required fields 'id' or non-empty 'title'`
          )
        );
      }
    }

    // Validate data.microActions array
    if (!Array.isArray(dataObj.microActions)) {
      return Result.err(new Error("Invalid backup format: data.microActions must be an array"));
    }
    for (let i = 0; i < dataObj.microActions.length; i++) {
      const action = dataObj.microActions[i];
      if (
        !action ||
        typeof action !== "object" ||
        typeof action.id !== "string" ||
        !action.id.trim() ||
        typeof action.goalId !== "string" ||
        !action.goalId.trim() ||
        typeof action.title !== "string" ||
        !action.title.trim()
      ) {
        return Result.err(
          new Error(
            `Invalid micro-action in backup at index ${i}: missing required fields 'id', 'goalId', or 'title'`
          )
        );
      }
    }

    // Validate data.hanseiEntries array
    if (!Array.isArray(dataObj.hanseiEntries)) {
      return Result.err(new Error("Invalid backup format: data.hanseiEntries must be an array"));
    }
    for (let i = 0; i < dataObj.hanseiEntries.length; i++) {
      const hansei = dataObj.hanseiEntries[i];
      if (
        !hansei ||
        typeof hansei !== "object" ||
        typeof hansei.id !== "string" ||
        !hansei.id.trim() ||
        typeof hansei.date !== "string" ||
        !hansei.date.trim() ||
        typeof hansei.winOfTheDay !== "string" ||
        !hansei.winOfTheDay.trim() ||
        typeof hansei.tomorrowAdjustment !== "string" ||
        !hansei.tomorrowAdjustment.trim()
      ) {
        return Result.err(
          new Error(
            `Invalid hansei entry in backup at index ${i}: missing required fields 'id', 'date', 'winOfTheDay', or 'tomorrowAdjustment'`
          )
        );
      }
    }

    // Validate data.dailyLogs array
    if (!Array.isArray(dataObj.dailyLogs)) {
      return Result.err(new Error("Invalid backup format: data.dailyLogs must be an array"));
    }
    for (let i = 0; i < dataObj.dailyLogs.length; i++) {
      const log = dataObj.dailyLogs[i];
      if (
        !log ||
        typeof log !== "object" ||
        typeof log.date !== "string" ||
        !log.date.trim()
      ) {
        return Result.err(
          new Error(
            `Invalid daily log in backup at index ${i}: missing required field 'date'`
          )
        );
      }
    }

    // Validate optional arrays: todos, routines, rewards, customCategories
    const optionalArrayFields = [
      "todos",
      "routines",
      "rewards",
      "customCategories",
    ] as const;

    for (const field of optionalArrayFields) {
      if (obj[field] !== undefined && !Array.isArray(obj[field])) {
        return Result.err(
          new Error(`Invalid backup format: '${field}' must be an array if provided`)
        );
      }
      if (dataObj[field] !== undefined && !Array.isArray(dataObj[field])) {
        return Result.err(
          new Error(`Invalid backup format: 'data.${field}' must be an array if provided`)
        );
      }
      // Keep root and dataObj synchronized
      if (obj[field] && !dataObj[field]) {
        dataObj[field] = obj[field];
      }
      if (dataObj[field] && !obj[field]) {
        obj[field] = dataObj[field];
      }
    }

    return Result.ok(parsed as SystemSnapshot);
  }
}
