import { ReflectionRepositoryPort } from "../domain/ReflectionRepositoryPort";
import { HanseiReflection } from "../domain/HanseiReflection";
import { HanseiRecordedEvent } from "../domain/events/HanseiRecordedEvent";
import { StreakUpdatedEvent } from "../domain/events/StreakUpdatedEvent";
import { NeverMissTwicePolicy } from "../domain/NeverMissTwicePolicy";
import { Result } from "@/shared/domain/Result";
import { IEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export interface RecordHanseiDTO {
  date?: string;
  winOfTheDay: string;
  tomorrowAdjustment: string;
}

export class RecordHanseiUseCase {
  constructor(
    private readonly repository: ReflectionRepositoryPort,
    private readonly eventBus?: IEventBus
  ) {}

  public async execute(dto: RecordHanseiDTO): Promise<Result<HanseiReflection, string>> {
    const targetDate = dto.date ? dto.date.trim() : new Date().toISOString().split("T")[0];

    // Check if reflection exists for target date
    const existingResult = await this.repository.findReflectionByDate(targetDate);
    if (existingResult.isErr()) {
      return Result.err(existingResult.getError()?.message || "Failed to query existing reflection");
    }

    let reflection: HanseiReflection;
    const existing = existingResult.unwrap();

    if (existing) {
      const updateResult = existing.updateContent(dto.winOfTheDay, dto.tomorrowAdjustment);
      if (updateResult.isErr()) {
        return Result.err(updateResult.getError()!);
      }
      reflection = existing;
    } else {
      const createResult = HanseiReflection.create({
        date: targetDate,
        winOfTheDay: dto.winOfTheDay,
        tomorrowAdjustment: dto.tomorrowAdjustment,
      });

      if (createResult.isErr()) {
        return Result.err(createResult.getError()!);
      }
      reflection = createResult.unwrap();
    }

    // Save reflection
    const saveResult = await this.repository.saveReflection(reflection);
    if (saveResult.isErr()) {
      return Result.err(saveResult.getError()?.message || "Failed to save reflection");
    }

    // Record active date
    await this.repository.recordActiveDate(reflection.date);

    // Publish domain events
    if (this.eventBus) {
      await this.eventBus.publish(
        new HanseiRecordedEvent({
          reflectionId: reflection.id,
          date: reflection.date,
          winOfTheDay: reflection.winOfTheDay,
          tomorrowAdjustment: reflection.tomorrowAdjustment,
          submittedAt: reflection.submittedAt,
        })
      );

      const activeDatesResult = await this.repository.getActiveDates();
      if (activeDatesResult.isOk()) {
        const streak = NeverMissTwicePolicy.calculate(
          activeDatesResult.unwrap(),
          reflection.date
        );
        await this.eventBus.publish(
          new StreakUpdatedEvent({
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            isGracePeriod: streak.isGracePeriod,
            lastActiveDate: streak.lastActiveDate,
            updatedAt: new Date(),
          })
        );
      }
    }

    return Result.ok(reflection);
  }
}
