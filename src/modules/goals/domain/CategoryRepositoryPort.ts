import { GoalCategoryMeta } from "./GoalCategory";

export interface CategoryRepositoryPort {
  getCategories(): Promise<GoalCategoryMeta[]>;
  addCategory(category: GoalCategoryMeta): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}
