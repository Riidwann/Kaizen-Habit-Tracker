export interface GoalMilestoneSnapshot {
  id: string;
  goalId: string;
  title: string;
  order: number;
  isCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalPropsSnapshot {
  id: string;
  title: string;
  whyText?: string;
  whyStatement?: { whyText: string } | string;
  category: string;
  status?: string;
  milestones?: GoalMilestoneSnapshot[];
  microAction?: string;
  scaleDownFallback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MicroActionPropsSnapshot {
  id: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  scaleDownTitle?: string;
  estimatedMinutes?: number;
  isScaledDown?: boolean;
  isActiveToday?: boolean;
  isCompletedToday?: boolean;
  completedAt?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HanseiEntryPropsSnapshot {
  id: string;
  date: string;
  winOfTheDay: string;
  tomorrowAdjustment: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailySanctuaryLogPropsSnapshot {
  id?: string;
  date: string;
  completedActionIds?: string[];
  totalActions?: number;
  isAllCompleted?: boolean;
  loggedAt?: string;
}

export type GoalProps = GoalPropsSnapshot;
export type MicroActionProps = MicroActionPropsSnapshot;
export type HanseiEntryProps = HanseiEntryPropsSnapshot;
export type DailySanctuaryLogProps = DailySanctuaryLogPropsSnapshot;

export interface SystemSnapshotData {
  goals: GoalProps[];
  microActions: MicroActionProps[];
  hanseiEntries: HanseiEntryProps[];
  dailyLogs: DailySanctuaryLogProps[];
}

export interface SystemSnapshot {
  version: string;
  exportedAt: string;
  appName: "KaizenFlow";
  data: SystemSnapshotData;
}
