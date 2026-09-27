import { GoalRepositoryPort } from "../domain/GoalRepositoryPort";
import { Goal, GoalStatus } from "../domain/Goal";
import { GoalCategory } from "../domain/GoalCategory";
import { Result } from "@/shared/domain/Result";

export interface GetGoalsFilter {
  category?: GoalCategory;
  status?: GoalStatus;
}

export class GetGoalsUseCase {
  constructor(private readonly goalRepo: GoalRepositoryPort) {}

  public async execute(filter?: GetGoalsFilter): Promise<Result<Goal[], string>> {
    const result = await this.goalRepo.findAll();
    if (result.isErr()) {
      return Result.err(result.getError()?.message || "Failed to load goals");
    }

    let goals = result.unwrap();

    if (filter?.category) {
      goals = goals.filter((g) => g.category === filter.category);
    }

    if (filter?.status) {
      goals = goals.filter((g) => g.status === filter.status);
    }

    return Result.ok(goals);
  }
}
