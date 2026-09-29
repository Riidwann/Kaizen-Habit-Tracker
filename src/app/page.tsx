"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { TabNavigation, TabId } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { KaizenGuideModal } from "@/components/layout/KaizenGuideModal";

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
import { Button } from "@/shared/presentation/Button";
import { Card } from "@/shared/presentation/Card";
import { Badge } from "@/shared/presentation/Badge";
import { inMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

// Icons
import {
  Sparkles,
  Download,
  Upload,
  Database,
  ShieldCheck,
  Plus,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("sanctuary");
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Initialize Controllers
  const goalsController = useGoalsController();
  const sanctuaryController = useSanctuaryController();
  const reflectionController = useReflectionController();
  const backupController = useBackupController();

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

  // Check if user is visiting for the first time with empty local storage
  const isStorageEmpty =
    !goalsController.isLoading &&
    !sanctuaryController.isLoading &&
    goalsController.goals.length === 0 &&
    sanctuaryController.actions.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-sand-100 transition-colors">
      {/* 1. Zen Japandi Header */}
      <Header
        currentStreak={reflectionController.stats.currentStreak}
        isGracePeriod={reflectionController.stats.isGracePeriod}
        onOpenHansei={reflectionController.openHanseiModal}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* 2. Responsive Tab Navigation (Top on desktop, fixed bottom on mobile) */}
      <div className="pt-2 sm:pt-6 pb-2">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 3. Main Content Area with safe bottom padding on mobile */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-5 sm:space-y-6 pb-24 sm:pb-8">
        {/* Welcoming Starter Banner (Rendered when storage is empty) */}
        {isStorageEmpty && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sage-50/80 to-sand-100/90 dark:from-charcoal-900 dark:to-charcoal-800/90 border border-sage-200/90 dark:border-charcoal-700 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="sage" size="sm" className="gap-1">
                      <Sparkles className="w-3 h-3 text-sage-600" />
                      <span>Filosofi Kaizen</span>
                    </Badge>
                    <span className="text-xs font-semibold text-sage-700 dark:text-sage-400">
                      Too Small to Fail (Mustahil Gagal)
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
                    Selamat Datang di KaizenFlow
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Perubahan besar dimulai dari tindakan mikro 2-menit yang terlalu kecil untuk
                    memicu rasa malas. Muat data percontohan untuk melihat ekosistem bekerja,
                    atau buka panduan singkat untuk memahami cara kerjanya.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsGuideModalOpen(true)}
                    leftIcon={<BookOpen className="w-3.5 h-3.5 text-sage-600" />}
                    className="flex-1 sm:flex-initial text-xs font-medium justify-center"
                  >
                    Pelajari Kaizen
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLoadSample}
                    disabled={backupController.isLoadingSample}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-sage-600" />}
                    className="flex-1 sm:flex-initial text-xs font-medium justify-center"
                  >
                    {backupController.isLoadingSample ? "Memuat..." : "Muat Contoh Data"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleOpenForge}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="flex-1 sm:flex-initial text-xs font-medium justify-center"
                  >
                    Tempa Sasaran Pertama
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

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

          {activeTab === "backup" && (
            <motion.div
              key="backup"
              role="tabpanel"
              id="tabpanel-backup"
              aria-labelledby="tab-backup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-5 sm:space-y-6"
            >
              <Card className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-sand-200/90 dark:border-charcoal-800 space-y-5 sm:space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand-200/80 dark:border-charcoal-800 pb-3 sm:pb-4 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-sand-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-sand-300">
                        <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
                        Pusat Manajemen Cadangan & Privasi
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-500 dark:text-sand-400">
                      Seluruh kemajuan dan catatan Anda disimpan 100% secara lokal. Kelola cadangan atau pulihkan kapan saja.
                    </p>
                  </div>

                  <Badge variant="sage" size="md" className="self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Lokal & Privat
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-sand-50/70 dark:bg-charcoal-800/50 border border-sand-200 dark:border-charcoal-700 space-y-2.5 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-sand-100 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-sage-600" />
                      Ekspor Data Cadangan
                    </h3>
                    <p className="text-xs text-charcoal-500 dark:text-sand-400">
                      Unduh berkas JSON berisi seluruh tujuan, aksi harian, dan riwayat Hansei.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={backupController.handleExport}
                      disabled={backupController.isExporting}
                      className="w-full text-xs"
                    >
                      {backupController.isExporting ? "Menyiapkan..." : "Unduh Cadangan JSON"}
                    </Button>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-sand-50/70 dark:bg-charcoal-800/50 border border-sand-200 dark:border-charcoal-700 space-y-2.5 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-sand-100 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-600" />
                      Buka Panel Pemulihan
                    </h3>
                    <p className="text-xs text-charcoal-500 dark:text-sand-400">
                      Unggah berkas JSON cadangan, muat data contoh, atau reset data.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsBackupModalOpen(true)}
                      className="w-full text-xs"
                    >
                      Buka Dialog Cadangan Lengkap
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Minimalist Zen Footer (with extra bottom margin on mobile to clear bottom bar) */}
      <Footer className="mb-14 sm:mb-0" />

      {/* 5. Modals Shell */}
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
