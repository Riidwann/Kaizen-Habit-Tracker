"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { TabNavigation, TabId } from "@/components/layout/TabNavigation";
import { usePwaInstall } from "@/hooks/usePwaInstall";

// Module Controllers & Views
import { useGoalsController } from "@/modules/goals";
import {
  DailySanctuaryView,
  useSanctuaryController,
} from "@/modules/sanctuary";
import { LocalStorageSanctuaryRepository } from "@/modules/sanctuary/infrastructure/LocalStorageSanctuaryRepository";
import { useReflectionController } from "@/modules/reflection";
import { useBackupController } from "@/modules/backup";
import { SlideOverDrawer, type DrawerTab } from "@/components/layout/SlideOverDrawer";
import { useTodoController, TodoListPanel } from "@/modules/todo";
import { useRoutineController, RoutineSchedulePanel } from "@/modules/routines";
import {
  useRewardController,
  SelfRewardBanner,
} from "@/modules/rewards";
import { LocalStorageReflectionRepository } from "@/modules/reflection/infrastructure/LocalStorageReflectionRepository";
import { ListTodo } from "lucide-react";

// Dynamically split modals (loaded on demand)
const GoalForgeWizard = dynamic(
  () => import("@/modules/goals").then((mod) => mod.GoalForgeWizard),
  { ssr: false }
);
const HanseiModal = dynamic(
  () => import("@/modules/reflection").then((mod) => mod.HanseiModal),
  { ssr: false }
);
const DataBackupModal = dynamic(
  () => import("@/modules/backup").then((mod) => mod.DataBackupModal),
  { ssr: false }
);
const KaizenGuideModal = dynamic(
  () => import("@/components/layout/KaizenGuideModal").then((mod) => mod.KaizenGuideModal),
  { ssr: false }
);

// Dynamically split secondary tab views
const GoalManagerView = dynamic(
  () => import("@/modules/goals").then((mod) => mod.GoalManagerView),
  {
    loading: () => (
      <div className="py-12 text-center text-charcoal-400 dark:text-sand-500 animate-pulse text-sm">
        Memuat target Kaizen...
      </div>
    ),
    ssr: false,
  }
);
const CompoundVisualizerView = dynamic(
  () => import("@/modules/reflection").then((mod) => mod.CompoundVisualizerView),
  {
    loading: () => (
      <div className="py-12 text-center text-charcoal-400 dark:text-sand-500 animate-pulse text-sm">
        Memuat visualisasi kemajuan...
      </div>
    ),
    ssr: false,
  }
);

// UI Kit
import { inMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("sanctuary");
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("todo");
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("kaizenflow_splash_seen");
    }
    return true;
  });

  const handleSplashComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kaizenflow_splash_seen", "1");
    }
    setShowSplash(false);
  }, []);

  // Idle preloader for dynamic modal chunks to guarantee instant 0-delay modal opening
  useEffect(() => {
    if (typeof window !== "undefined") {
      const preloadModals = () => {
        import("@/modules/goals").catch(() => {});
        import("@/modules/reflection").catch(() => {});
        import("@/modules/backup").catch(() => {});
      };
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(preloadModals);
      } else {
        setTimeout(preloadModals, 1200);
      }
    }
  }, []);

  // Initialize Controllers
  const goalsController = useGoalsController();
  const sanctuaryController = useSanctuaryController();
  const reflectionController = useReflectionController();
  const backupController = useBackupController();
  const todoController = useTodoController();
  const routineController = useRoutineController();
  const rewardController = useRewardController({
    currentStreak: reflectionController.stats.currentStreak,
  });
  const { isInstallable, promptInstall } = usePwaInstall();

  const sanctuaryRef = useRef(sanctuaryController);
  sanctuaryRef.current = sanctuaryController;

  const goalsRef = useRef(goalsController);
  goalsRef.current = goalsController;

  const reflectionRef = useRef(reflectionController);
  reflectionRef.current = reflectionController;

  const backupRef = useRef(backupController);
  backupRef.current = backupController;

  const todoRef = useRef(todoController);
  todoRef.current = todoController;

  const routineRef = useRef(routineController);
  routineRef.current = routineController;

  const rewardRef = useRef(rewardController);
  rewardRef.current = rewardController;

  // Wire up EventBus
  useEffect(() => {
    const unsubscribeGoalCreated = inMemoryEventBus.subscribe(
      "GoalCreated",
      async (event: any) => {
        if (event?.payload?.microAction) {
          await sanctuaryRef.current.createMicroAction({
            goalId: event.payload.goalId,
            title: event.payload.microAction,
            scaleDownTitle:
              event.payload.scaleDownFallback || "Lakukan versi minimal 10 detik",
            category: event.payload.category || "health",
            estimatedMinutes: 2,
          });
          await sanctuaryRef.current.refreshActions();
        }
      }
    );

    const unsubscribeGoalUpdated = inMemoryEventBus.subscribe(
      "GoalUpdated",
      async (event: any) => {
        if (event?.payload?.goalId && (event.payload.microAction || event.payload.title)) {
          const sanctuaryRepo = new LocalStorageSanctuaryRepository();
          const allActionsRes = await sanctuaryRepo.findAll();
          if (allActionsRes.isOk()) {
            const linkedAction = allActionsRes
              .unwrap()
              .find((a) => a.goalId === event.payload.goalId);
            if (linkedAction) {
              if (event.payload.microAction) {
                linkedAction.updateTitle(event.payload.microAction);
              }
              if (event.payload.scaleDownFallback) {
                linkedAction.updateScaleDownTitle(event.payload.scaleDownFallback);
              }
              if (event.payload.category) {
                linkedAction.category = event.payload.category;
              }
              await sanctuaryRepo.save(linkedAction);
            } else if (event.payload.microAction) {
              await sanctuaryRef.current.createMicroAction({
                goalId: event.payload.goalId,
                title: event.payload.microAction,
                scaleDownTitle:
                  event.payload.scaleDownFallback || "Lakukan versi minimal 10 detik",
                category: event.payload.category || "health",
                estimatedMinutes: 2,
              });
            }
          }
        }
        await sanctuaryRef.current.refreshActions();
      }
    );

    const unsubscribeBackupRestored = inMemoryEventBus.subscribe(
      "BackupRestored",
      async () => {
        await Promise.all([
          goalsRef.current.refreshGoals(),
          sanctuaryRef.current.refreshActions(),
          reflectionRef.current.refreshStats(),
          reflectionRef.current.refreshReflections(),
          todoRef.current.refreshTodos(),
          routineRef.current.refreshRoutines(),
          rewardRef.current.refreshRewards(),
        ]);
      }
    );

    const unsubscribeTodoCompleted = inMemoryEventBus.subscribe(
      "TodoCompleted",
      async (event: any) => {
        try {
          const completedAt = event?.payload?.completedAt
            ? new Date(event.payload.completedAt)
            : new Date();
          const dateStr = completedAt.toISOString().split("T")[0];
          const reflectionRepo = new LocalStorageReflectionRepository();
          await reflectionRepo.recordActiveDate(dateStr);
          await reflectionRef.current.refreshStats();
        } catch (err) {
          console.warn("[HomePage] Error handling TodoCompleted:", err);
        }
      }
    );

    return () => {
      unsubscribeGoalCreated();
      unsubscribeGoalUpdated();
      unsubscribeBackupRestored();
      unsubscribeTodoCompleted();
    };
  }, []);

  // Handle loading sample data and refreshing views
  const handleLoadSample = useCallback(async () => {
    const success = await backupRef.current.handleLoadSampleData();
    if (success) {
      await Promise.all([
        goalsRef.current.refreshGoals(),
        sanctuaryRef.current.refreshActions(),
        reflectionRef.current.refreshStats(),
        reflectionRef.current.refreshReflections(),
        todoRef.current.refreshTodos(),
        routineRef.current.refreshRoutines(),
        rewardRef.current.refreshRewards(),
      ]);
    }
  }, []);

  // Open Forge Wizard from anywhere
  const handleOpenForge = useCallback(() => {
    goalsRef.current.openForgeModal();
  }, []);

  // Stable callbacks for modals and drawer
  const handleOpenHansei = useCallback(() => {
    reflectionRef.current.openHanseiModal();
  }, []);
  const handleOpenBackup = useCallback(() => setIsBackupModalOpen(true), []);
  const handleCloseBackup = useCallback(() => setIsBackupModalOpen(false), []);
  const handleOpenGuide = useCallback(() => setIsGuideModalOpen(true), []);
  const handleCloseGuide = useCallback(() => setIsGuideModalOpen(false), []);
  const handleOpenTodo = useCallback(() => {
    setDrawerTab("todo");
    setIsDrawerOpen(true);
  }, []);
  const handleOpenRoutine = useCallback(() => {
    setDrawerTab("routine");
    setIsDrawerOpen(true);
  }, []);
  const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-sand-100 transition-colors overflow-x-hidden">
      {/* 0. Animated Zen Splash Screen on initial launch */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 1. Zen Japandi Header */}
      <Header
        currentStreak={reflectionController.stats.currentStreak}
        isGracePeriod={reflectionController.stats.isGracePeriod}
        onOpenHansei={handleOpenHansei}
        onOpenBackup={handleOpenBackup}
        onOpenGuide={handleOpenGuide}
        onLoadSample={handleLoadSample}
        onInstallPwa={promptInstall}
        canInstallPwa={isInstallable}
        onOpenTodo={handleOpenTodo}
        onOpenRoutine={handleOpenRoutine}
        activeTodosCount={todoController.activeTodosCount}
        remainingRoutinesCount={routineController.remainingCountToday}
      />

      {/* 2. Responsive Tab Navigation (Top on desktop, fixed bottom on mobile) */}
      <div className="pt-2 sm:pt-6 pb-2">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 3. Main Content Area with safe bottom padding on mobile */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-5 sm:space-y-6 pb-24 sm:pb-8 overflow-x-hidden">
        {/* Tab Views with Smooth Transition */}
        <AnimatePresence mode="wait">
          {activeTab === "sanctuary" && (
            <motion.div
              key="sanctuary"
              role="tabpanel"
              id="tabpanel-sanctuary"
              aria-labelledby="tab-sanctuary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SelfRewardBanner
                reward={rewardController.activeReward}
                isEarned={rewardController.isEarned}
                onClaim={rewardController.claimReward}
                onUpdateTitle={rewardController.updateRewardTitle}
              />
              <DailySanctuaryView
                controller={sanctuaryController}
                goals={goalsController.goals}
                onOpenGuide={handleOpenGuide}
              />
            </motion.div>
          )}

          {activeTab === "goals" && (
            <motion.div
              key="goals"
              role="tabpanel"
              id="tabpanel-goals"
              aria-labelledby="tab-goals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <GoalManagerView controller={goalsController} />
            </motion.div>
          )}

          {activeTab === "reflection" && (
            <motion.div
              key="reflection"
              role="tabpanel"
              id="tabpanel-reflection"
              aria-labelledby="tab-reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CompoundVisualizerView
                currentStreak={reflectionController.stats.currentStreak}
                longestStreak={reflectionController.stats.longestStreak}
                isGracePeriod={reflectionController.stats.isGracePeriod}
                totalMicroWins={reflectionController.stats.totalMicroWins}
                compoundMultiplier={reflectionController.stats.compoundMultiplier}
                percentageGain={reflectionController.stats.percentageGain}
                reflections={reflectionController.reflections}
                onOpenHanseiModal={handleOpenHansei}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals Shell */}
      {/* 5.1 Kaizen Guide Modal */}
      <KaizenGuideModal
        isOpen={isGuideModalOpen}
        onClose={handleCloseGuide}
        onOpenForge={handleOpenForge}
      />

      {/* 5.2 Hansei Reflection Modal */}
      <HanseiModal
        isOpen={reflectionController.isHanseiModalOpen}
        onClose={reflectionController.closeHanseiModal}
        onSubmit={async (data) => {
          await reflectionController.recordHansei(data);
        }}
        isSubmitting={reflectionController.isSubmitting}
      />

      {/* 5.3 Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={handleCloseBackup}
        controller={backupController}
      />

      {/* 5.4 Goal Forge Wizard Modal */}
      <GoalForgeWizard
        isOpen={goalsController.isForgeOpen || !!goalsController.editingGoal}
        onClose={() => {
          goalsController.closeForgeModal();
          goalsController.closeEditModal();
        }}
        initialGoal={goalsController.editingGoal}
        onSubmit={async (data) => {
          if (goalsController.editingGoal) {
            await goalsController.updateGoal({
              id: goalsController.editingGoal.id,
              ...data,
            });
          } else {
            await goalsController.createGoal(data as any);
          }
        }}
        isLoading={goalsController.isLoading}
        categories={goalsController.categories}
        onAddCategory={goalsController.addCategory}
        onDeleteCategory={goalsController.deleteCategory}
      />

      {/* 4. Mobile Floating Quick-Access Pill (Single-Hand Ergonomics) */}
      <button
        type="button"
        onClick={handleOpenTodo}
        aria-label="Buka Akses Cepat To-Do & Jadwal"
        className="sm:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-charcoal-900 text-sand-50 dark:bg-sand-100 dark:text-charcoal-900 shadow-lg shadow-charcoal-900/20 active:scale-95 transition-all border border-sand-200/20"
      >
        <ListTodo className="w-4 h-4 text-sage-400 dark:text-sage-600" />
        <span className="text-xs font-bold">Akses Cepat</span>
        {(todoController.activeTodosCount > 0 || routineController.remainingCountToday > 0) && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-sage-500 text-white">
            {todoController.activeTodosCount + routineController.remainingCountToday}
          </span>
        )}
      </button>

      {/* 5.5 Quick-Access Slide-Over Drawer / Bottom Sheet */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        activeTab={drawerTab}
        onTabChange={setDrawerTab}
        activeTodosCount={todoController.activeTodosCount}
        remainingRoutinesCount={routineController.remainingCountToday}
      >
        {drawerTab === "todo" ? (
          <TodoListPanel controller={todoController} />
        ) : (
          <RoutineSchedulePanel controller={routineController} />
        )}
      </SlideOverDrawer>
    </div>
  );
}
