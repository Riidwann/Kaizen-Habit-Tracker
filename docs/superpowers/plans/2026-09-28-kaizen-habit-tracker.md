# KaizenFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web habit & goal tracking "KaizenFlow" berbasis prinsip psikologi Kaizen untuk memecah tujuan besar menjadi tindakan mikro $\le$ 2 menit (*too small to fail*), mematikan resistensi amygdala dengan *Tunnel Vision*, *Emergency Scale-Down*, *Never Miss Twice Streak*, dan refleksi malam *Hansei*.

**Architecture:** Next.js (App Router, Client-side SPA mode) dengan Zustand persist store untuk Local-First offline storage. Komponen UI modular bergaya *Zen Japandi Sanctuary* dengan Tailwind CSS, Framer Motion untuk transisi tenang, dan Web Audio API untuk *friction-killer 2-minute timer*.

**Tech Stack:** Next.js 14/15, React, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Zustand, Vitest, @testing-library/react.

**Spec:** [docs/superpowers/specs/2026-09-28-kaizen-habit-tracker-design.md](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-09-28-kaizen-habit-tracker-design.md)

## Global Constraints
- Target platform: Modern Web (Desktop & Mobile Responsive, Offline-First).
- UI Design: Bersih, lapang, rapi, dan konsisten (*Wabi-Sabi / Zen Sanctuary* theme with soft borders and warm earth tones).
- Storage: LocalStorage via Zustand Persist Engine + manual JSON Export/Import backup.
- Test runner: Vitest + React Testing Library (JSDOM environment).
- Zero placeholders: Semua kode, tipe, dan utilitas ditulis lengkap dan eksplisit.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `tests/setup.ts`, `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: Node.js & npm packages.
- Produces: Working Next.js + Tailwind + Vitest development and test environment.

- [ ] **Step 1: Inisialisasi package.json dan instal dependensi**

Buat `package.json` dengan dependensi: `next`, `react`, `react-dom`, `zustand`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`, `canvas-confetti`, `@types/canvas-confetti`, dan dev dependencies untuk TypeScript, Tailwind, PostCSS, Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.

- [ ] **Step 2: Konfigurasi Tailwind, PostCSS, TypeScript, dan Vitest**

Konfigurasi `tailwind.config.ts` dengan palet warna Zen Japandi (`sand`, `sage`, `amber`, `stone`), `vitest.config.ts` dengan environment `jsdom` dan setup file `tests/setup.ts`.

- [ ] **Step 3: Buat test verifikasi environment**

Tulis test sederhana di `tests/unit/env.test.ts` untuk memverifikasi test runner berjalan.

- [ ] **Step 4: Jalankan test verifikasi**

Run: `npx vitest run tests/unit/env.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit setup awal**

```bash
git add package.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs vitest.config.ts tests/ src/
git commit -m "chore: initial project scaffolding with nextjs, tailwind, and vitest"
```

---

### Task 2: Core Data Models & Zustand Kaizen Store

**Files:**
- Create: `src/types/kaizen.ts`
- Create: `src/lib/utils/streakCalculator.ts`
- Create: `src/lib/utils/sampleData.ts`
- Create: `src/lib/store/useKaizenStore.ts`
- Test: `tests/unit/streakCalculator.test.ts`
- Test: `tests/unit/useKaizenStore.test.ts`

**Interfaces:**
- Consumes: TypeScript types dari `src/types/kaizen.ts`.
- Produces: `useKaizenStore` hook, `calculateStreak(dailyLogs: Record<string, DailyLog>)`, export/import JSON validator.

- [ ] **Step 1: Tulis unit test untuk streak calculator & Never Miss Twice logic**

Test skenario:
1. Hari ini selesai -> streak 1.
2. 3 hari berturut-turut selesai -> streak 3.
3. 1 hari kemarin kosong (Grace Period) tapi hari ini selesai -> streak tetap dipertahankan (tidak reset nol).
4. 2 hari berturut-turut kosong -> streak reset ke 0/1 saat mulai lagi.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/streakCalculator.test.ts`  
Expected: FAIL (module not found)

- [ ] **Step 3: Implementasikan tipe data & streak calculator**

Tulis `src/types/kaizen.ts` dan `src/lib/utils/streakCalculator.ts`.

- [ ] **Step 4: Tulis unit test untuk useKaizenStore (CRUD, Toggle Complete, Emergency Scale-Down, Hansei, Export/Import)**

Tulis test di `tests/unit/useKaizenStore.test.ts`.

- [ ] **Step 5: Implementasikan useKaizenStore dengan persist middleware**

Tulis `src/lib/store/useKaizenStore.ts` dan sample data di `src/lib/utils/sampleData.ts`.

- [ ] **Step 6: Jalankan semua test store & utils**

Run: `npx vitest run tests/unit/`  
Expected: PASS

- [ ] **Step 7: Commit data layer**

```bash
git add src/types/ src/lib/ tests/unit/
git commit -m "feat: implement Kaizen data models, streak calculator, and Zustand persist store"
```

---

### Task 3: Daily Sanctuary Core Components (Tunnel Vision & Emergency Scale-Down)

**Files:**
- Create: `src/components/sanctuary/DailySanctuary.tsx`
- Create: `src/components/sanctuary/MicroActionCard.tsx`
- Create: `src/components/sanctuary/GracePeriodBanner.tsx`
- Create: `src/components/sanctuary/DailyCompletionState.tsx`
- Test: `tests/unit/DailySanctuary.test.tsx`

**Interfaces:**
- Consumes: `useKaizenStore` (actions, goals, dailyLogs, toggleComplete, toggleEmergencyScaleDown).
- Produces: `<DailySanctuary onOpenTimer={(action) => void} />` component.

- [ ] **Step 1: Tulis unit test untuk DailySanctuary dan MicroActionCard**

Test verifikasi:
1. Menampilkan maksimal 1–3 micro-actions aktif untuk hari ini (Tunnel Vision).
2. Menekan tombol "🛡️ Terlalu Berat?" mengubah judul tugas menjadi `scaleDownTitle` dengan penanda visual.
3. Menekan tombol centang memanggil `toggleCompleteAction` dan memperbarui persentase progres harian.
4. Menampilkan `GracePeriodBanner` jika kemarin kosong untuk mencegah rasa bersalah.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/DailySanctuary.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implementasikan MicroActionCard, GracePeriodBanner, DailyCompletionState, dan DailySanctuary**

Terapkan desain *Zen Sanctuary*:
- Kartu membulat dengan border halus, efek hover tenang.
- Tombol "🛡️ Terlalu Berat?" dengan transisi animasi halus.
- State ucapan afirmasi Zen saat semua tugas hari ini selesai.

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Run: `npx vitest run tests/unit/DailySanctuary.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit komponen Daily Sanctuary**

```bash
git add src/components/sanctuary/ tests/unit/DailySanctuary.test.tsx
git commit -m "feat: implement Daily Sanctuary tunnel vision dashboard and emergency scale-down cards"
```

---

### Task 4: Friction-Killer 2-Minute Action Timer Modal

**Files:**
- Create: `src/lib/utils/soundEffects.ts`
- Create: `src/components/sanctuary/ActionTimerModal.tsx`
- Test: `tests/unit/ActionTimerModal.test.tsx`

**Interfaces:**
- Consumes: Web Audio API synth chime, `MicroAction` object.
- Produces: `<ActionTimerModal action={action} isOpen={isOpen} onClose={fn} onComplete={fn} />`.

- [ ] **Step 1: Tulis unit test untuk ActionTimerModal**

Test verifikasi:
1. Modal menampilkan countdown 120 detik (2 menit).
2. Tombol Start/Pause mengubah status timer.
3. Tombol "Selesai Sekarang" memicu callback `onComplete`.
4. Saat timer mencapai 0 detik, memicu chime dan tombol perayaan.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/ActionTimerModal.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implementasikan soundEffects.ts dan ActionTimerModal.tsx**

Terapkan:
- Web Audio API synthesizer sederhana (frekuensi 528Hz Zen bell) tanpa file audio eksternal.
- Visual progress ring SVG 120 detik dengan transisi CSS stroke-dashoffset.
- Quote motivasi mikro Kaizen: *"Cukup 2 menit. Setelah ini Anda bebas berhenti."*

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Run: `npx vitest run tests/unit/ActionTimerModal.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit komponen Action Timer**

```bash
git add src/lib/utils/soundEffects.ts src/components/sanctuary/ActionTimerModal.tsx tests/unit/ActionTimerModal.test.tsx
git commit -m "feat: implement friction-killer 2-minute action timer modal with zen chime"
```

---

### Task 5: Goal Forge (Decomposition Wizard & Goal Tree Manager)

**Files:**
- Create: `src/components/forge/GoalForgeWizard.tsx`
- Create: `src/components/forge/GoalManager.tsx`
- Create: `src/components/forge/GoalTreeItem.tsx`
- Test: `tests/unit/GoalForgeWizard.test.tsx`

**Interfaces:**
- Consumes: `useKaizenStore.addGoalWithBreakdown`, `updateGoal`, `deleteGoal`.
- Produces: `<GoalManager />` dan `<GoalForgeWizard isOpen={isOpen} onClose={fn} />`.

- [ ] **Step 1: Tulis unit test untuk GoalForgeWizard**

Test verifikasi:
1. Step 1: Input Judul Visi & Kategori.
2. Step 2: Input "The Why" (Jangkar Emosional).
3. Step 3: Input Milestone Pertama.
4. Step 4: Input Tindakan Mikro ($\le$ 2 menit) & Versi Darurat (*Scale-down fallback*).
5. Submit memanggil `addGoalWithBreakdown` dengan struktur data lengkap.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/GoalForgeWizard.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implementasikan GoalForgeWizard, GoalTreeItem, dan GoalManager**

Terapkan:
- Stepper 4 tahap dengan indikator progress yang rapi.
- Tips psikologi Kaizen pada setiap step (contoh panduan: *"Pilih tindakan yang begitu kecil hingga otak Anda tidak merasa malas"*).
- Visualisasi pohon tujuan (*Vision -> Milestone -> Micro-Action*) di dalam `GoalManager`.

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Run: `npx vitest run tests/unit/GoalForgeWizard.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit komponen Goal Forge**

```bash
git add src/components/forge/ tests/unit/GoalForgeWizard.test.tsx
git commit -m "feat: implement Goal Forge breakdown wizard and goal tree manager"
```

---

### Task 6: Hansei Evening Reflection & 1% Compound Visualizer

**Files:**
- Create: `src/components/hansei/HanseiModal.tsx`
- Create: `src/components/analytics/CompoundVisualizer.tsx`
- Create: `src/components/analytics/HanseiHistoryList.tsx`
- Test: `tests/unit/HanseiModal.test.tsx`
- Test: `tests/unit/CompoundVisualizer.test.tsx`

**Interfaces:**
- Consumes: `useKaizenStore.saveHansei`, `dailyLogs`, `goals`.
- Produces: `<HanseiModal isOpen={isOpen} onClose={fn} />` dan `<CompoundVisualizer />`.

- [ ] **Step 1: Tulis unit test untuk HanseiModal dan CompoundVisualizer**

Test verifikasi:
1. HanseiModal menyimpan `winOfTheDay` dan `tomorrowImprovement` ke `dailyLogs[today]`.
2. CompoundVisualizer menghitung total micro-wins yang terakumulasi dan memvisualisasikan kurva pertumbuhan 1% ($1.01^{365} = 37.78$).

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/HanseiModal.test.tsx tests/unit/CompoundVisualizer.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implementasikan HanseiModal, HanseiHistoryList, dan CompoundVisualizer**

Terapkan:
- Form Hansei bergaya jurnal malam yang menenangkan.
- Visualisasi grafik kurva compound berbasis SVG/Canvas interaktif dan ringkasan statistik konsistensi yang bebas intimidasi.

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Run: `npx vitest run tests/unit/HanseiModal.test.tsx tests/unit/CompoundVisualizer.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit komponen Hansei & Compound Visualizer**

```bash
git add src/components/hansei/ src/components/analytics/ tests/unit/HanseiModal.test.tsx tests/unit/CompoundVisualizer.test.tsx
git commit -m "feat: implement Hansei 30-second reflection and 1% compound visualizer"
```

---

### Task 7: Layout Shell, Navigation, Data Backup Manager & Full Integration

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/TabNavigation.tsx`
- Create: `src/components/settings/DataBackupModal.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/unit/DataBackupModal.test.tsx`
- Test: `tests/unit/Integration.test.tsx`

**Interfaces:**
- Consumes: Seluruh komponen Sanctuary, Forge, Analytics, Hansei, dan Settings.
- Produces: Aplikasi web penuh dan interaktif di `src/app/page.tsx`.

- [ ] **Step 1: Tulis unit test untuk DataBackupModal dan Integration**

Test verifikasi:
1. Export Data mengunduh JSON valid.
2. Import Data memvalidasi JSON dan memperbarui store.
3. Tombol "Muat Contoh Data" memuat preset Kaizen goals awal.
4. Navigasi tab beralih secara mulus antara Sanctuary, Goal Forge, dan 1% Progress.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Run: `npx vitest run tests/unit/DataBackupModal.test.tsx tests/unit/Integration.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implementasikan Header, TabNavigation, DataBackupModal, dan integrasi page.tsx**

Terapkan:
- Header dengan Zen Ensō icon, badge streak konsistensi, tombol cepat Hansei, dan tombol pengaturan data.
- Tab navigasi bersih di bagian atas dengan pill indicator aktif.
- Halaman utama `src/app/page.tsx` menghubungkan seluruh state, timer modal, forge modal, hansei modal, dan backup modal.

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Run: `npx vitest run tests/unit/DataBackupModal.test.tsx tests/unit/Integration.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit integrasi lengkap**

```bash
git add src/components/layout/ src/components/settings/ src/app/ tests/unit/
git commit -m "feat: complete KaizenFlow layout integration, navigation, and data backup manager"
```

---

### Task 8: Final Verification & Production Build

**Files:**
- Review: Semua file di `src/` dan `tests/`

- [ ] **Step 1: Jalankan seluruh test suite**

Run: `npm run test` atau `npx vitest run`  
Expected: Semua unit & integration test lulus 100%.

- [ ] **Step 2: Jalankan typecheck dan build produksi**

Run: `npm run build`  
Expected: Build Next.js sukses tanpa error TypeScript atau lint.

- [ ] **Step 3: Commit final release**

```bash
git add .
git commit -m "chore: verify test suite and production build for KaizenFlow"
```
