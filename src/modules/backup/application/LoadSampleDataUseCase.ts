import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";
import { BackupRepositoryPort } from "../domain/BackupRepositoryPort";
import { SystemSnapshot } from "../domain/SystemSnapshot";
import { BackupRestoredEvent } from "../domain/events/BackupRestoredEvent";

import { GOAL_CATEGORIES } from "@/modules/goals/domain/GoalCategory";

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

    const sampleTodos = [
      {
        id: "todo_sample_1",
        title: "Membaca buku 1 bab",
        isCompleted: false,
        priority: "medium",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      {
        id: "todo_sample_2",
        title: "Refleksi mingguan",
        isCompleted: false,
        priority: "high",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      {
        id: "todo_sample_3",
        title: "Membeli perlengkapan kerja",
        isCompleted: true,
        priority: "low",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];

    const sampleRoutines = [
      {
        id: "routine_sample_1",
        title: "Olahraga Ringan",
        time: "06:30",
        isCompletedToday: true,
        streakCount: 3,
        lastCompletedDate: yesterdayDateStr,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      {
        id: "routine_sample_2",
        title: "Journaling Malam",
        time: "20:00",
        isCompletedToday: false,
        streakCount: 5,
        lastCompletedDate: yesterdayDateStr,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];

    const sampleRewards = [
      {
        id: "reward_sample_1",
        title: "Kopi Spesial & Buku Baru",
        costPoints: 50,
        status: "pending",
        description: "Secangkir kopi hangat di tempat tenang setelah target tercapai",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];

    const sampleCustomCategories = [
      ...Object.values(GOAL_CATEGORIES),
      {
        id: "finance",
        label: "Keuangan & Investasi",
        badgeVariant: "amber",
        colorClass: "text-amber-800 dark:text-amber-300",
        pastelBg: "bg-amber-50 dark:bg-amber-950/40",
        borderColor: "border-amber-200 dark:border-amber-800",
        iconName: "Coins",
        description: "Manajemen finansial dan investasi jangka panjang",
        isCustom: true,
      },
    ];

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
        todos: sampleTodos,
        routines: sampleRoutines,
        rewards: sampleRewards,
        customCategories: sampleCustomCategories,
      },
      todos: sampleTodos,
      routines: sampleRoutines,
      rewards: sampleRewards,
      customCategories: sampleCustomCategories,
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
