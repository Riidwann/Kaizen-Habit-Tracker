import { describe, it, expect } from "vitest";
import { Result } from "@/shared/domain/Result";

describe("Result", () => {
  describe("ok", () => {
    it("should create a successful result", () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(42);
    });

    it("should allow creating an ok result with void or null", () => {
      const resultVoid = Result.ok<void, string>();
      expect(resultVoid.isOk()).toBe(true);
      expect(resultVoid.unwrap()).toBeUndefined();

      const resultNull = Result.ok<null, string>(null);
      expect(resultNull.isOk()).toBe(true);
      expect(resultNull.unwrap()).toBeNull();
    });

    it("should return value with unwrapOr", () => {
      const result = Result.ok("hello");
      expect(result.unwrapOr("world")).toBe("hello");
    });

    it("should map value when ok", () => {
      const result = Result.ok(5);
      const mapped = result.map((x) => x * 2);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(10);
    });

    it("should not map error when ok", () => {
      const result = Result.ok<number, string>(5);
      const mapped = result.mapErr((err) => `Error: ${err}`);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(5);
    });
  });

  describe("err", () => {
    it("should create an error result", () => {
      const result = Result.err("something failed");
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.getError()).toBe("something failed");
    });

    it("should throw when unwrapping an err result", () => {
      const result = Result.err(new Error("failure"));
      expect(() => result.unwrap()).toThrow("failure");
    });

    it("should throw with custom string error when unwrapping err", () => {
      const result = Result.err("simple error");
      expect(() => result.unwrap()).toThrow("simple error");
    });

    it("should return fallback with unwrapOr", () => {
      const result = Result.err<string, string>("error");
      expect(result.unwrapOr("fallback")).toBe("fallback");
    });

    it("should not map value when err", () => {
      const result = Result.err<number, string>("failed");
      const mapped = result.map((x) => x * 2);
      expect(mapped.isErr()).toBe(true);
      expect(mapped.getError()).toBe("failed");
    });

    it("should map error when err", () => {
      const result = Result.err<number, string>("failed");
      const mapped = result.mapErr((err) => `prefix: ${err}`);
      expect(mapped.isErr()).toBe(true);
      expect(mapped.getError()).toBe("prefix: failed");
    });
  });
});
