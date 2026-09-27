import { describe, it, expect } from "vitest";
import { BackupValidator } from "@/modules/backup/domain/BackupValidator";
import { SystemSnapshot } from "@/modules/backup/domain/SystemSnapshot";

describe("BackupValidator", () => {
  const validSnapshot: SystemSnapshot = {
    version: "1.0.0",
    appName: "KaizenFlow",
    exportedAt: "2026-09-28T00:00:00.000Z",
    data: {
      goals: [
        {
          id: "goal-1",
          title: "Tubuh Bugar & Berenergi",
          category: "health",
          whyText: "Sehat dan berenergi sepanjang hari",
        },
      ],
      microActions: [
        {
          id: "act-1",
          goalId: "goal-1",
          title: "Lakukan 2 kali push-up saat bangun tidur",
          scaleDownTitle: "Cukup gelar matras yoga",
          estimatedMinutes: 2,
        },
      ],
      hanseiEntries: [
        {
          id: "hansei-1",
          date: "2026-09-27",
          winOfTheDay: "Menyelesaikan push up pagi",
          tomorrowAdjustment: "Siapkan air minum di samping kasur",
        },
      ],
      dailyLogs: [
        {
          id: "log-1",
          date: "2026-09-27",
          completedActionIds: ["act-1"],
          totalActions: 1,
          isAllCompleted: true,
        },
      ],
    },
  };

  it("validates a complete, valid SystemSnapshot object successfully", () => {
    const result = BackupValidator.validate(validSnapshot);

    expect(result.isOk()).toBe(true);
    const snapshot = result.unwrap();
    expect(snapshot.appName).toBe("KaizenFlow");
    expect(snapshot.version).toBe("1.0.0");
    expect(snapshot.data.goals).toHaveLength(1);
    expect(snapshot.data.microActions).toHaveLength(1);
    expect(snapshot.data.hanseiEntries).toHaveLength(1);
    expect(snapshot.data.dailyLogs).toHaveLength(1);
  });

  it("validates a valid JSON string successfully", () => {
    const jsonString = JSON.stringify(validSnapshot);
    const result = BackupValidator.validate(jsonString);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap().appName).toBe("KaizenFlow");
  });

  it("fails when input is not valid JSON string", () => {
    const result = BackupValidator.validate("{ corrupted json content ... ");

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/Invalid JSON/i);
  });

  it("fails when root is null or not an object", () => {
    expect(BackupValidator.validate(null).isErr()).toBe(true);
    expect(BackupValidator.validate(123).isErr()).toBe(true);
    expect(BackupValidator.validate("").isErr()).toBe(true);
  });

  it("fails when appName is missing or not KaizenFlow", () => {
    const invalidApp = {
      ...validSnapshot,
      appName: "OtherApp",
    };
    const result = BackupValidator.validate(invalidApp);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/KaizenFlow/i);
  });

  it("fails when version is missing or empty", () => {
    const invalidVersion = {
      ...validSnapshot,
      version: "",
    };
    const result = BackupValidator.validate(invalidVersion);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/version/i);
  });

  it("fails when data section is missing or not an object", () => {
    const invalidData = {
      version: "1.0.0",
      appName: "KaizenFlow",
      exportedAt: "2026-09-28T00:00:00.000Z",
    };
    const result = BackupValidator.validate(invalidData);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/data/i);
  });

  it("fails when required arrays inside data are missing or not arrays", () => {
    const invalidArrays = {
      ...validSnapshot,
      data: {
        goals: "not-an-array",
        microActions: [],
        hanseiEntries: [],
        dailyLogs: [],
      },
    };
    const result = BackupValidator.validate(invalidArrays);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/goals.*array/i);
  });

  it("fails when a goal item is missing required fields (id or title)", () => {
    const invalidGoal = {
      ...validSnapshot,
      data: {
        ...validSnapshot.data,
        goals: [{ id: "g1", title: "" }],
      },
    };
    const result = BackupValidator.validate(invalidGoal);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/goal.*title/i);
  });

  it("fails when a microAction is missing goalId or title", () => {
    const invalidAction = {
      ...validSnapshot,
      data: {
        ...validSnapshot.data,
        microActions: [{ id: "act-1", title: "Pushup" }], // missing goalId
      },
    };
    const result = BackupValidator.validate(invalidAction);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/micro-?action.*goalId/i);
  });

  it("fails when a hanseiEntry is missing date or winOfTheDay", () => {
    const invalidHansei = {
      ...validSnapshot,
      data: {
        ...validSnapshot.data,
        hanseiEntries: [{ id: "h1", date: "2026-09-27", winOfTheDay: "" }],
      },
    };
    const result = BackupValidator.validate(invalidHansei);

    expect(result.isErr()).toBe(true);
    expect(result.getError()?.message).toMatch(/hansei/i);
  });
});
