# Task 6 Report: Backup Bounded Context (Data Management & Snapshots)

## Overview
Implemented the **Backup Bounded Context** for KaizenFlow following Domain-Driven Design (DDD) and Clean Architecture principles. This module ensures complete user data sovereignty, enabling offline-first privacy with JSON snapshot exports, schema validation, snapshot restore engine, pre-loaded inspirational Kaizen sample data, and a Zen-aesthetic modal UI.

---

## 1. Domain Layer (`src/modules/backup/domain/`)
- **`SystemSnapshot.ts`**:
  - Defined the `SystemSnapshot` canonical schema (`version`, `exportedAt`, `appName: "KaizenFlow"`, `data`).
  - Data payload aggregates `GoalProps[]`, `MicroActionProps[]`, `HanseiEntryProps[]`, and `DailySanctuaryLogProps[]`.
- **`BackupValidator.ts`**:
  - Pure domain service returning `Result<SystemSnapshot, Error>`.
  - Validates JSON parse integrity, root object shape, `appName === "KaizenFlow"`, semantic versioning, and non-empty ISO timestamps.
  - Rigorously validates all nested entity arrays (`goals`, `microActions`, `hanseiEntries`, `dailyLogs`) ensuring mandatory identifiers and non-empty text properties are present.
- **`BackupRepositoryPort.ts`**:
  - Port interface defining `getSnapshot()`, `restoreSnapshot(snapshot)`, and `clearAll()`.
- **Domain Events**:
  - `BackupExportedEvent`: Dispatched when user exports a valid snapshot, detailing item counts.
  - `BackupRestoredEvent`: Dispatched when data is restored via file import or sample data initialization, detailing source (`"import"` | `"sample_data"`).

---

## 2. Application Layer (`src/modules/backup/application/`)
- **`ExportBackupUseCase.ts`**:
  - Fetches snapshot from `BackupRepositoryPort`, serializes into pretty-printed JSON, and publishes `BackupExportedEvent`.
- **`ImportBackupUseCase.ts`**:
  - Accepts raw JSON string or object, validates with `BackupValidator`, restores data into storage via repository port, and dispatches `BackupRestoredEvent`.
- **`LoadSampleDataUseCase.ts`**:
  - Pre-populates 3 inspirational Kaizen starter goals & micro-actions:
    1. **"Tubuh Bugar & Berenergi"** (Health) $\rightarrow$ Milestone: *"Membangun kebiasaan gerak harian"* $\rightarrow$ Micro-Action: *"Lakukan 2 kali push-up saat bangun tidur"* (Fallback: *"Cukup gelar matras yoga"*).
    2. **"Kuasai Frontend & Architecture"** (Career) $\rightarrow$ Milestone: *"Membaca 1 konsep arsitektur setiap hari"* $\rightarrow$ Micro-Action: *"Buka artikel DDD & baca 1 paragraf"* (Fallback: *"Buka tab artikel di browser"*).
    3. **"Ketenangan Pikiran (Zen Mind)"** (Mindset) $\rightarrow$ Milestone: *"Meditasi pernapasan rutin"* $\rightarrow$ Micro-Action: *"Tarik napas dalam 3 kali sebelum tidur"* (Fallback: *"Tarik napas dalam 1 kali"*).
  - Also populates a starter Hansei reflection and starter daily log to demonstrate the full application experience.
  - Dispatches `BackupRestoredEvent` with source `"sample_data"`.

---

## 3. Infrastructure Layer (`src/modules/backup/infrastructure/`)
- **`FileBlobDownloader.ts`**:
  - Native browser download trigger using `Blob`, `URL.createObjectURL`, and auto-clicking temporary anchor element with filename `kaizenflow-backup-YYYY-MM-DD.json`.
  - Safe against non-browser environments (e.g. Node/jsdom).
- **`LocalStorageBackupRepository.ts`**:
  - Implements `BackupRepositoryPort` using `LocalStorageDriver`.
  - Maps to all domain storage keys: `kaizen_goals`, `kaizen_sanctuary_actions`, `kaizen_reflections`, `kaizen_daily_logs`, and maintains `kaizen_active_dates`.
  - Normalizes goals upon restore to guarantee `whyText` is populated for seamless interop with `LocalStorageGoalRepository`.

---

## 4. Presentation Layer (`src/modules/backup/presentation/`)
- **`useBackupController.ts`**:
  - React hook exposing state (`isExporting`, `isImporting`, `isLoadingSample`, `isClearing`, `statusMessage`, `errorMessage`, `lastExportedAt`) and handlers (`handleExport`, `handleImportFile`, `handleImportJsonString`, `handleLoadSampleData`, `handleClearAllData`).
- **`DataBackupModal.tsx`**:
  - Beautiful Zen modal with 4 core sections:
    1. **Export Data**: "Unduh Cadangan JSON" button with timestamp tracking.
    2. **Import Data**: Drag & drop zone / file picker input accepting `.json` files.
    3. **Muat Contoh Data**: 1-click button to load the starter demonstration dataset.
    4. **Reset Semua Data**: Multi-step confirmation dialog ("Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan" $\rightarrow$ "Yakin Hapus Semua Data?").
- **`src/modules/backup/index.ts`**:
  - Central barrel exporting domain models, validators, events, use cases, infrastructure repositories, and presentation components.

---

## 5. Verification & Test Results
- **Backup context test suite**:
  `npx vitest run tests/modules/backup/`
  - `BackupValidator.test.ts`: 11 passed
  - `ExportImportBackupUseCase.test.ts`: 6 passed
  - `LoadSampleDataUseCase.test.ts`: 2 passed
  - `LocalStorageBackupRepository.test.ts`: 3 passed
  - `useBackupController.test.tsx`: 5 passed
  - `DataBackupModal.test.tsx`: 7 passed
  - **Total:** 34 / 34 passed (6 test files)

- **Full Project Regression Suite**:
  `npx vitest run`
  - **Total:** 194 / 194 passed (31 test files) across Goals, Sanctuary, Reflection, Shared, and Backup contexts.

---

## 6. Git Commit
- `7f2ba76`: `feat: implement Backup bounded context with snapshot export, import validation, and sample data`
