import { CategoryRepositoryPort } from "../domain/CategoryRepositoryPort";
import { GoalCategoryMeta, GOAL_CATEGORIES } from "../domain/GoalCategory";

const STORAGE_KEY = "kaizen_goal_categories";

export class LocalStorageCategoryRepository implements CategoryRepositoryPort {
  public async getCategories(): Promise<GoalCategoryMeta[]> {
    if (typeof window === "undefined") return Object.values(GOAL_CATEGORIES);
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaults = Object.values(GOAL_CATEGORIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(data);
    } catch {
      return Object.values(GOAL_CATEGORIES);
    }
  }

  public async addCategory(cat: GoalCategoryMeta): Promise<boolean> {
    const list = await this.getCategories();
    if (list.some((c) => c.id === cat.id)) return false;
    list.push(cat);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const list = await this.getCategories();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
