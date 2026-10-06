# Rencana Implementasi: Pembersihan UI, Branding Konsep B, dan Optimasi Performa KaizenFlow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghadirkan antarmuka KaizenFlow yang lapang (*decluttered*), pengelompokan aksi mikro berdasarkan Goal induk, formulir drawer yang ringkas (*collapsible*), responsivitas tombol seketika tanpa lag DOM, branding resmi logo Konsep B (*Tobi-Ishi K*), serta *Animated Zen Splash Screen* berdurasi ~1,4 detik.

**Architecture:** Pemisahan komponen UI presentasional murni dari beban re-render layout DOM (`layout` prop removal), pengelompokan memoisasi data per `goalId` di view layer, penataan aset SVG monogram *Tobi-Ishi K* untuk PWA dan header, serta orkestrasi animasi Framer Motion berbasis GPU untuk splash screen interaktif.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-06-declutter-ui-branding-and-performance-design.md`

## Global Constraints

- Seluruh 51 test suites (293 tests) harus tetap lulus 100% (*green*).
- Kompatibilitas props mundur (*backward compatibility*) harus dipertahankan 100%.
- Menghormati preferensi aksesibilitas `prefers-reduced-motion` dan standar ergonomi sentuh minimal 44x44px.
- Kompilasi TypeScript harus bersih (0 error pada `npx tsc --noEmit`).

---

### Task 1: Branding Logo Konsep B (Tobi-Ishi K Monogram) & PWA Manifest Assets

**Files:**
- Create: `public/icons/icon-192.svg`
- Create: `public/icons/icon-512.svg`
- Modify: `src/components/layout/Header.tsx:25-46`
- Modify: `public/manifest.json:7-23`
- Modify: `src/app/layout.tsx:20-25`
- Test: `tests/components/layout/Header.test.tsx`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Produces: `TobiIshiLogo: React.FC<{ className?: string }>` di `src/components/layout/Header.tsx` (menggantikan `EnsoLogo` dengan backward compatibility alias).
- Consumes: Monogram vektor Konsep B dari `docs/branding/concept-b-symbol.svg`.

- [ ] **Step 1: Tulis tes yang gagal untuk logo baru di `tests/components/layout/Header.test.tsx` dan aset manifest di `tests/unit/env.test.ts`**

Update `tests/components/layout/Header.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Header, TobiIshiLogo } from "@/components/layout/Header";

// Tambahkan test case untuk TobiIshiLogo
it("renders TobiIshiLogo with correct aria label and monogram geometry", () => {
  render(<TobiIshiLogo className="w-8 h-8" />);
  const logo = screen.getByLabelText(/tobi-ishi k|kaizenflow logo/i);
  expect(logo).toBeInTheDocument();
});
```

Dan update `tests/unit/env.test.ts` untuk memeriksa background color manifest baru:
```typescript
it("verifies manifest.json contains updated Concept B zen background color", () => {
  const manifestPath = path.resolve(process.cwd(), "public/manifest.json");
  const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  expect(manifestContent.background_color).toBe("#FDFBF7");
  expect(manifestContent.theme_color).toBe("#121214");
});
```

- [ ] **Step 2: Jalankan tes untuk memverifikasi kegagalan**

Jalankan: `npm run test -- tests/components/layout/Header.test.tsx tests/unit/env.test.ts`
Ekspektasi: FAIL karena `TobiIshiLogo` belum diekspor dan `manifest.json` masih `#FAFAF9`.

- [ ] **Step 3: Implementasikan aset SVG Konsep B, Header TobiIshiLogo, dan konfigurasi manifest**

Tulis `public/icons/icon-192.svg` dan `public/icons/icon-512.svg` dengan geometri Konsep B:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="42" fill="#121214"/>
  <g transform="translate(40, 24) scale(0.44)">
    <rect x="50" y="42" width="32" height="172" rx="16" fill="#FDFBF7" />
    <g transform="translate(116, 114) rotate(-45)">
      <rect x="0" y="-16" width="122" height="32" rx="16" fill="#10B981" />
    </g>
    <g transform="translate(116, 142) rotate(45)">
      <rect x="0" y="-16" width="94" height="32" rx="16" fill="#FDFBF7" />
    </g>
  </g>
</svg>
```

Update `src/components/layout/Header.tsx`:
```tsx
/**
 * Tobi-Ishi K Monogram (Concept B: Zen Stepping Stones)
 * Grounded spine (daily discipline) + Upper 1% stone (emerald) + Lower foundation stone.
 */
export const TobiIshiLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    aria-label="Tobi-Ishi K - KaizenFlow Logo"
  >
    {/* Grounded Habit Spine */}
    <rect x="50" y="42" width="32" height="172" rx="16" className="fill-charcoal-900 dark:fill-sand-50" />
    {/* Upper Stepping Stone (1% Growth Accent) */}
    <g transform="translate(116, 114) rotate(-45)">
      <rect x="0" y="-16" width="122" height="32" rx="16" className="fill-emerald-600 dark:fill-emerald-400" />
    </g>
    {/* Lower Stepping Stone */}
    <g transform="translate(116, 142) rotate(45)">
      <rect x="0" y="-16" width="94" height="32" rx="16" className="fill-charcoal-900 dark:fill-sand-50" />
    </g>
  </svg>
);

// Backward compatibility alias
export const EnsoLogo = TobiIshiLogo;
```
Ganti `<EnsoLogo ... />` pada render Header menjadi `<TobiIshiLogo className="w-7 h-7 sm:w-8 sm:h-8" />`.

Update `public/manifest.json`:
```json
{
  "name": "KaizenFlow: Kebiasaan Mikro 1%",
  "short_name": "KaizenFlow",
  "description": "Aplikasi habit tracker berbasis filosofi Kaizen 1% dan aturan 2 menit.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FDFBF7",
  "theme_color": "#121214",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 4: Jalankan tes untuk memverifikasi kelulusan**

Jalankan: `npm run test -- tests/components/layout/Header.test.tsx tests/unit/env.test.ts`
Ekspektasi: PASS.

- [ ] **Step 5: Commit perubahan**

```bash
git add public/icons/ public/manifest.json src/components/layout/Header.tsx tests/components/layout/Header.test.tsx tests/unit/env.test.ts
git commit -m "feat(branding): implement Concept B Tobi-Ishi K monogram logo and PWA assets"
```

---

### Task 2: Komponen Animated Zen Splash Screen (`SplashScreen.tsx`)

**Files:**
- Create: `src/components/layout/SplashScreen.tsx`
- Create: `tests/components/layout/SplashScreen.test.tsx`
- Modify: `src/app/page.tsx:83-120`

**Interfaces:**
- Produces: `SplashScreen: React.FC<SplashScreenProps>` dengan props `{ onComplete?: () => void, forceShow?: boolean, minDurationMs?: number }`.
- Consumes: Animasi Framer Motion berakselerasi GPU dan SVG `TobiIshiLogo`.

- [ ] **Step 1: Tulis tes yang gagal untuk SplashScreen di `tests/components/layout/SplashScreen.test.tsx`**

```tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SplashScreen } from "@/components/layout/SplashScreen";

describe("SplashScreen", () => {
  it("renders brand logo, wordmark, and tagline", () => {
    render(<SplashScreen minDurationMs={1000} />);
    expect(screen.getByText("KaizenFlow")).toBeInTheDocument();
    expect(screen.getByText(/1% BETTER EVERY DAY/i)).toBeInTheDocument();
  });

  it("calls onComplete when user taps the screen to skip", () => {
    const onComplete = vi.fn();
    render(<SplashScreen minDurationMs={2000} onComplete={onComplete} />);
    const container = screen.getByTestId("splash-screen");
    fireEvent.click(container);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Jalankan tes untuk memverifikasi kegagalan**

Jalankan: `npm run test -- tests/components/layout/SplashScreen.test.tsx`
Ekspektasi: FAIL ("Cannot find module '@/components/layout/SplashScreen'").

- [ ] **Step 3: Implementasikan `src/components/layout/SplashScreen.tsx` dan kaitkan di `src/app/page.tsx`**

Buat `src/components/layout/SplashScreen.tsx`:
```tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  forceShow = false,
  minDurationMs = 1400,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, handleDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-testid="splash-screen"
          onClick={handleDismiss}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sand-50 dark:bg-charcoal-950 cursor-pointer select-none"
        >
          {/* Animated Tobi-Ishi K Monogram */}
          <div className="relative flex items-center justify-center">
            {/* Zen Ripple */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 1.8], opacity: [0, 0.25, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-36 h-36 rounded-full border border-emerald-500/30"
            />

            <svg
              viewBox="0 0 256 256"
              className="w-24 h-24 sm:w-28 sm:h-28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grounded Habit Spine */}
              <motion.rect
                x="50"
                y="42"
                width="32"
                height="172"
                rx="16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fill-charcoal-900 dark:fill-sand-50"
              />

              {/* Upper Stepping Stone: 1% Continuous Growth */}
              <g transform="translate(116, 114) rotate(-45)">
                <motion.rect
                  x="0"
                  y="-16"
                  width="122"
                  height="32"
                  rx="16"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                  className="fill-emerald-600 dark:fill-emerald-400"
                />
              </g>

              {/* Lower Stepping Stone */}
              <g transform="translate(116, 142) rotate(45)">
                <motion.rect
                  x="0"
                  y="-16"
                  width="94"
                  height="32"
                  rx="16"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
                  className="fill-charcoal-900 dark:fill-sand-50"
                />
              </g>
            </svg>
          </div>

          {/* Brand Wordmark & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-900 dark:text-sand-50">
              <span>Kaizen</span>
              <span className="font-light text-charcoal-500 dark:text-sand-400">Flow</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5" />
            </div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-charcoal-500 dark:text-sand-400">
              1% BETTER EVERY DAY
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

Kaitkan di `src/app/page.tsx`:
Gunakan pengecekan `sessionStorage` (`"kaizenflow_splash_seen"`) sehingga diputar sekali per sesi startup aplikasi.

- [ ] **Step 4: Jalankan tes untuk memverifikasi kelulusan**

Jalankan: `npm run test -- tests/components/layout/SplashScreen.test.tsx`
Ekspektasi: PASS.

- [ ] **Step 5: Commit perubahan**

```bash
git add src/components/layout/SplashScreen.tsx tests/components/layout/SplashScreen.test.tsx src/app/page.tsx
git commit -m "feat(ui): add animated Zen splash screen on app launch with Tobi-Ishi K monogram"
```

---

### Task 3: Eliminasi Lag & Delay Interaksi Tombol (`MicroActionCard.tsx` & Web Audio)

**Files:**
- Modify: `src/modules/sanctuary/presentation/MicroActionCard.tsx:78-96`
- Modify: `src/shared/infrastructure/WebAudioService.ts:35-48`
- Test: `tests/modules/sanctuary/DailySanctuaryView.test.tsx`

**Interfaces:**
- Produces: Respons checkbox instan tanpa DOM `layout` thrashing.
- Consumes: `action: MicroAction`, `onToggle: () => void`.

- [ ] **Step 1: Tulis/verifikasi tes interaksi toggle di `DailySanctuaryView.test.tsx`**

Pastikan tes memverifikasi `handleToggleComplete` dipanggil saat checkbox diklik:
```tsx
it("triggers handleToggleComplete when checkbox is clicked", () => {
  render(<DailySanctuaryView controller={mockController} />);
  const checkboxes = screen.getAllByRole("checkbox");
  fireEvent.click(checkboxes[0]);
  expect(mockController.handleToggleComplete).toHaveBeenCalledWith("act-1");
});
```

- [ ] **Step 2: Jalankan tes saat ini**

Jalankan: `npm run test -- tests/modules/sanctuary/DailySanctuaryView.test.tsx`
Ekspektasi: PASS (verifikasi baseline aman).

- [ ] **Step 3: Refaktor `MicroActionCard.tsx` dan `WebAudioService.ts`**

Di `src/modules/sanctuary/presentation/MicroActionCard.tsx`:
Hapus prop `layout` pada baris 81:
```tsx
// SEBELUM:
<motion.div
  ref={ref}
  layout
  initial={{ opacity: 0, y: 12 }}
  ...
>

// SESUDAH:
<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.98 }}
  transition={{ duration: 0.12, ease: "easeOut" }}
  className={cn(
    "relative group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl transition-colors duration-150",
    ...
  )}
>
```

Di `src/shared/infrastructure/WebAudioService.ts`:
Pastikan `playSuccessChime()` dibungkus dalam `requestAnimationFrame` atau asinkron non-blocking agar tidak menahan main thread JavaScript React:
```typescript
playSuccessChime(): void {
  if (typeof window === "undefined") return;
  // Non-blocking execution via requestAnimationFrame
  window.requestAnimationFrame(() => {
    try {
      this.playToneSequence([523.25, 659.25, 783.99, 1046.50]); // C5, E5, G5, C6
    } catch {
      // Audio context failure gracefully ignored
    }
  });
}
```

- [ ] **Step 4: Jalankan tes untuk memverifikasi tidak ada regresi**

Jalankan: `npm run test -- tests/modules/sanctuary/DailySanctuaryView.test.tsx`
Ekspektasi: PASS.

- [ ] **Step 5: Commit perubahan**

```bash
git add src/modules/sanctuary/presentation/MicroActionCard.tsx src/shared/infrastructure/WebAudioService.ts
git commit -m "perf(sanctuary): eliminate button lag by removing layout prop and making chime non-blocking"
```

---

### Task 4: Pembersihan Halaman Utama & Pengelompokan Aksi Mikro Berdasarkan Goal

**Files:**
- Modify: `src/modules/sanctuary/presentation/DailySanctuaryView.tsx`
- Modify: `src/app/page.tsx:280-295`
- Test: `tests/modules/sanctuary/DailySanctuaryView.test.tsx`

**Interfaces:**
- Produces: `DailySanctuaryView` yang bersih tanpa teks panduan panjang, dengan aksi mikro yang terkelompok per `goalId`.
- Consumes: `controller: SanctuaryController`, `goals?: Goal[]`, `onOpenGuide?: () => void`.

- [ ] **Step 1: Tulis tes pengelompokan berdasarkan Goal di `tests/modules/sanctuary/DailySanctuaryView.test.tsx`**

```tsx
it("groups micro-actions by their parent goals with clean category headers", () => {
  const mockGoals = [
    { id: "goal-1", title: "Belajar TypeScript", category: "learning" },
    { id: "goal-2", title: "Kebugaran Fisik", category: "health" },
  ];

  render(<DailySanctuaryView controller={mockController} goals={mockGoals as any} />);

  // Goal headers should be visible
  expect(screen.getByText("Belajar TypeScript")).toBeInTheDocument();
  expect(screen.getByText("Kebugaran Fisik")).toBeInTheDocument();

  // Clutter guide paragraphs should not be in document
  expect(screen.queryByText(/Fokus pada 1–3 langkah mikro sederhana hari ini/i)).not.toBeInTheDocument();
});

it("places unassociated actions under 'Fokus Harian Lainnya'", () => {
  const unlinkedAction = MicroAction.create({
    id: "act-3",
    goalId: "unknown-goal",
    title: "Meditasi 2 menit",
    scaleDownTitle: "Tarik napas dalam 3x",
    estimatedMinutes: 2,
    category: "mindfulness",
    isActiveToday: true,
    isCompletedToday: false,
  }).unwrap();

  const controllerWithUnlinked = {
    ...mockController,
    actions: [...mockController.actions, unlinkedAction],
    totalCount: 3,
  };

  render(<DailySanctuaryView controller={controllerWithUnlinked} goals={[]} />);
  expect(screen.getByText("Fokus Harian Lainnya")).toBeInTheDocument();
});
```

- [ ] **Step 2: Jalankan tes untuk memverifikasi kegagalan**

Jalankan: `npm run test -- tests/modules/sanctuary/DailySanctuaryView.test.tsx`
Ekspektasi: FAIL karena pengelompokan goal belum ada dan teks panduan masih ada.

- [ ] **Step 3: Implementasikan pembersihan dan pengelompokan di `DailySanctuaryView.tsx`**

1. Tambahkan prop `goals?: Goal[]` ke `DailySanctuaryViewProps`.
2. Hapus teks panduan panjang dan badge `1-3 Tindakan` di header. Buat header sangat ramping dan elegan.
3. Kelompokkan `actions` menggunakan `useMemo`:
```tsx
interface ActionGroup {
  goalId: string;
  goalTitle: string;
  category: string;
  actions: MicroAction[];
}

const groupedActions = useMemo<ActionGroup[]>(() => {
  const groupsMap = new Map<string, ActionGroup>();

  for (const action of actions) {
    const goal = goals?.find((g) => g.id === action.goalId);
    const groupKey = goal ? goal.id : "unlinked";
    const goalTitle = goal ? goal.title : "Fokus Harian Lainnya";
    const category = goal?.category || action.category || "general";

    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        goalId: groupKey,
        goalTitle,
        category,
        actions: [],
      });
    }
    groupsMap.get(groupKey)!.actions.push(action);
  }

  return Array.from(groupsMap.values());
}, [actions, goals]);
```
4. Render setiap grup dengan subheader minimalis:
```tsx
<div className="space-y-6">
  {groupedActions.map((group) => (
    <section key={group.goalId} className="space-y-2.5">
      <div className="flex items-center gap-2 px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-sand-300">
          {group.goalTitle}
        </h2>
      </div>
      <div className="space-y-2.5">
        {group.actions.map((action) => (
          <MicroActionCard
            key={action.id}
            action={action}
            onToggleComplete={() => handleToggleComplete(action.id)}
            onToggleScaleDown={() => handleToggleScaleDown(action.id)}
            onStartTimer={() => handleOpenTimer(action)}
          />
        ))}
      </div>
    </section>
  ))}
</div>
```
5. Di `src/app/page.tsx`, teruskan `goals={goalsController.goals}` ke `<DailySanctuaryView />`.

- [ ] **Step 4: Jalankan tes untuk memverifikasi kelulusan**

Jalankan: `npm run test -- tests/modules/sanctuary/DailySanctuaryView.test.tsx`
Ekspektasi: PASS.

- [ ] **Step 5: Commit perubahan**

```bash
git add src/modules/sanctuary/presentation/DailySanctuaryView.tsx src/app/page.tsx tests/modules/sanctuary/DailySanctuaryView.test.tsx
git commit -m "feat(sanctuary): declutter header and group micro-actions by parent goals"
```

---

### Task 5: Penyederhanaan Panel Drawer Akses Cepat (`TodoListPanel.tsx` & `RoutineSchedulePanel.tsx`)

**Files:**
- Modify: `src/modules/todo/presentation/TodoListPanel.tsx:120-195`
- Modify: `src/modules/routines/presentation/RoutineSchedulePanel.tsx:115-180`
- Test: `tests/modules/todo/TodoListPanel.test.tsx`
- Test: `tests/modules/routines/RoutineSchedulePanel.test.tsx`

**Interfaces:**
- Produces: Single-line quick add form dengan opsi detail tersembunyi secara default (*collapsible*).
- Consumes: Controller methods `addTodo` dan `addRoutine`.

- [ ] **Step 1: Tulis tes untuk form ringkas & toggle opsi lanjutan**

Di `tests/modules/todo/TodoListPanel.test.tsx`:
```tsx
it("renders lean single-line quick add form and toggles options", () => {
  render(<TodoListPanel controller={mockController} />);
  expect(screen.getByPlaceholderText(/tambah tugas baru/i)).toBeInTheDocument();
  // Options toggle button exists
  const toggleBtn = screen.getByLabelText(/opsi tambahan|atur prioritas/i);
  expect(toggleBtn).toBeInTheDocument();
});
```

Di `tests/modules/routines/RoutineSchedulePanel.test.tsx`:
```tsx
it("renders lean quick add form and allows toggling schedule days", () => {
  render(<RoutineSchedulePanel controller={mockController} />);
  expect(screen.getByPlaceholderText(/nama rutinitas/i)).toBeInTheDocument();
  const optionsToggle = screen.getByLabelText(/opsi jadwal|pilih hari/i);
  expect(optionsToggle).toBeInTheDocument();
});
```

- [ ] **Step 2: Jalankan tes untuk memverifikasi kegagalan**

Jalankan: `npm run test -- tests/modules/todo/TodoListPanel.test.tsx tests/modules/routines/RoutineSchedulePanel.test.tsx`
Ekspektasi: FAIL pada pengecekan label tombol toggle opsi lanjutan.

- [ ] **Step 3: Implementasikan form ringkas dan collapsible options**

Di `TodoListPanel.tsx`:
1. Tambahkan state `const [isOptionsOpen, setIsOptionsOpen] = useState(false);`.
2. Gabungkan input dan tombol tambah + tombol toggle opsi dalam 1 baris yang ramping:
```tsx
<div className="flex items-center gap-2">
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Tambah tugas baru..."
    className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-charcoal-900 border ..."
  />
  <button
    type="button"
    onClick={() => setIsOptionsOpen((prev) => !prev)}
    aria-label="Atur prioritas dan tenggat"
    title="Opsi Tambahan"
    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-sand-300 dark:border-charcoal-700 hover:bg-sand-200/50 flex items-center justify-center transition-colors"
  >
    <SlidersHorizontal className="w-4 h-4 text-charcoal-600 dark:text-sand-400" />
  </button>
  <button type="submit" ...>
    <Plus className="w-4 h-4" />
    <span className="hidden sm:inline">Tambah</span>
  </button>
</div>

{isOptionsOpen && (
  <div className="pt-2 border-t border-sand-200/60 dark:border-charcoal-800 space-y-2 animate-in fade-in duration-150">
    {/* Priority selector & Due date */}
  </div>
)}
```

Di `RoutineSchedulePanel.tsx`:
Lakukan perampingan serupa dengan `const [isOptionsOpen, setIsOptionsOpen] = useState(false);` untuk menyembunyikan pilihan chip hari berulang secara default.

- [ ] **Step 4: Jalankan tes untuk memverifikasi kelulusan**

Jalankan: `npm run test -- tests/modules/todo/TodoListPanel.test.tsx tests/modules/routines/RoutineSchedulePanel.test.tsx`
Ekspektasi: PASS.

- [ ] **Step 5: Commit perubahan**

```bash
git add src/modules/todo/presentation/TodoListPanel.tsx src/modules/routines/presentation/RoutineSchedulePanel.tsx tests/modules/todo/TodoListPanel.test.tsx tests/modules/routines/RoutineSchedulePanel.test.tsx
git commit -m "feat(drawer): simplify todo and routine forms into lean quick-add with collapsible options"
```

---

### Task 6: Validasi Komprehensif Seluruh Test Suite & Production Build

**Files:**
- Test: All 51+ test suites
- Build: Next.js production build

**Interfaces:**
- Produces: 100% pass across all tests, 0 TypeScript errors, clean production bundle.

- [ ] **Step 1: Jalankan seluruh test suite**

Jalankan: `npm run test`
Ekspektasi: Seluruh 51+ test suites lolos tanpa ada kegagalan.

- [ ] **Step 2: Jalankan pemeriksaan kompilasi TypeScript**

Jalankan: `npx tsc --noEmit`
Ekspektasi: 0 error.

- [ ] **Step 3: Jalankan Next.js production build**

Jalankan: `powershell -Command "if (Test-Path .next) { Remove-Item -Recurse -Force .next }; npm run build"`
Ekspektasi: Build berhasil dengan exit code 0 dan output chunk terpisah secara rapi.

- [ ] **Step 4: Commit hasil verifikasi jika ada penyesuaian akhir**

```bash
git add -A
git commit -m "chore: comprehensive validation of decluttered UI, Concept B branding, and performance"
```
