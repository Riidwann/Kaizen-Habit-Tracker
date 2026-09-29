# Zen Minimalist UI & PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform KaizenFlow into an ultra-clean, Zen Minimalist habit tracker with everyday Indonesian terminology, a streamlined 3-tab layout, and full PWA offline/install capabilities.

**Architecture:** 
Decouple secondary header tools into a clean popover menu (`⋮`); simplify habit cards to 1-tap touch completion with a secondary action popover (`⋯`); streamline `TabNavigation` to 3 tabs (*Hari Ini*, *Target*, *Kemajuan*); implement automatic daily habit recurrence; and add web app manifest and offline service worker for PWA capabilities.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, LocalStorage, Service Worker (PWA), Vitest, React Testing Library.

**Spec:** [`docs/superpowers/specs/2026-09-29-zen-minimalist-pwa-design.md`](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-09-29-zen-minimalist-pwa-design.md)

## Global Constraints

- **Language:** 100% everyday Indonesian (no confusing technical or Japanese jargon).
- **Icons:** Lucide SVG icons only (never Unicode glyphs or emojis as icon substitutes).
- **Mobile Ergonomics:** Touch targets $\ge 44 \times 44\text{px}$, sticky bottom navigation on mobile.
- **PWA:** Valid web manifest, `display: "standalone"`, offline caching via `sw.js`.
- **Testing:** All existing and new integration tests must pass cleanly.

---

### Task 1: Daily Recurrence & Auto-Reset on Day Rollover

**Files:**
- Modify: `src/modules/sanctuary/infrastructure/LocalStorageSanctuaryRepository.ts`
- Test: `tests/modules/sanctuary/LocalStorageSanctuaryRepository.test.ts`

**Interfaces:**
- `findDailyFocusActions()`: Automatically resets `isCompletedToday = false` if `completedAt` was before today (midnight rollover), persisting the change.

- [ ] **Step 1: Write failing test for daily rollover reset**
  Add a test verifying that when a stored action was completed yesterday (`completedAt` set to yesterday's date), `findDailyFocusActions()` returns `isCompletedToday === false`.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run tests/modules/sanctuary/LocalStorageSanctuaryRepository.test.ts`.
- [ ] **Step 3: Implement midnight rollover check in repository**
  In `LocalStorageSanctuaryRepository.mapToDomain` or `findDailyFocusActions()`, check if `completedAt` date is strictly before today's date (`toDateString() !== new Date().toDateString()`). If so, reset `isCompletedToday = false`.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/modules/sanctuary/LocalStorageSanctuaryRepository.test.ts`.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(sanctuary): implement midnight rollover auto-reset for daily recurrence"`

---

### Task 2: Header Streamlining with `HeaderMenu` Component

**Files:**
- Create: `src/components/layout/HeaderMenu.tsx`
- Modify: `src/components/layout/Header.tsx`
- Test: `tests/components/layout/Header.test.tsx`

**Interfaces:**
- `HeaderMenuProps`:
  ```ts
  export interface HeaderMenuProps {
    onOpenGuide: () => void;
    onOpenBackup: () => void;
    onLoadSample: () => void;
    onInstallPwa?: () => void;
    canInstallPwa?: boolean;
  }
  ```
- `HeaderProps`: Updated to include `HeaderMenu` trigger while removing sprawling inline buttons for Backup and Guide.

- [ ] **Step 1: Create unit test for HeaderMenu**
  Verify clicking `⋮` button toggles menu options: "Panduan Kaizen", "Cadangan Data", "Muat Contoh Data", and "Pasang di Layar HP".
- [ ] **Step 2: Implement `HeaderMenu.tsx`**
  Build an accessible dropdown menu with outside-click detection, keyboard escape handling, and clear icons.
- [ ] **Step 3: Refactor `Header.tsx`**
  Replace inline Hansei, Guide, and Backup buttons with the compact `HeaderMenu`. Keep Logo, Streak Badge, Theme Toggle, and Menu `⋮`.
- [ ] **Step 4: Run Header tests and confirm pass**
  `npx vitest run tests/components/layout/Header.test.tsx`.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(layout): streamline header with HeaderMenu dropdown"`

---

### Task 3: Streamlined 3-Tab Navigation with Indonesian Terminology

**Files:**
- Modify: `src/components/layout/TabNavigation.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/components/layout/TabNavigation.test.tsx`

**Interfaces:**
- `TabId`: `"sanctuary" | "goals" | "reflection"` (remove `"backup"` tab).
- Labels:
  - `sanctuary`: label `"Hari Ini"`, description `"Kebiasaan harian 2-menit"`
  - `goals`: label `"Target"`, description `"Pohon tujuan & langkah kecil"`
  - `reflection`: label `"Kemajuan"`, description `"Grafik konsistensi & refleksi malam"`

- [ ] **Step 1: Update `TabNavigation.test.tsx`**
  Ensure test expects exactly 3 tabs: "Hari Ini", "Target", and "Kemajuan".
- [ ] **Step 2: Update `TabNavigation.tsx`**
  Remove `"backup"` tab from `TABS` array and update labels to everyday Indonesian.
- [ ] **Step 3: Update `page.tsx`**
  Remove `"backup"` tab panel from `page.tsx`. Ensure Backup Modal is opened from `HeaderMenu`.
- [ ] **Step 4: Run TabNavigation tests**
  `npx vitest run tests/components/layout/TabNavigation.test.tsx`.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(layout): streamline TabNavigation to 3 tabs with everyday Indonesian"`

---

### Task 4: Zen Minimalist Habit Card (`MicroActionCard.tsx`)

**Files:**
- Modify: `src/modules/sanctuary/presentation/MicroActionCard.tsx`
- Test: `tests/modules/sanctuary/MicroActionCard.test.tsx`

**Interfaces:**
- `MicroActionCardProps`:
  ```ts
  export interface MicroActionCardProps {
    action: MicroAction;
    onToggleComplete: (id: string) => void;
    onToggleScaleDown: (id: string) => void;
    onOpenTimer: (action: MicroAction) => void;
    onDelete?: (id: string) => void;
  }
  ```
- Visual:
  - 44px circular checkbox on the left.
  - Habit title + "2 mnt" badge in center.
  - Single `⋯` options button on the right opening popup with Timer, Peringan Tugas, and Hapus.

- [ ] **Step 1: Update `MicroActionCard.test.tsx`**
  Assert that timer and scale down buttons are accessible via the `⋯` menu.
- [ ] **Step 2: Refactor `MicroActionCard.tsx`**
  Remove cluttered inline buttons. Implement popover menu for secondary actions.
- [ ] **Step 3: Run card tests**
  `npx vitest run tests/modules/sanctuary/MicroActionCard.test.tsx`.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(sanctuary): declutter MicroActionCard with single-tap check and action popover"`

---

### Task 5: Simplified "Target" & "Kemajuan" Terminology

**Files:**
- Modify: `src/modules/goals/presentation/GoalManagerView.tsx`
- Modify: `src/modules/goals/presentation/GoalForgeWizard.tsx`
- Modify: `src/modules/reflection/presentation/HanseiModal.tsx`
- Modify: `src/modules/reflection/presentation/CompoundVisualizerView.tsx`
- Test: Existing module tests

- [ ] **Step 1: Update GoalManagerView copy**
  Replace "Goal Forge & Decomposition" with "Target & Langkah Kecil". Replace "Forge New Goal" with "Tambah Target".
- [ ] **Step 2: Update GoalForgeWizard copy**
  Replace "Emotional Anchor" with "Motivasi Utama".
- [ ] **Step 3: Update HanseiModal copy**
  Change title to "Refleksi Malam (30 Detik)". Change inputs to "1 hal kecil yang berhasil hari ini" and "1 penyesuaian kecil esok hari".
- [ ] **Step 4: Update CompoundVisualizerView copy**
  Change title to "Grafik Kemajuan 1%". Add quick button to open "Refleksi Malam".
- [ ] **Step 5: Run tests across modules**
  `npx vitest run tests/modules/goals tests/modules/reflection`.
- [ ] **Step 6: Commit changes**
  `git commit -m "feat(copy): replace technical jargon with clear Indonesian terms across goals and reflection"`

---

### Task 6: PWA Configuration & Offline Service Worker

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Create: `src/hooks/usePwaInstall.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- `usePwaInstall`: Hook that captures `beforeinstallprompt` event and exposes `isInstallable` and `promptInstall()`.
- `public/manifest.json`: Web manifest with `display: "standalone"`, icons, and colors.
- `public/sw.js`: Service worker caching static assets and enabling offline access.

- [ ] **Step 1: Create `public/manifest.json`**
  Add full Web App Manifest specification with icons, theme colors, and standalone display.
- [ ] **Step 2: Create `public/sw.js`**
  Implement cache-first static strategy and network-first navigation strategy with cache fallback.
- [ ] **Step 3: Create `src/hooks/usePwaInstall.ts`**
  Implement install prompt management hook.
- [ ] **Step 4: Update `src/app/layout.tsx`**
  Register service worker on window load and add PWA meta tags (`apple-mobile-web-app-capable`, `theme-color`).
- [ ] **Step 5: Connect PWA install to `HeaderMenu.tsx`**
  Pass install handler to HeaderMenu so clicking "Pasang di Layar HP" triggers browser prompt.
- [ ] **Step 6: Commit changes**
  `git commit -m "feat(pwa): add web app manifest, offline service worker, and install prompt"`

---

### Task 7: Integration Testing & Verification

**Files:**
- Modify: `tests/integration/KaizenFlowApp.test.tsx`

- [ ] **Step 1: Update integration tests**
  Update `KaizenFlowApp.test.tsx` to match the 3-tab layout, HeaderMenu options, and simplified card actions.
- [ ] **Step 2: Run all Vitest suites**
  `npm test -- --run` (ensure 100% pass across all 33 test files).
- [ ] **Step 3: Run Next.js production build**
  `npm run build` (ensure 0 lint/TypeScript errors).
- [ ] **Step 4: Commit and push to GitHub**
  `git push origin main`.
