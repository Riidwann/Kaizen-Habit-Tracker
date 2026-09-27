# Task 7 Brief: Shell Application, Navigation, and Layout Integration

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/TabNavigation.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/integration/KaizenFlowApp.test.tsx`

**Interfaces:**
- Consumes:
  - `@/modules/goals`: `GoalManagerView`, `GoalForgeWizard`, `useGoalsController`.
  - `@/modules/sanctuary`: `DailySanctuaryView`, `ActionTimerModal`, `useSanctuaryController`.
  - `@/modules/reflection`: `CompoundVisualizerView`, `HanseiModal`, `StreakBadge`, `useReflectionController`.
  - `@/modules/backup`: `DataBackupModal`, `useBackupController`.
  - `@/shared/presentation`: `Button`, `Card`, `Modal`, `Badge`.
- Produces:
  1. `Header`:
     - Logo & Brand: Zen Ensō symbol icon + text "KaizenFlow" with subtitle *"Satu langkah kecil hari ini."*
     - Live `StreakBadge` (connected to `useReflectionController`).
     - Quick Action: `🌙 Refleksi Hansei` button (opens Hansei modal).
     - Quick Action: `⚙️ Cadangan Data` button (opens Backup modal).
     - Theme Toggle (Light / Dark mode).
  2. `TabNavigation`:
     - 4 Zen tabs with clean pill indicators and icons:
       - 🌿 **Sanctuary (Fokus Harian)**
       - 🔨 **Goal Forge (Pohon Tujuan)**
       - 📈 **1% Compound (Pertumbuhan)**
       - ⚙️ **Cadangan Data**
  3. `Footer`:
     - Minimalist footer with Kaizen wisdom quote: *"Perjalanan seribu mil dimulai dengan satu langkah mikro yang terlalu kecil untuk memicu rasa malas."*
  4. `src/app/page.tsx`:
     - Connects all controllers and renders the active tab smoothly using Framer Motion tab transitions.
     - On first visit with empty storage, automatically displays a welcoming banner to start or load sample data.
     - Modals (Forge Wizard, Hansei Reflection, Action Timer, Backup Manager) rendered and accessible throughout the app.
  5. `tests/integration/KaizenFlowApp.test.tsx`:
     - Full integration test verifying:
       1. App loads and renders Header, Navigation, and Sanctuary by default.
       2. Switching to Goal Forge tab renders Goal Manager.
       3. Switching to 1% Compound tab renders Compound Growth visualizer.
       4. Clicking Hansei opens Hansei modal and saves reflection.
       5. Clicking Backup opens Data Backup modal.

### Step-by-Step Instructions:

1. **Write failing integration tests**:
   - `tests/integration/KaizenFlowApp.test.tsx`: test tab switching, modal openings, and full app shell integration.

2. **Implement Layout Shell Components**:
   - `src/components/layout/Header.tsx`
   - `src/components/layout/TabNavigation.tsx`
   - `src/components/layout/Footer.tsx`

3. **Implement Full App in `src/app/page.tsx` & `src/app/layout.tsx`**:
   - Connect `useGoalsController`, `useSanctuaryController`, `useReflectionController`, and `useBackupController`.
   - Wire up EventBus so goal creation automatically adds micro-actions to daily sanctuary, and micro-action completion updates reflection streaks seamlessly.

4. **Run integration test**:
   Run `npx vitest run tests/integration/KaizenFlowApp.test.tsx` to ensure 100% pass.

5. **Commit**:
   `git add src/components/layout/ src/app/ tests/integration/` and `git commit -m "feat: integrate modular monolith in app shell with zen navigation and controllers"`.
