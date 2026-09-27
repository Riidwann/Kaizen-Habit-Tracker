import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import { SystemSnapshot } from "../domain/SystemSnapshot";
import { BackupRestoredEvent } from "../domain/events/BackupRestoredEvent";

export class LoadSampleDataUseCase {
  constructor(
    private readonly backupRepo: BackupRepositoryPort,
    private readonly eventBus?: IEventBus
  ) {}

  public getSampleSnapshot(): SystemSnapshot {
    const now = new Date();
    const nowIso = now.toISOString();
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayDateStr = yesterday.toISOString().split("T")[0];

    return {
      version: "1.0.0",
      appName: "KaizenFlow",
      exportedAt: nowIso,
      data: {
        goals: [
          {
            id: "goal_sample_health",
            title: "Tubuh Bugar & Berenergi",
            category: "health",
            whyText: "Menjaga kebugaran fisik dan stamina agar selalu penuh energi dalam menjalani hari",
            status: "active",
            milestones: [
              {
                id: "ms_sample_health_1",
                goalId: "goal_sample_health",
                title: "Membangun kebiasaan gerak harian",
                order: 1,
                isCompleted: false,
                createdAt: nowIso,
                updatedAt: nowIso,
              },
            ],
            microAction: "Lakukan 2 kali push-up saat bangun tidur",
            scaleDownFallback: "Cukup gelar matras yoga",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
          {
            id: "goal_sample_career",
            title: "Kuasai Frontend & Architecture",
            category: "career",
            whyText: "Membangun pemahaman mendalam tentang clean architecture & domain-driven design untuk karir software engineering",
            status: "active",
            milestones: [
              {
                id: "ms_sample_career_1",
                goalId: "goal_sample_career",
                title: "Membaca 1 konsep arsitektur setiap hari",
                order: 1,
                isCompleted: false,
                createdAt: nowIso,
                updatedAt: nowIso,
              },
            ],
            microAction: "Buka artikel DDD & baca 1 paragraf",
            scaleDownFallback: "Buka tab artikel di browser",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
          {
            id: "goal_sample_mindset",
            title: "Ketenangan Pikiran (Zen Mind)",
            category: "mindset",
            whyText: "Menciptakan ruang batin yang tenang, mengurangi overthinking, dan melatih kesadaran penuh",
            status: "active",
            milestones: [
              {
                id: "ms_sample_mindset_1",
                goalId: "goal_sample_mindset",
                title: "Meditasi pernapasan rutin",
                order: 1,
                isCompleted: false,
                createdAt: nowIso,
                updatedAt: nowIso,
              },
            ],
            microAction: "Tarik napas dalam 3 kali sebelum tidur",
            scaleDownFallback: "Tarik napas dalam 1 kali",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
        ],
        microActions: [
          {
            id: "act_sample_health_1",
            goalId: "goal_sample_health",
            milestoneId: "ms_sample_health_1",
            title: "Lakukan 2 kali push-up saat bangun tidur",
            scaleDownTitle: "Cukup gelar matras yoga",
            estimatedMinutes: 2,
            isScaledDown: false,
            isActiveToday: true,
            isCompletedToday: false,
            category: "health",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
          {
            id: "act_sample_career_1",
            goalId: "goal_sample_career",
            milestoneId: "ms_sample_career_1",
            title: "Buka artikel DDD & baca 1 paragraf",
            scaleDownTitle: "Buka tab artikel di browser",
            estimatedMinutes: 2,
            isScaledDown: false,
            isActiveToday: true,
            isCompletedToday: false,
            category: "career",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
          {
            id: "act_sample_mindset_1",
            goalId: "goal_sample_mindset",
            milestoneId: "ms_sample_mindset_1",
            title: "Tarik napas dalam 3 kali sebelum tidur",
            scaleDownTitle: "Tarik napas dalam 1 kali",
            estimatedMinutes: 1,
            isScaledDown: false,
            isActiveToday: true,
            isCompletedToday: false,
            category: "mindset",
            createdAt: nowIso,
            updatedAt: nowIso,
          },
        ],
        hanseiEntries: [
          {
            id: "hansei_sample_1",
            date: yesterdayDateStr,
            winOfTheDay: "Berhasil meluangkan waktu 2 menit untuk micro-action tanpa menunda",
            tomorrowAdjustment: "Menyiapkan lingkungan sebelum tidur agar besok lebih mudah memulai",
            submittedAt: nowIso,
            createdAt: nowIso,
            updatedAt: nowIso,
          },
        ],
        dailyLogs: [
          {
            id: "log_sample_1",
            date: yesterdayDateStr,
            completedActionIds: ["act_sample_health_1"],
            totalActions: 3,
            isAllCompleted: false,
            loggedAt: nowIso,
          },
        ],
      },
    };
  }

  public async execute(): Promise<Result<SystemSnapshot, Error>> {
    const sampleSnapshot = this.getSampleSnapshot();
    const restoreResult = await this.backupRepo.restoreSnapshot(sampleSnapshot);
    if (restoreResult.isErr()) {
      return Result.err(restoreResult.getError()!);
    }

    if (this.eventBus) {
      await this.eventBus.publish(
        new BackupRestoredEvent({
          version: sampleSnapshot.version,
          restoredAt: new Date(),
          goalCount: sampleSnapshot.data.goals.length,
          microActionCount: sampleSnapshot.data.microActions.length,
          hanseiCount: sampleSnapshot.data.hanseiEntries.length,
          source: "sample_data",
        })
      );
    }

    return Result.ok(sampleSnapshot);
  }
}
