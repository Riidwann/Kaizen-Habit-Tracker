# KaizenFlow Implementation Plan (DDD, Clean Architecture & Modular Monolith)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web habit & goal tracking "KaizenFlow" dengan prinsip psikologi Kaizen, menerapkan **Domain-Driven Design (DDD)**, **Clean Architecture (Hexagonal/Ports & Adapters)**, dan **Modular Monolith** secara konsisten pada frontend dan backend/core logic.

**Architecture:** Modular Monolith terbagi atas 4 Bounded Contexts (`goals`, `sanctuary`, `reflection`, `backup`) dan 1 `shared` kernel. Setiap modul menerapkan Clean Architecture 4 lapis: Domain (Entities, Value Objects, Domain Services, Ports) $\rightarrow$ Application (Use Cases, DTOs) $\rightarrow$ Infrastructure (LocalStorage Repositories, Adapters) $\rightarrow$ Presentation (React UI, Custom Hook Controllers).

**Tech Stack:** Next.js 14/15 (App Router, Client-side SPA Mode), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Zustand / React State Controllers, Web Audio API, Vitest, @testing-library/react.

**Spec:** [docs/superpowers/specs/2026-09-28-kaizen-habit-tracker-design.md](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-09-28-kaizen-habit-tracker-design.md)

## Global Constraints
- **Architecture Enforcement**: Setiap modul (`src/modules/*`) WAJIB memiliki 4 layer: `domain`, `application`, `infrastructure`, `presentation`.
- **Dependency Rule**: Lapisan `domain` TIDAK BOLEH mengimpor apapun dari `application`, `infrastructure`, `presentation`, atau framework eksternal (React/Next).
- **Domain Invariants**:
  1. Micro-action wajib memiliki estimasi durasi $\le 2$ menit.
  2. Daily Sanctuary membatasi maksimal 1–3 tindakan mikro aktif per hari.
  3. Never Miss Twice Policy: Absen 1 hari adalah *Grace Period*, streak tidak di-reset ke nol.
- **UI Design System**: *Zen Japandi Sanctuary* (Bersih, rapi, lapang, dan konsisten).
- **Testing**: Vitest + React Testing Library untuk setiap layer modul.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `tests/setup.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Consumes: Node.js & npm packages.
- Produces: Lingkungan pengembangan Next.js, Tailwind, path alias `@/*`, dan test runner Vitest.

- [ ] **Step 1: Inisialisasi package.json dan dependensi**

Buat `package.json` dengan: `next@^14.2.15`, `react@^18.3.1`, `react-dom@^18.3.1`, `lucide-react@^0.441.0`, `framer-motion@^11.5.4`, `clsx@^2.1.1`, `tailwind-merge@^2.5.2`, `canvas-confetti@^1.9.3`, `typescript@^5`, `@types/node@^20`, `@types/react@^18`, `@types/react-dom@^18`, `@types/canvas-confetti@^1.9.0`, `tailwindcss@^3.4.1`, `postcss@^8`, `autoprefixer@^10.4.19`, `vitest@^2.1.1`, `@testing-library/react@^16.0.1`, `@testing-library/jest-dom@^6.5.0`, `jsdom@^25.0.0`.

- [ ] **Step 2: Konfigurasi Tailwind, PostCSS, TSConfig, dan Vitest**

- [ ] **Step 3: Buat test verifikasi environment (`tests/unit/env.test.ts`)**

- [ ] **Step 4: Jalankan test verifikasi**

Run: `npx vitest run tests/unit/env.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit setup awal**

```bash
git add .
git commit -m "chore: scaffold project with nextjs, tailwind, ddd path aliases, and vitest"
```

---

### Task 2: Shared Kernel (Domain Primitives, Result Pattern, Event Bus & Zen UI Kit)

**Files:**
- Create: `src/shared/domain/Result.ts`
- Create: `src/shared/domain/BaseEntity.ts`
- Create: `src/shared/domain/ValueObject.ts`
- Create: `src/shared/domain/DomainEvent.ts`
- Create: `src/shared/infrastructure/LocalStorageDriver.ts`
- Create: `src/shared/infrastructure/WebAudioService.ts`
- Create: `src/shared/infrastructure/InMemoryEventBus.ts`
- Create: `src/shared/presentation/Button.tsx`
- Create: `src/shared/presentation/Card.tsx`
- Create: `src/shared/presentation/Modal.tsx`
- Create: `src/shared/presentation/Badge.tsx`
- Create: `src/shared/presentation/Input.tsx`
- Test: `tests/shared/Result.test.ts`
- Test: `tests/shared/LocalStorageDriver.test.ts`
- Test: `tests/shared/InMemoryEventBus.test.ts`

**Interfaces:**
- Consumes: Shared primitives.
- Produces: `Result<T, E>`, `BaseEntity`, `LocalStorageDriver`, `WebAudioService`, `InMemoryEventBus`, and atomic Zen UI Kit components.

- [ ] **Step 1: Tulis unit test untuk Result, LocalStorageDriver, dan EventBus**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan domain primitives dan infrastructure driver**
- [ ] **Step 4: Implementasikan komponen Zen UI Kit (Button, Card, Modal, Badge, Input)**
- [ ] **Step 5: Jalankan test shared kernel**
- [ ] **Step 6: Commit shared kernel**

```bash
git add src/shared/ tests/shared/
git commit -m "feat: implement shared kernel (DDD primitives, Result type, LocalStorage driver, EventBus, Zen UI Kit)"
```

---

### Task 3: Goals Bounded Context (Goal Forge & Decomposition)

**Files:**
- Create: `src/modules/goals/domain/Goal.ts`
- Create: `src/modules/goals/domain/Milestone.ts`
- Create: `src/modules/goals/domain/EmotionalAnchor.ts`
- Create: `src/modules/goals/domain/GoalCategory.ts`
- Create: `src/modules/goals/domain/GoalRepositoryPort.ts`
- Create: `src/modules/goals/application/CreateGoalUseCase.ts`
- Create: `src/modules/goals/application/UpdateGoalUseCase.ts`
- Create: `src/modules/goals/application/DeleteGoalUseCase.ts`
- Create: `src/modules/goals/application/GetGoalsUseCase.ts`
- Create: `src/modules/goals/infrastructure/LocalStorageGoalRepository.ts`
- Create: `src/modules/goals/presentation/GoalForgeWizard.tsx`
- Create: `src/modules/goals/presentation/GoalManagerView.tsx`
- Create: `src/modules/goals/presentation/GoalTreeItem.tsx`
- Create: `src/modules/goals/presentation/useGoalsController.ts`
- Test: `tests/modules/goals/GoalDomain.test.ts`
- Test: `tests/modules/goals/CreateGoalUseCase.test.ts`
- Test: `tests/modules/goals/GoalForgeWizard.test.tsx`

**Interfaces:**
- Consumes: Shared Kernel (`Result`, `BaseEntity`, `LocalStorageDriver`, `Zen UI Kit`).
- Produces: Goal Aggregate, Use Cases, Repository, and `useGoalsController` hook.

- [ ] **Step 1: Tulis unit test untuk Goal Domain Invariants & CreateGoalUseCase**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan domain layer, use cases, dan LocalStorage repository**
- [ ] **Step 4: Implementasikan presentation layer (GoalForgeWizard, GoalManagerView, useGoalsController)**
- [ ] **Step 5: Jalankan semua test modul goals**
- [ ] **Step 6: Commit modul goals**

```bash
git add src/modules/goals/ tests/modules/goals/
git commit -m "feat: implement Goals bounded context with DDD and Clean Architecture"
```

---

### Task 4: Sanctuary Bounded Context (Daily Focus, 2-Min Timer & Emergency Scale-Down)

**Files:**
- Create: `src/modules/sanctuary/domain/MicroAction.ts`
- Create: `src/modules/sanctuary/domain/DailyFocusPolicy.ts`
- Create: `src/modules/sanctuary/domain/SanctuaryRepositoryPort.ts`
- Create: `src/modules/sanctuary/application/GetDailyFocusActionsUseCase.ts`
- Create: `src/modules/sanctuary/application/CompleteMicroActionUseCase.ts`
- Create: `src/modules/sanctuary/application/ScaleDownMicroActionUseCase.ts`
- Create: `src/modules/sanctuary/infrastructure/LocalStorageSanctuaryRepository.ts`
- Create: `src/modules/sanctuary/presentation/DailySanctuaryView.tsx`
- Create: `src/modules/sanctuary/presentation/MicroActionCard.tsx`
- Create: `src/modules/sanctuary/presentation/ActionTimerModal.tsx`
- Create: `src/modules/sanctuary/presentation/GracePeriodBanner.tsx`
- Create: `src/modules/sanctuary/presentation/useSanctuaryController.ts`
- Test: `tests/modules/sanctuary/MicroActionDomain.test.ts`
- Test: `tests/modules/sanctuary/CompleteMicroActionUseCase.test.ts`
- Test: `tests/modules/sanctuary/DailySanctuaryView.test.tsx`

**Interfaces:**
- Consumes: Shared Kernel, Goals Port.
- Produces: Daily Focus engine, 2-Minute Timer, Emergency Scale-down trigger, `useSanctuaryController`.

- [ ] **Step 1: Tulis unit test untuk MicroAction Invariant (2-min limit) dan Use Cases**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan domain layer, use cases, dan LocalStorage repository**
- [ ] **Step 4: Implementasikan presentation layer (DailySanctuaryView, MicroActionCard, ActionTimerModal, useSanctuaryController)**
- [ ] **Step 5: Jalankan semua test modul sanctuary**
- [ ] **Step 6: Commit modul sanctuary**

```bash
git add src/modules/sanctuary/ tests/modules/sanctuary/
git commit -m "feat: implement Sanctuary bounded context (tunnel vision, emergency scale-down, action timer)"
```

---

### Task 5: Reflection Bounded Context (Hansei & 1% Compound Engine)

**Files:**
- Create: `src/modules/reflection/domain/HanseiReflection.ts`
- Create: `src/modules/reflection/domain/StreakCounter.ts`
- Create: `src/modules/reflection/domain/NeverMissTwicePolicy.ts`
- Create: `src/modules/reflection/domain/CompoundGrowthCalculator.ts`
- Create: `src/modules/reflection/domain/ReflectionRepositoryPort.ts`
- Create: `src/modules/reflection/application/RecordHanseiUseCase.ts`
- Create: `src/modules/reflection/application/GetConsistencyStatsUseCase.ts`
- Create: `src/modules/reflection/infrastructure/LocalStorageReflectionRepository.ts`
- Create: `src/modules/reflection/presentation/HanseiModal.tsx`
- Create: `src/modules/reflection/presentation/CompoundVisualizerView.tsx`
- Create: `src/modules/reflection/presentation/StreakBadge.tsx`
- Create: `src/modules/reflection/presentation/useReflectionController.ts`
- Test: `tests/modules/reflection/NeverMissTwicePolicy.test.ts`
- Test: `tests/modules/reflection/RecordHanseiUseCase.test.ts`
- Test: `tests/modules/reflection/HanseiModal.test.tsx`

**Interfaces:**
- Consumes: Shared Kernel.
- Produces: Hansei reflection engine, Never Miss Twice streak calculator, 1% Compound growth chart.

- [ ] **Step 1: Tulis unit test untuk NeverMissTwicePolicy dan RecordHanseiUseCase**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan domain layer, use cases, dan LocalStorage repository**
- [ ] **Step 4: Implementasikan presentation layer (HanseiModal, CompoundVisualizerView, StreakBadge, useReflectionController)**
- [ ] **Step 5: Jalankan semua test modul reflection**
- [ ] **Step 6: Commit modul reflection**

```bash
git add src/modules/reflection/ tests/modules/reflection/
git commit -m "feat: implement Reflection bounded context (Hansei 30-sec ritual, Never Miss Twice policy, 1% compound visualizer)"
```

---

### Task 6: Backup Bounded Context (Data Management & Snapshots)

**Files:**
- Create: `src/modules/backup/domain/SystemSnapshot.ts`
- Create: `src/modules/backup/domain/BackupValidator.ts`
- Create: `src/modules/backup/application/ExportBackupUseCase.ts`
- Create: `src/modules/backup/application/ImportBackupUseCase.ts`
- Create: `src/modules/backup/application/LoadSampleDataUseCase.ts`
- Create: `src/modules/backup/infrastructure/FileBlobDownloader.ts`
- Create: `src/modules/backup/infrastructure/JsonSchemaValidator.ts`
- Create: `src/modules/backup/presentation/DataBackupModal.tsx`
- Create: `src/modules/backup/presentation/useBackupController.ts`
- Test: `tests/modules/backup/BackupValidator.test.ts`
- Test: `tests/modules/backup/ExportImportBackupUseCase.test.ts`
- Test: `tests/modules/backup/DataBackupModal.test.tsx`

**Interfaces:**
- Consumes: Goals, Sanctuary, and Reflection repositories.
- Produces: System snapshot exporter, JSON schema validator, backup restore engine.

- [ ] **Step 1: Tulis unit test untuk BackupValidator dan Export/Import Use Cases**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan domain layer, use cases, dan infrastructure adapters**
- [ ] **Step 4: Implementasikan presentation layer (DataBackupModal, useBackupController)**
- [ ] **Step 5: Jalankan semua test modul backup**
- [ ] **Step 6: Commit modul backup**

```bash
git add src/modules/backup/ tests/modules/backup/
git commit -m "feat: implement Backup bounded context with snapshot export, import validation, and sample data"
```

---

### Task 7: Shell Application, Navigation, and Layout Integration

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/TabNavigation.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/integration/KaizenFlowApp.test.tsx`

**Interfaces:**
- Consumes: All 4 modules (`goals`, `sanctuary`, `reflection`, `backup`) and `shared/presentation`.
- Produces: Complete, responsive, clean, and consistent web application.

- [ ] **Step 1: Tulis integration test yang menguji navigasi tab dan alur holistik Kaizen**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan awal**
- [ ] **Step 3: Implementasikan Header, TabNavigation, dan hubungkan semua modul di `src/app/page.tsx`**
- [ ] **Step 4: Jalankan integration test untuk memastikan lulus**
- [ ] **Step 5: Commit integrasi shell aplikasi**

```bash
git add src/components/layout/ src/app/ tests/integration/
git commit -m "feat: integrate modular monolith in app shell with zen navigation and controllers"
```

---

### Task 8: Final Verification & Production Build

**Files:**
- Review: Semua file di `src/` dan `tests/`

- [ ] **Step 1: Jalankan seluruh test suite semua modul**

Run: `npm test` atau `npx vitest run`  
Expected: Semua unit, domain, use case, dan integration test lulus 100%.

- [ ] **Step 2: Jalankan typecheck dan production build**

Run: `npm run build`  
Expected: Next.js production build sukses tanpa error.

- [ ] **Step 3: Commit final release**

```bash
git add .
git commit -m "chore: final verification and production build for KaizenFlow modular monolith"
```
