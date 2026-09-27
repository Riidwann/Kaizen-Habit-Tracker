import { BadgeVariant } from "@/shared/presentation/Badge";

export type GoalCategory =
  | "health"
  | "career"
  | "learning"
  | "mindset"
  | "creativity"
  | "custom";

export interface GoalCategoryMeta {
  id: GoalCategory;
  label: string;
  badgeVariant: BadgeVariant;
  colorClass: string;
  pastelBg: string;
  borderColor: string;
  iconName: string;
  description: string;
}

export const GOAL_CATEGORIES: Record<GoalCategory, GoalCategoryMeta> = {
  health: {
    id: "health",
    label: "Health & Vitality",
    badgeVariant: "sage",
    colorClass: "text-sage-800 dark:text-sage-300",
    pastelBg: "bg-sage-50 dark:bg-sage-950/40",
    borderColor: "border-sage-200 dark:border-sage-800",
    iconName: "HeartPulse",
    description: "Physical wellbeing, energy, nutrition, and rest",
  },
  career: {
    id: "career",
    label: "Career & Craft",
    badgeVariant: "amber",
    colorClass: "text-amber-800 dark:text-amber-300",
    pastelBg: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconName: "Briefcase",
    description: "Professional mastery, projects, and impact",
  },
  learning: {
    id: "learning",
    label: "Wisdom & Learning",
    badgeVariant: "charcoal",
    colorClass: "text-charcoal-800 dark:text-sand-200",
    pastelBg: "bg-sand-100 dark:bg-charcoal-800/60",
    borderColor: "border-sand-300 dark:border-charcoal-700",
    iconName: "BookOpen",
    description: "Reading, languages, skills, and intellectual depth",
  },
  mindset: {
    id: "mindset",
    label: "Mindset & Peace",
    badgeVariant: "sage",
    colorClass: "text-sage-700 dark:text-sage-200",
    pastelBg: "bg-sage-50/80 dark:bg-sage-950/30",
    borderColor: "border-sage-200 dark:border-sage-800",
    iconName: "Smile",
    description: "Meditation, emotional resilience, presence, and stillness",
  },
  creativity: {
    id: "creativity",
    label: "Art & Creativity",
    badgeVariant: "amber",
    colorClass: "text-amber-700 dark:text-amber-200",
    pastelBg: "bg-amber-50/80 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconName: "Palette",
    description: "Writing, music, visual crafts, and imaginative expression",
  },
  custom: {
    id: "custom",
    label: "Custom Quest",
    badgeVariant: "default",
    colorClass: "text-charcoal-700 dark:text-sand-300",
    pastelBg: "bg-sand-50 dark:bg-charcoal-900/60",
    borderColor: "border-sand-200 dark:border-charcoal-700",
    iconName: "Sparkles",
    description: "Personal aspirations, unique quests, and life projects",
  },
};

export const GOAL_CATEGORY_LIST: GoalCategoryMeta[] = Object.values(GOAL_CATEGORIES);

export function getGoalCategoryMeta(category: GoalCategory): GoalCategoryMeta {
  return GOAL_CATEGORIES[category] || GOAL_CATEGORIES.custom;
}
