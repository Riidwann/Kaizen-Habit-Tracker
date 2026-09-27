import { MicroAction } from "./MicroAction";

export const MAX_DAILY_FOCUS_ACTIONS = 3;

/**
 * DailyFocusPolicy
 * Domain Service enforcing the Tunnel Vision invariant:
 * Maximum 3 micro-actions active for today to prevent cognitive overload and decision paralysis.
 */
export class DailyFocusPolicy {
  public static readonly MAX_ACTIONS: number = MAX_DAILY_FOCUS_ACTIONS;

  /**
   * Filters and returns at most 3 actions that are marked active for today.
   */
  public static filterFocusActions(actions: MicroAction[]): MicroAction[] {
    if (!actions || !Array.isArray(actions)) {
      return [];
    }

    return actions
      .filter((action) => action.isActiveToday)
      .slice(0, MAX_DAILY_FOCUS_ACTIONS);
  }

  /**
   * Checks whether another focus action can be added without violating the tunnel vision cap.
   */
  public static canAddFocusAction(currentActiveCount: number): boolean {
    return currentActiveCount < MAX_DAILY_FOCUS_ACTIONS;
  }
}
