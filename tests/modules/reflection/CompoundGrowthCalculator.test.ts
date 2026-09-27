import { describe, it, expect } from "vitest";
import { CompoundGrowthCalculator } from "@/modules/reflection/domain/CompoundGrowthCalculator";

describe("CompoundGrowthCalculator", () => {
  describe("calculateMultiplier", () => {
    it("returns 1.0 when N = 0", () => {
      expect(CompoundGrowthCalculator.calculateMultiplier(0)).toBe(1);
    });

    it("calculates 1.01^N correctly for 1 action", () => {
      expect(CompoundGrowthCalculator.calculateMultiplier(1)).toBeCloseTo(1.01, 4);
    });

    it("calculates 1.01^7 correctly for 1 week (7 actions)", () => {
      // 1.01^7 = 1.072135...
      expect(CompoundGrowthCalculator.calculateMultiplier(7)).toBeCloseTo(1.0721, 3);
    });

    it("calculates 1.01^30 correctly for 30 actions", () => {
      // 1.01^30 = 1.3478...
      expect(CompoundGrowthCalculator.calculateMultiplier(30)).toBeCloseTo(1.3478, 3);
    });

    it("calculates 1.01^365 correctly for 1 full year (~37.78x)", () => {
      // 1.01^365 = 37.7834...
      expect(CompoundGrowthCalculator.calculateMultiplier(365)).toBeCloseTo(37.783, 2);
    });

    it("handles negative inputs gracefully by clamping to 0 (returns 1.0)", () => {
      expect(CompoundGrowthCalculator.calculateMultiplier(-5)).toBe(1);
    });
  });

  describe("calculateDecline", () => {
    it("returns 1.0 when N = 0", () => {
      expect(CompoundGrowthCalculator.calculateDecline(0)).toBe(1);
    });

    it("calculates 0.99^N correctly for 365 days (~0.0255 or ~0.03)", () => {
      // 0.99^365 = 0.025517...
      expect(CompoundGrowthCalculator.calculateDecline(365)).toBeCloseTo(0.0255, 3);
    });

    it("handles negative inputs gracefully by clamping to 0", () => {
      expect(CompoundGrowthCalculator.calculateDecline(-1)).toBe(1);
    });
  });

  describe("calculatePercentageGain", () => {
    it("returns 0% for 0 actions", () => {
      expect(CompoundGrowthCalculator.calculatePercentageGain(0)).toBe(0);
    });

    it("returns ~34.8% for 30 actions", () => {
      // (1.3478 - 1) * 100 = 34.78%
      expect(CompoundGrowthCalculator.calculatePercentageGain(30)).toBeCloseTo(34.78, 1);
    });

    it("returns ~3678% for 365 actions", () => {
      // (37.783 - 1) * 100 = 3678.34%
      expect(CompoundGrowthCalculator.calculatePercentageGain(365)).toBeCloseTo(3678.34, 0);
    });
  });

  describe("generateCurve", () => {
    it("generates a sequence of compound data points up to specified length", () => {
      const curve = CompoundGrowthCalculator.generateCurve(30, 5);

      expect(curve.length).toBeGreaterThan(0);
      expect(curve[0].step).toBe(0);
      expect(curve[0].growth).toBe(1);
      expect(curve[0].decline).toBe(1);
      expect(curve[0].baseline).toBe(1);

      const lastPoint = curve[curve.length - 1];
      expect(lastPoint.step).toBe(30);
      expect(lastPoint.growth).toBeCloseTo(1.3478, 2);
      expect(lastPoint.decline).toBeLessThan(1);
      expect(lastPoint.baseline).toBe(1);
    });

    it("ensures growth curve is strictly increasing and decline curve is strictly decreasing", () => {
      const curve = CompoundGrowthCalculator.generateCurve(10);
      for (let i = 1; i < curve.length; i++) {
        expect(curve[i].growth).toBeGreaterThan(curve[i - 1].growth);
        expect(curve[i].decline).toBeLessThan(curve[i - 1].decline);
        expect(curve[i].baseline).toBe(1);
      }
    });
  });
});
