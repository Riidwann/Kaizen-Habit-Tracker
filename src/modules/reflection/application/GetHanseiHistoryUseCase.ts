import { ReflectionRepositoryPort } from "../domain/ReflectionRepositoryPort";
import { HanseiReflection } from "../domain/HanseiReflection";
import { Result } from "@/shared/domain/Result";

export class GetHanseiHistoryUseCase {
  constructor(private readonly repository: ReflectionRepositoryPort) {}

  public async execute(
    order: "asc" | "desc" = "desc"
  ): Promise<Result<HanseiReflection[], Error>> {
    const reflectionsResult = await this.repository.findAllReflections();
    if (reflectionsResult.isErr()) {
      return reflectionsResult;
    }

    const reflections = reflectionsResult.unwrap();

    reflections.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return order === "asc" ? cmp : -cmp;
    });

    return Result.ok(reflections);
  }
}
