# Task 4 Brief: Sanctuary Bounded Context (Daily Focus, 2-Min Timer & Emergency Scale-Down)

**Files:**
- Create: `src/modules/sanctuary/domain/MicroAction.ts`
- Create: `src/modules/sanctuary/domain/DailyFocusPolicy.ts`
- Create: `src/modules/sanctuary/domain/SanctuaryRepositoryPort.ts`
- Create: `src/modules/sanctuary/domain/events/MicroActionCompletedEvent.ts`
- Create: `src/modules/sanctuary/domain/events/EmergencyScaleDownTriggeredEvent.ts`
- Create: `src/modules/sanctuary/application/GetDailyFocusActionsUseCase.ts`
- Create: `src/modules/sanctuary/application/CompleteMicroActionUseCase.ts`
- Create: `src/modules/sanctuary/application/ScaleDownMicroActionUseCase.ts`
- Create: `src/modules/sanctuary/application/CreateMicroActionUseCase.ts`
- Create: `src/modules/sanctuary/infrastructure/LocalStorageSanctuaryRepository.ts`
- Create: `src/modules/sanctuary/presentation/DailySanctuaryView.tsx`
- Create: `src/modules/sanctuary/presentation/MicroActionCard.tsx`
- Create: `src/modules/sanctuary/presentation/ActionTimerModal.tsx`
- Create: `src/modules/sanctuary/presentation/DailyCompletionState.tsx`
- Create: `src/modules/sanctuary/presentation/useSanctuaryController.ts`
- Create: `src/modules/sanctuary/index.ts`
- Test: `tests/modules/sanctuary/MicroActionDomain.test.ts`
- Test: `tests/modules/sanctuary/CompleteMicroActionUseCase.test.ts`
- Test: `tests/modules/sanctuary/ActionTimerModal.test.tsx`
- Test: `tests/modules/sanctuary/DailySanctuaryView.test.tsx`

**Interfaces:**
- Consumes: `@/shared/domain/*`, `@/shared/infrastructure/LocalStorageDriver`, `@/shared/infrastructure/WebAudioService`, `@/shared/infrastructure/InMemoryEventBus`, `@/shared/presentation/*`.
- Produces:
  1. `MicroAction` Entity:
     - `id`, `goalId`, `milestoneId`, `title`, `scaleDownTitle`, `estimatedMinutes` (invariant: $\le 2$), `isScaledDown`, `isActiveToday`, `isCompletedToday`.
     - Methods: `toggleScaleDown()`, `complete()`, `uncomplete()`, `validateDuration()`.
  2. `DailyFocusPolicy` (Domain Service):
     - Invariant: Maximum 3 active micro-actions for today's Daily Sanctuary (Tunnel Vision to prevent overwhelm).
     - Method: `filterFocusActions(actions: MicroAction[]): MicroAction[]`.
  3. Domain Events: `MicroActionCompletedEvent` and `EmergencyScaleDownTriggeredEvent` dispatched to EventBus.
  4. Use Cases:
     - `GetDailyFocusActionsUseCase`: returns maximum 3 active micro-actions for today.
     - `CompleteMicroActionUseCase`: completes micro-action, records completion in daily log, fires `MicroActionCompletedEvent`.
     - `ScaleDownMicroActionUseCase`: triggers emergency scale-down toggle without penalty, fires `EmergencyScaleDownTriggeredEvent`.
     - `CreateMicroActionUseCase`: creates micro-action adhering to the $\le 2$ min invariant.
  5. `LocalStorageSanctuaryRepository`: implements `SanctuaryRepositoryPort`.
  6. Presentation:
     - `DailySanctuaryView`: Header with today's date, 1% progress bar ("X dari Y Selesai"), list of 1-3 `MicroActionCard`, `DailyCompletionState` when all are done with calm Zen quote & confetti.
     - `MicroActionCard`: Checkbox with smooth animation, Category Tag, Task Title (dynamic based on normal vs emergency scale-down mode), `⏱️ 2-Min Timer` button, `🛡️ Terlalu Berat?` toggle.
     - `ActionTimerModal`: Circular SVG countdown 120s, play/pause/reset, auto-plays gentle Zen bell sound via `WebAudioService` upon completion, and marks task complete.
     - `useSanctuaryController`: custom hook orchestrating actions, timer modal state, celebration state, and event bus subscriptions.

### Step-by-Step Instructions:

1. **Write failing unit tests**:
   - `tests/modules/sanctuary/MicroActionDomain.test.ts`: test duration invariant <= 2 min, toggleScaleDown, complete.
   - `tests/modules/sanctuary/CompleteMicroActionUseCase.test.ts`: test completing task and event dispatch.
   - `tests/modules/sanctuary/ActionTimerModal.test.tsx`: test 120s timer countdown, play/pause, completion.
   - `tests/modules/sanctuary/DailySanctuaryView.test.tsx`: test rendering 1-3 cards, emergency toggle, completion state.

2. **Implement Domain Layer**:
   - `MicroAction.ts`, `DailyFocusPolicy.ts`, `SanctuaryRepositoryPort.ts`, event classes.

3. **Implement Application Layer**:
   - `GetDailyFocusActionsUseCase.ts`, `CompleteMicroActionUseCase.ts`, `ScaleDownMicroActionUseCase.ts`, `CreateMicroActionUseCase.ts`.

4. **Implement Infrastructure Layer**:
   - `LocalStorageSanctuaryRepository.ts`.

5. **Implement Presentation Layer**:
   - `DailySanctuaryView.tsx`, `MicroActionCard.tsx`, `ActionTimerModal.tsx`, `DailyCompletionState.tsx`, `useSanctuaryController.ts`, `index.ts`.

6. **Run all tests**:
   Run `npx vitest run tests/modules/sanctuary/` to ensure 100% pass.

7. **Commit**:
   `git add src/modules/sanctuary/ tests/modules/sanctuary/` and `git commit -m "feat: implement Sanctuary bounded context (tunnel vision, emergency scale-down, action timer)"`.
