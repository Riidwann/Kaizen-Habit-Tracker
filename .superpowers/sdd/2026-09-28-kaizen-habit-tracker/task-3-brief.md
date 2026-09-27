# Task 3 Brief: Goals Bounded Context (Goal Forge & Decomposition)

**Files:**
- Create: `src/modules/goals/domain/GoalCategory.ts`
- Create: `src/modules/goals/domain/EmotionalAnchor.ts`
- Create: `src/modules/goals/domain/Milestone.ts`
- Create: `src/modules/goals/domain/Goal.ts`
- Create: `src/modules/goals/domain/GoalRepositoryPort.ts`
- Create: `src/modules/goals/domain/events/GoalCreatedEvent.ts`
- Create: `src/modules/goals/domain/events/GoalUpdatedEvent.ts`
- Create: `src/modules/goals/domain/events/GoalDeletedEvent.ts`
- Create: `src/modules/goals/application/CreateGoalUseCase.ts`
- Create: `src/modules/goals/application/UpdateGoalUseCase.ts`
- Create: `src/modules/goals/application/DeleteGoalUseCase.ts`
- Create: `src/modules/goals/application/GetGoalsUseCase.ts`
- Create: `src/modules/goals/infrastructure/LocalStorageGoalRepository.ts`
- Create: `src/modules/goals/presentation/GoalForgeWizard.tsx`
- Create: `src/modules/goals/presentation/GoalManagerView.tsx`
- Create: `src/modules/goals/presentation/GoalTreeItem.tsx`
- Create: `src/modules/goals/presentation/useGoalsController.ts`
- Create: `src/modules/goals/index.ts`
- Test: `tests/modules/goals/GoalDomain.test.ts`
- Test: `tests/modules/goals/CreateGoalUseCase.test.ts`
- Test: `tests/modules/goals/GoalForgeWizard.test.tsx`

**Interfaces:**
- Consumes: `@/shared/domain/BaseEntity`, `@/shared/domain/ValueObject`, `@/shared/domain/Result`, `@/shared/domain/DomainEvent`, `@/shared/infrastructure/LocalStorageDriver`, `@/shared/presentation/*`.
- Produces:
  1. `GoalCategory`: `'health' | 'career' | 'learning' | 'mindset' | 'creativity' | 'custom'` with human-readable labels and pastel badge styles.
  2. `EmotionalAnchor` (Value Object): encapsulates `whyText`, validates non-empty.
  3. `Milestone` (Entity): `id`, `goalId`, `title`, `order`, `isCompleted`.
  4. `Goal` (Aggregate Root Entity): `id`, `title`, `whyStatement: EmotionalAnchor`, `category: GoalCategory`, `status: 'active' | 'paused' | 'achieved'`, `milestones: Milestone[]`, methods `addMilestone()`, `removeMilestone()`, `updateStatus()`, `updateTitle()`.
  5. `GoalRepositoryPort`: interface with `save(goal: Goal): Promise<Result<void>>`, `findById(id: string): Promise<Result<Goal | null>>`, `findAll(): Promise<Result<Goal[]>>`, `delete(id: string): Promise<Result<void>>`.
  6. Use cases (`CreateGoalUseCase`, `UpdateGoalUseCase`, `DeleteGoalUseCase`, `GetGoalsUseCase`).
  7. `LocalStorageGoalRepository`: implements `GoalRepositoryPort` using `LocalStorageDriver`.
  8. Presentation:
     - `GoalForgeWizard`: 4-step wizard modal:
       - Step 1: Vision title & Category selector with Zen icons.
       - Step 2: "The Why" emotional anchor text area (Kaizen psychology prompt: *"Why is this deeply important for you?"*).
       - Step 3: First Milestone input.
       - Step 4: Micro-Action (<= 2 min) + Emergency Scale-Down fallback.
     - `GoalManagerView`: List of master goals with expandable Goal Tree (Milestones & Micro-actions), filter by category/status, delete/edit actions.
     - `GoalTreeItem`: Visual hierarchy item with clean line connectors and category badge.
     - `useGoalsController`: custom hook exposing `goals`, `isLoading`, `createGoal()`, `deleteGoal()`, `updateGoalStatus()`, `openForgeModal()`, `isForgeOpen`.

### Step-by-Step Instructions:

1. **Write failing unit tests**:
   - `tests/modules/goals/GoalDomain.test.ts`: test Goal entity creation, milestone addition, emotional anchor validation.
   - `tests/modules/goals/CreateGoalUseCase.test.ts`: test create goal, validation failure on empty title/why, successful persistence.
   - `tests/modules/goals/GoalForgeWizard.test.tsx`: test 4-step wizard navigation, input filling, submit triggers controller.

2. **Implement Domain Layer**:
   - `GoalCategory.ts`, `EmotionalAnchor.ts`, `Milestone.ts`, `Goal.ts`, `GoalRepositoryPort.ts`, domain event classes.

3. **Implement Application Layer**:
   - `CreateGoalUseCase.ts`, `UpdateGoalUseCase.ts`, `DeleteGoalUseCase.ts`, `GetGoalsUseCase.ts`.

4. **Implement Infrastructure Layer**:
   - `LocalStorageGoalRepository.ts`.

5. **Implement Presentation Layer**:
   - `GoalForgeWizard.tsx`, `GoalManagerView.tsx`, `GoalTreeItem.tsx`, `useGoalsController.ts`, `index.ts`.

6. **Run all tests**:
   Run `npx vitest run tests/modules/goals/` and ensure 100% pass.

7. **Commit**:
   `git add src/modules/goals/ tests/modules/goals/` and `git commit -m "feat: implement Goals bounded context with DDD and Clean Architecture"`.
