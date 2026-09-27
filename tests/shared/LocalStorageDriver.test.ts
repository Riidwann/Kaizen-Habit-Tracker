import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageDriver } from "@/shared/infrastructure/LocalStorageDriver";

describe("LocalStorageDriver", () => {
  let driver: LocalStorageDriver;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    driver = new LocalStorageDriver();
  });

  it("should set and get typed items correctly", () => {
    const data = { id: "123", name: "Morning Meditation", count: 5 };
    const success = driver.setItem("test_key", data);

    expect(success).toBe(true);
    const retrieved = driver.getItem<typeof data>("test_key");
    expect(retrieved).toEqual(data);
  });

  it("should return fallback when key does not exist", () => {
    const retrieved = driver.getItem<string>("non_existent_key", "default_val");
    expect(retrieved).toBe("default_val");

    const retrievedNull = driver.getItem<string>("another_missing");
    expect(retrievedNull).toBeNull();
  });

  it("should return fallback on corrupt JSON data without throwing", () => {
    localStorage.setItem("corrupt_key", "{invalid-json-data");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const retrieved = driver.getItem<number>("corrupt_key", 99);

    expect(retrieved).toBe(99);
    consoleSpy.mockRestore();
  });

  it("should remove item correctly", () => {
    driver.setItem("to_delete", { active: true });
    expect(driver.getItem("to_delete")).toEqual({ active: true });

    driver.removeItem("to_delete");
    expect(driver.getItem("to_delete")).toBeNull();
  });

  it("should handle localStorage errors gracefully when setting item", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const success = driver.setItem("quota_test", { big: "data" });
    expect(success).toBe(false);

    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it("should clear items or key prefix when clear is called", () => {
    driver.setItem("k1", 1);
    driver.setItem("k2", 2);
    expect(driver.getItem("k1")).toBe(1);

    driver.clear();
    expect(driver.getItem("k1")).toBeNull();
    expect(driver.getItem("k2")).toBeNull();
  });
});
