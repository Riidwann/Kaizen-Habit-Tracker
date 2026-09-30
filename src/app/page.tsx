"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { TabNavigation, TabId } from "@/components/layout/TabNavigation";
import { KaizenGuideModal } from "@/components/layout/KaizenGuideModal";
import { usePwaInstall } from "@/hooks/usePwaInstall";

// Module Controllers & Views
import {
  GoalManagerView,
  GoalForgeWizard,
  useGoalsController,
} from "@/modules/goals";
import {
  DailySanctuaryView,
  useSanctuaryController,
} from "@/modules/sanctuary";
import {
  CompoundVisualizerView,
  HanseiModal,
  useReflectionController,
} from "@/modules/reflection";
import {
  DataBackupModal,
  useBackupController,
} from "@/modules/backup";

// UI Kit
import { inMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("sanctuary");
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Initialize Controllers
  const goalsController = useGoalsController();
  const sanctuaryController = useSanctuaryController();
  const reflectionController = useReflectionController();
  const backupController = useBackupController();
  const { isInstallable, promptInstall } = usePwaInstall();

  const sanctuaryRef = useRef(sanctuaryController);
  sanctuaryRef.current = sanctuaryController;

  const goalsRef = useRef(goalsController);
  goalsRef.current = goalsController;

  const reflectionRef = useRef(reflectionController);
  reflectionRef.current = reflectionController;

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

    const unsubscribeBackupRestored = inMemoryEventBus.subscribe(
      "BackupRestored",
      async () => {
        await Promise.all([
          goalsRef.current.refreshGoals(),
          sanctuaryRef.current.refreshActions(),
          reflectionRef.current.refreshStats(),
          reflectionRef.current.refreshReflections(),
        ]);
      }
    );

    return () => {
      unsubscribeGoalCreated();
      unsubscribeBackupRestored();
    };
  }, []);

  // Handle loading sample data and refreshing views
  const handleLoadSample = useCallback(async () => {
    const success = await backupController.handleLoadSampleData();
    if (success) {
      await Promise.all([
        goalsController.refreshGoals(),
        sanctuaryController.refreshActions(),
        reflectionController.refreshStats(),
        reflectionController.refreshReflections(),
      ]);
    }
  }, [
    backupController,
    goalsController,
    sanctuaryController,
    reflectionController,
  ]);

  // Open Forge Wizard from anywhere (switches to Goals tab)
  const handleOpenForge = useCallback(() => {
    setActiveTab("goals");
    goalsController.openForgeModal();
  }, [goalsController]);

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-sand-100 transition-colors overflow-x-hidden">
      {/* 1. Zen Japandi Header */}
      <Header
        currentStreak={reflectionController.stats.currentStreak}
        isGracePeriod={reflectionController.stats.isGracePeriod}
        onOpenHansei={reflectionController.openHanseiModal}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onLoadSample={handleLoadSample}
        onInstallPwa={promptInstall}
        canInstallPwa={isInstallable}
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
            >
              <DailySanctuaryView
                controller={sanctuaryController}
                onOpenGuide={() => setIsGuideModalOpen(true)}
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
                onOpenHanseiModal={reflectionController.openHanseiModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals Shell */}
      {/* 5.1 Kaizen Guide Modal */}
      <KaizenGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
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
        onClose={() => setIsBackupModalOpen(false)}
        controller={backupController}
      />

      {/* 5.4 Goal Forge Wizard Modal (Active when opened outside goals tab) */}
      {activeTab !== "goals" && (
        <GoalForgeWizard
          isOpen={goalsController.isForgeOpen}
          onClose={goalsController.closeForgeModal}
          onSubmit={async (data) => {
            await goalsController.createGoal(data);
          }}
          isLoading={goalsController.isLoading}
        />
      )}
    </div>
  );
}
