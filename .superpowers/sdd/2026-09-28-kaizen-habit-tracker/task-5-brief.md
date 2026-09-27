# Task 5 Brief: Reflection Bounded Context (Hansei & 1% Compound Engine)

**Files:**
- Create: `src/modules/reflection/domain/HanseiReflection.ts`
- Create: `src/modules/reflection/domain/StreakCounter.ts`
- Create: `src/modules/reflection/domain/NeverMissTwicePolicy.ts`
- Create: `src/modules/reflection/domain/CompoundGrowthCalculator.ts`
- Create: `src/modules/reflection/domain/ReflectionRepositoryPort.ts`
- Create: `src/modules/reflection/domain/events/HanseiRecordedEvent.ts`
- Create: `src/modules/reflection/domain/events/StreakUpdatedEvent.ts`
- Create: `src/modules/reflection/application/RecordHanseiUseCase.ts`
- Create: `src/modules/reflection/application/GetConsistencyStatsUseCase.ts`
- Create: `src/modules/reflection/application/GetHanseiHistoryUseCase.ts`
- Create: `src/modules/reflection/infrastructure/LocalStorageReflectionRepository.ts`
- Create: `src/modules/reflection/presentation/HanseiModal.tsx`
- Create: `src/modules/reflection/presentation/CompoundVisualizerView.tsx`
- Create: `src/modules/reflection/presentation/StreakBadge.tsx`
- Create: `src/modules/reflection/presentation/HanseiHistoryList.tsx`
- Create: `src/modules/reflection/presentation/useReflectionController.ts`
- Create: `src/modules/reflection/index.ts`
- Test: `tests/modules/reflection/NeverMissTwicePolicy.test.ts`
- Test: `tests/modules/reflection/CompoundGrowthCalculator.test.ts`
- Test: `tests/modules/reflection/RecordHanseiUseCase.test.ts`
- Test: `tests/modules/reflection/HanseiModal.test.tsx`
- Test: `tests/modules/reflection/CompoundVisualizerView.test.tsx`

**Interfaces:**
- Consumes: `@/shared/domain/*`, `@/shared/infrastructure/LocalStorageDriver`, `@/shared/infrastructure/InMemoryEventBus`, `@/shared/presentation/*`.
- Produces:
  1. `HanseiReflection` (Entity):
     - `id`, `date` (`YYYY-MM-DD`), `winOfTheDay` (1 micro-win achieved), `tomorrowAdjustment` (1 small 1% adjustment for tomorrow), `submittedAt`.
     - Validation: non-empty answers.
  2. `StreakCounter` (Value Object):
     - `currentStreak`: number.
     - `longestStreak`: number.
     - `isGracePeriod`: boolean (true if yesterday was missed, so today user is protected from reset under the Never Miss Twice rule).
     - `lastActiveDate`: string (`YYYY-MM-DD`).
  3. `NeverMissTwicePolicy` (Domain Service):
     - Calculates streak and grace period from an array of active dates.
     - Rules:
       - Activity today: streak continues / increases.
       - Activity yesterday but not yet today: streak is maintained.
       - 1 missed day (gap of exactly 1 day): `isGracePeriod = true`, streak is preserved!
       - 2+ consecutive missed days: streak resets to 0 (or 1 upon new action).
  4. `CompoundGrowthCalculator` (Domain Service):
     - Formula: $(1 + 0.01)^N$ where $N$ is total micro-actions completed.
     - Returns data points for visual graph curve, comparison against 1% decline ($(0.99)^N$).
  5. Use Cases:
     - `RecordHanseiUseCase`: records evening Hansei reflection, publishes `HanseiRecordedEvent`.
     - `GetConsistencyStatsUseCase`: calculates streak, grace period status, compound multiplier, and total micro-wins.
     - `GetHanseiHistoryUseCase`: returns past reflections sorted chronologically.
  6. `LocalStorageReflectionRepository`: implements `ReflectionRepositoryPort`.
  7. Presentation:
     - `HanseiModal`: Night-themed Zen journal modal with guidance prompts:
       - *"1 hal kecil yang berhasil saya lakukan hari ini"* (Micro-Win).
       - *"1 penyesuaian 1% untuk esok hari"* (Kaizen Adjustment).
       - Smooth save button and encouragement.
     - `CompoundVisualizerView`: Interactive visual chart showing 1% daily compound growth curve, streak metrics, and `HanseiHistoryList`.
     - `StreakBadge`: Header badge showing `"🌱 X Hari Bertumbuh"` or `"🛡️ Hari Pemulihan"` (Grace period indicator).
     - `useReflectionController`: custom hook orchestrating Hansei submission, streak stats calculation, and EventBus listeners (e.g. listens to `MicroActionCompletedEvent` to update stats automatically).

### Step-by-Step Instructions:

1. **Write failing unit tests**:
   - `tests/modules/reflection/NeverMissTwicePolicy.test.ts`: test consecutive days, 1-day gap grace period, 2+ day gap reset.
   - `tests/modules/reflection/CompoundGrowthCalculator.test.ts`: test 1.01^N formula and curve points.
   - `tests/modules/reflection/RecordHanseiUseCase.test.ts`: test recording and validation.
   - `tests/modules/reflection/HanseiModal.test.tsx`: test modal inputs and submit callback.
   - `tests/modules/reflection/CompoundVisualizerView.test.tsx`: test rendering stats and curve.

2. **Implement Domain Layer**:
   - `HanseiReflection.ts`, `StreakCounter.ts`, `NeverMissTwicePolicy.ts`, `CompoundGrowthCalculator.ts`, `ReflectionRepositoryPort.ts`, event classes.

3. **Implement Application Layer**:
   - `RecordHanseiUseCase.ts`, `GetConsistencyStatsUseCase.ts`, `GetHanseiHistoryUseCase.ts`.

4. **Implement Infrastructure Layer**:
   - `LocalStorageReflectionRepository.ts`.

5. **Implement Presentation Layer**:
   - `HanseiModal.tsx`, `CompoundVisualizerView.tsx`, `StreakBadge.tsx`, `HanseiHistoryList.tsx`, `useReflectionController.ts`, `index.ts`.

6. **Run all tests**:
   Run `npx vitest run tests/modules/reflection/` to ensure 100% pass.

7. **Commit**:
   `git add src/modules/reflection/ tests/modules/reflection/` and `git commit -m "feat: implement Reflection bounded context (Hansei 30-sec ritual, Never Miss Twice policy, 1% compound visualizer)"`.
