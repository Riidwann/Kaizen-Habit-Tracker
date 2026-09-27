# Task 6 Brief: Backup Bounded Context (Data Management & Snapshots)

**Files:**
- Create: `src/modules/backup/domain/SystemSnapshot.ts`
- Create: `src/modules/backup/domain/BackupValidator.ts`
- Create: `src/modules/backup/domain/BackupRepositoryPort.ts`
- Create: `src/modules/backup/domain/events/BackupExportedEvent.ts`
- Create: `src/modules/backup/domain/events/BackupRestoredEvent.ts`
- Create: `src/modules/backup/application/ExportBackupUseCase.ts`
- Create: `src/modules/backup/application/ImportBackupUseCase.ts`
- Create: `src/modules/backup/application/LoadSampleDataUseCase.ts`
- Create: `src/modules/backup/infrastructure/FileBlobDownloader.ts`
- Create: `src/modules/backup/infrastructure/LocalStorageBackupRepository.ts`
- Create: `src/modules/backup/presentation/DataBackupModal.tsx`
- Create: `src/modules/backup/presentation/useBackupController.ts`
- Create: `src/modules/backup/index.ts`
- Test: `tests/modules/backup/BackupValidator.test.ts`
- Test: `tests/modules/backup/ExportImportBackupUseCase.test.ts`
- Test: `tests/modules/backup/LoadSampleDataUseCase.test.ts`
- Test: `tests/modules/backup/DataBackupModal.test.tsx`

**Interfaces:**
- Consumes: `@/shared/domain/*`, `@/shared/infrastructure/LocalStorageDriver`, `@/shared/infrastructure/InMemoryEventBus`, `@/shared/presentation/*`.
- Produces:
  1. `SystemSnapshot` (Data Model):
     - `version`: string (e.g. `"1.0.0"`).
     - `exportedAt`: string (ISO date).
     - `appName`: `"KaizenFlow"`.
     - `data`: {
         `goals`: GoalProps[],
         `microActions`: MicroActionProps[],
         `hanseiEntries`: HanseiEntryProps[],
         `dailyLogs`: DailySanctuaryLogProps[]
       }
  2. `BackupValidator` (Domain Service):
     - Validates version, appName, and arrays of goals, microActions, hanseiEntries, dailyLogs.
     - Returns `Result<SystemSnapshot, Error>` with human-friendly validation error messages.
  3. Sample Data Generator in `LoadSampleDataUseCase`:
     - Pre-populates 3 inspirational Kaizen goals:
       1. **"Tubuh Bugar & Berenergi"** (Kesehatan) $\rightarrow$ Milestone: "Membangun kebiasaan gerak harian" $\rightarrow$ Micro-Action: "Lakukan 2 kali push-up saat bangun tidur" (Fallback: "Cukup gelar matras yoga").
       2. **"Kuasai Frontend & Architecture"** (Karier/Skill) $\rightarrow$ Milestone: "Membaca 1 konsep arsitektur setiap hari" $\rightarrow$ Micro-Action: "Buka artikel DDD & baca 1 paragraf" (Fallback: "Buka tab artikel di browser").
       3. **"Ketenangan Pikiran (Zen Mind)"** (Mindset) $\rightarrow$ Milestone: "Meditasi pernapasan rutin" $\rightarrow$ Micro-Action: "Tarik napas dalam 3 kali sebelum tidur" (Fallback: "Tarik napas dalam 1 kali").
  4. Use Cases:
     - `ExportBackupUseCase`: aggregates state from localStorage, creates valid `SystemSnapshot` JSON string.
     - `ImportBackupUseCase`: validates JSON string, writes to localStorage stores, fires `BackupRestoredEvent`.
     - `LoadSampleDataUseCase`: resets with starter Kaizen data.
  5. Infrastructure:
     - `FileBlobDownloader`: triggers browser file download (`kaizenflow-backup-YYYY-MM-DD.json`).
  6. Presentation:
     - `DataBackupModal`: Modal with:
       - **Export Data**: "Unduh Cadangan JSON" button with timestamp.
       - **Import Data**: Drag & drop or file picker input for `.json` file, with validation status and error display.
       - **Muat Contoh Data (Sample Data)**: 1-click button to load starter data for demonstration.
       - **Reset Semua Data**: Safe confirmation dialog to clear all data.
     - `useBackupController`: custom hook providing backup state and actions.

### Step-by-Step Instructions:

1. **Write failing unit tests**:
   - `tests/modules/backup/BackupValidator.test.ts`: test valid JSON, invalid schema, missing required fields.
   - `tests/modules/backup/ExportImportBackupUseCase.test.ts`: test export creates snapshot, import restores data.
   - `tests/modules/backup/LoadSampleDataUseCase.test.ts`: test loading sample goals and actions.
   - `tests/modules/backup/DataBackupModal.test.tsx`: test UI interaction, buttons, and error alerts.

2. **Implement Domain Layer**:
   - `SystemSnapshot.ts`, `BackupValidator.ts`, `BackupRepositoryPort.ts`, event classes.

3. **Implement Application Layer**:
   - `ExportBackupUseCase.ts`, `ImportBackupUseCase.ts`, `LoadSampleDataUseCase.ts`.

4. **Implement Infrastructure Layer**:
   - `FileBlobDownloader.ts`, `LocalStorageBackupRepository.ts`.

5. **Implement Presentation Layer**:
   - `DataBackupModal.tsx`, `useBackupController.ts`, `index.ts`.

6. **Run all tests**:
   Run `npx vitest run tests/modules/backup/` to ensure 100% pass.

7. **Commit**:
   `git add src/modules/backup/ tests/modules/backup/` and `git commit -m "feat: implement Backup bounded context with snapshot export, import validation, and sample data"`.
