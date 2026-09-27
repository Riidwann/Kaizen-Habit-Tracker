export interface CompoundDataPoint {
  step: number;
  growth: number;
  decline: number;
  baseline: number;
}

export class CompoundGrowthCalculator {
  public static calculateMultiplier(n: number): number {
    if (typeof n !== "number" || isNaN(n) || n <= 0) {
      return 1;
    }
    return Math.pow(1.01, n);
  }

  public static calculateDecline(n: number): number {
    if (typeof n !== "number" || isNaN(n) || n <= 0) {
      return 1;
    }
    return Math.pow(0.99, n);
  }

  public static calculatePercentageGain(n: number): number {
    if (typeof n !== "number" || isNaN(n) || n <= 0) {
      return 0;
    }
    return (Math.pow(1.01, n) - 1) * 100;
  }

  public static generateCurve(
    totalSteps: number = 30,
    stepInterval: number = 1
  ): CompoundDataPoint[] {
    const validTotal = Math.max(1, Math.round(totalSteps));
    const validInterval = Math.max(1, Math.round(stepInterval));
    const points: CompoundDataPoint[] = [];

    for (let s = 0; s <= validTotal; s += validInterval) {
      points.push({
        step: s,
        growth: this.calculateMultiplier(s),
        decline: this.calculateDecline(s),
        baseline: 1,
      });
    }

    if (points[points.length - 1].step !== validTotal) {
      points.push({
        step: validTotal,
        growth: this.calculateMultiplier(validTotal),
        decline: this.calculateDecline(validTotal),
        baseline: 1,
      });
    }

    return points;
  }
}
