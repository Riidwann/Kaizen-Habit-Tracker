import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageCategoryRepository } from "@/modules/goals/infrastructure/LocalStorageCategoryRepository";

describe("LocalStorageCategoryRepository", () => {
  let repo: LocalStorageCategoryRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageCategoryRepository();
  });

  it("returns default categories initially", async () => {
    const categories = await repo.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(5);
    expect(categories.some((c) => c.id === "health")).toBe(true);
  });

  it("can add a custom category and retrieve it", async () => {
    await repo.addCategory({
      id: "finance",
      label: "Keuangan & Investasi",
      badgeVariant: "amber",
      colorClass: "text-amber-800",
      pastelBg: "bg-amber-50",
      borderColor: "border-amber-200",
      iconName: "Coins",
      description: "Financial habits",
      isCustom: true,
    });
    const categories = await repo.getCategories();
    expect(categories.some((c) => c.id === "finance")).toBe(true);
  });

  it("can delete a custom category", async () => {
    await repo.addCategory({
      id: "gaming",
      label: "Gaming",
      badgeVariant: "charcoal",
      colorClass: "text-charcoal-800",
      pastelBg: "bg-sand-100",
      borderColor: "border-sand-300",
      iconName: "Gamepad",
      description: "Game dev",
      isCustom: true,
    });
    await repo.deleteCategory("gaming");
    const categories = await repo.getCategories();
    expect(categories.some((c) => c.id === "gaming")).toBe(false);
  });
});
