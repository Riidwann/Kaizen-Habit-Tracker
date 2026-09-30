# Fitur Tambahan & Revisi KaizenFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan fitur To-Do, Jadwal Rutin, Edit Goals menyeluruh, Self-Reward berbasis streak 7 hari, serta menyelesaikan 6 revisi UI/UX (pembersihan panduan, hapus footer, tombol hapus milestone permanen, manajemen kategori dinamis, pemisahan filter status vs kategori, dan klarifikasi timer opsional).

**Architecture:** Menerapkan Domain-Driven Design (DDD) & Clean Architecture dengan pemisahan domain entity, use case/controller, repository port, LocalStorage driver, dan InMemoryEventBus antar-modul. UI disajikan dalam estetika Zen Japandi responsif (Slide-Over Drawer & Bottom Sheet untuk akses cepat).

**Tech Stack:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Canvas Confetti, Vitest.

**Spec:** [`docs/superpowers/specs/2026-09-30-features-and-revisions-design.md`](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-09-30-features-and-revisions-design.md)

## Global Constraints

- Preserve Zen Japandi color palette (`sand`, `sage`, `charcoal`, `amber`) and WCAG AA contrast.
- Minimum 44x44px touch targets on all interactive buttons and checkboxes.
- Strict TypeScript typing with no `any` in new domain code.
- Zero horizontal scroll; fluid mobile-first responsive layout.
- All tasks must pass Vitest tests without breaking existing tests.

---

### Task 1: Revisi UI Cepat (Pembersihan Panduan, Hapus Footer, Tombol Milestone, & Timer Opsional)

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/modules/sanctuary/presentation/DailySanctuaryView.tsx`
- Modify: `src/modules/goals/presentation/GoalTreeItem.tsx`
- Modify: `src/modules/sanctuary/presentation/MicroActionCard.tsx`
- Test: `tests/presentation/GoalTreeItem.test.tsx` or run `npm run test`

**Interfaces:**
- Consumes: Existing presentation components (`GoalTreeItem`, `DailySanctuaryView`, `MicroActionCard`).
- Produces: Cleaner Home page (no footer, no welcome banner, no explanation card), permanently visible milestone delete button, and timer explicitly labeled as optional.

- [ ] **Step 1: Write/Update test for milestone delete button visibility**

In `tests/modules/goals/GoalTreeItem.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GoalTreeItem } from "@/modules/goals/presentation/GoalTreeItem";
import { Goal } from "@/modules/goals/domain/Goal";
import { Milestone } from "@/modules/goals/domain/Milestone";

describe("GoalTreeItem Milestone Delete Button", () => {
  it("renders milestone delete button without hidden opacity classes", () => {
    const goal = Goal.create({
      title: "Test Goal",
      category: "health",
      whyStatement: "Health is wealth",
      milestones: [Milestone.create("goal-1", "Milestone 1", 1).unwrap()],
    }).unwrap();

    render(
      <GoalTreeItem
        goal={goal}
        onToggleMilestone={vi.fn()}
        onAddMilestone={vi.fn()}
        onDeleteMilestone={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDeleteGoal={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText("Delete milestone Milestone 1");
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn.className).not.toContain("opacity-0");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/goals/GoalTreeItem.test.tsx`
Expected: FAIL because `opacity-0` is present.

- [ ] **Step 3: Update `GoalTreeItem.tsx` to remove `opacity-0 group-hover:opacity-100`**

In `src/modules/goals/presentation/GoalTreeItem.tsx`:
Replace:
```tsx
className="opacity-0 group-hover:opacity-100 p-1 text-charcoal-400 hover:text-red-600 transition-opacity"
```
With:
```tsx
className="p-1 text-charcoal-400 dark:text-sand-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
```

- [ ] **Step 4: Update `src/app/page.tsx` and `DailySanctuaryView.tsx`**

1. In `src/app/page.tsx`:
   - Remove `<Footer className="mb-14 sm:mb-0" />` and its import.
   - Remove `{isStorageEmpty && ...}` welcome card completely.
2. In `src/modules/sanctuary/presentation/DailySanctuaryView.tsx`:
   - Remove the `Micro-guide callout` (`{/* Micro-guide callout */} <div className="p-3 rounded-xl bg-sand-100/70...`).
3. In `src/modules/sanctuary/presentation/MicroActionCard.tsx`:
   - Update timer text in menu: `<span>Mulai Timer (Opsional - ${action.estimatedMinutes} Menit)</span>`.

- [ ] **Step 5: Run tests and verify they pass**

Run: `npx vitest run tests/modules/goals/GoalTreeItem.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit changes**

```bash
git add src/app/page.tsx src/modules/sanctuary/presentation/DailySanctuaryView.tsx src/modules/goals/presentation/GoalTreeItem.tsx src/modules/sanctuary/presentation/MicroActionCard.tsx tests/modules/goals/GoalTreeItem.test.tsx
git commit -m "refactor: clean home page, remove footer, make milestone delete always visible, clarify optional timer"
```

---

### Task 2: Manajemen Kategori Dinamis & Pemisahan Filter Status vs Kategori

**Files:**
- Create: `src/modules/goals/domain/CategoryRepositoryPort.ts`
- Create: `src/modules/goals/infrastructure/LocalStorageCategoryRepository.ts`
- Modify: `src/modules/goals/domain/GoalCategory.ts`
- Modify: `src/modules/goals/presentation/GoalManagerView.tsx`
- Modify: `src/modules/goals/presentation/GoalForgeWizard.tsx`
- Modify: `src/modules/goals/presentation/useGoalsController.ts`
- Test: `tests/modules/goals/CategoryRepository.test.ts`

**Interfaces:**
- Consumes: `GoalCategoryMeta`, `LocalStorageDriver`.
- Produces: `CategoryRepositoryPort` (`getCategories()`, `addCategory(cat)`, `deleteCategory(id)`), separated filter rows in `GoalManagerView`, inline category creator/remover in `GoalForgeWizard`.

- [ ] **Step 1: Write test for Category repository**

Create `tests/modules/goals/CategoryRepository.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageCategoryRepository } from "@/modules/goals/infrastructure/LocalStorageCategoryRepository";

describe("LocalStorageCategoryRepository", () => {
  let repo: LocalStorageCategoryRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageCategoryRepository();
  });

  it("returns default categories initially", async () => {
    const categories = await repo.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(5);
    expect(categories.some((c) => c.id === "health")).toBe(true);
  });

  it("can add a custom category and retrieve it", async () => {
    await repo.addCategory({
      id: "finance",
      label: "Keuangan & Investasi",
      badgeVariant: "amber",
      colorClass: "text-amber-800",
      pastelBg: "bg-amber-50",
      borderColor: "border-amber-200",
      iconName: "Coins",
      description: "Financial habits",
      isCustom: true,
    });
    const categories = await repo.getCategories();
    expect(categories.some((c) => c.id === "finance")).toBe(true);
  });

  it("can delete a custom category", async () => {
    await repo.addCategory({
      id: "gaming",
      label: "Gaming",
      badgeVariant: "charcoal",
      colorClass: "text-charcoal-800",
      pastelBg: "bg-sand-100",
      borderColor: "border-sand-300",
      iconName: "Gamepad",
      description: "Game dev",
      isCustom: true,
    });
    await repo.deleteCategory("gaming");
    const categories = await repo.getCategories();
    expect(categories.some((c) => c.id === "gaming")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/goals/CategoryRepository.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `CategoryRepositoryPort.ts` and `LocalStorageCategoryRepository.ts`**

In `src/modules/goals/domain/CategoryRepositoryPort.ts`:
```ts
import { GoalCategoryMeta } from "./GoalCategory";

export interface CategoryRepositoryPort {
  getCategories(): Promise<GoalCategoryMeta[]>;
  addCategory(category: GoalCategoryMeta): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}
```

In `src/modules/goals/infrastructure/LocalStorageCategoryRepository.ts`:
```ts
import { CategoryRepositoryPort } from "../domain/CategoryRepositoryPort";
import { GoalCategoryMeta, GOAL_CATEGORIES } from "../domain/GoalCategory";

const STORAGE_KEY = "kaizen_goal_categories";

export class LocalStorageCategoryRepository implements CategoryRepositoryPort {
  public async getCategories(): Promise<GoalCategoryMeta[]> {
    if (typeof window === "undefined") return Object.values(GOAL_CATEGORIES);
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaults = Object.values(GOAL_CATEGORIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(data);
    } catch {
      return Object.values(GOAL_CATEGORIES);
    }
  }

  public async addCategory(cat: GoalCategoryMeta): Promise<boolean> {
    const list = await this.getCategories();
    if (list.some((c) => c.id === cat.id)) return false;
    list.push(cat);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const list = await this.getCategories();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
```

- [ ] **Step 4: Update `GoalManagerView.tsx` to separate category and status filters**

In `src/modules/goals/presentation/GoalManagerView.tsx`:
Separate the filters into two clearly labeled rows with distinct visual styles:
- Group 1: `<div className="flex flex-col gap-1.5"><span className="text-xs font-semibold text-charcoal-700 dark:text-sand-300">Kategori Target:</span> ...chips... </div>`
- Group 2: `<div className="flex flex-col gap-1.5"><span className="text-xs font-semibold text-charcoal-700 dark:text-sand-300">Status Target:</span> ...segmented buttons with icons... </div>`

- [ ] **Step 5: Add inline category creation and deletion inside `GoalForgeWizard.tsx`**

In step 2 of `GoalForgeWizard.tsx` (Pemilihan Kategori):
Provide a "+ Kategori Baru" collapsible input and a small delete icon on custom categories so users can add and delete categories directly within the modal.

- [ ] **Step 6: Run tests and verify they pass**

Run: `npx vitest run tests/modules/goals/CategoryRepository.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit changes**

```bash
git add src/modules/goals/ tests/modules/goals/CategoryRepository.test.ts
git commit -m "feat: add dynamic custom categories and distinct goal status vs category filter UI"
```

---

### Task 3: Fitur Edit Goals Termasuk Isi Didalamnya

**Files:**
- Modify: `src/modules/goals/presentation/GoalForgeWizard.tsx`
- Modify: `src/modules/goals/presentation/GoalTreeItem.tsx`
- Modify: `src/modules/goals/presentation/useGoalsController.ts`
- Modify: `src/modules/goals/application/UpdateGoalUseCase.ts`
- Modify: `src/app/page.tsx`
- Test: `tests/modules/goals/UpdateGoalUseCase.test.ts`

**Interfaces:**
- Consumes: `Goal`, `UpdateGoalUseCase`.
- Produces: `editGoal(goal: Goal)` handler in `useGoalsController`, Edit button on `GoalTreeItem`, `GoalForgeWizard` mode="edit", `GoalUpdatedEvent` broadcast.

- [ ] **Step 1: Write test for updating all fields in `UpdateGoalUseCase`**

Create `tests/modules/goals/UpdateGoalUseCase.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { UpdateGoalUseCase } from "@/modules/goals/application/UpdateGoalUseCase";
import { Goal } from "@/modules/goals/domain/Goal";
import { InMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

class MockGoalRepo {
  public goals: Map<string, Goal> = new Map();
  async findById(id: string) {
    const g = this.goals.get(id);
    return { isErr: () => !g, isOk: () => !!g, unwrap: () => g, getError: () => null };
  }
  async save(goal: Goal) {
    this.goals.set(goal.id, goal);
    return { isErr: () => false, isOk: () => true, unwrap: () => goal, getError: () => null };
  }
}

describe("UpdateGoalUseCase Full Edit", () => {
  it("updates title, category, why, micro-action, and emergency fallback", async () => {
    const repo = new MockGoalRepo() as any;
    const bus = new InMemoryEventBus();
    const useCase = new UpdateGoalUseCase(repo, bus);

    const goal = Goal.create({
      title: "Initial Title",
      category: "health",
      whyStatement: "Initial Why",
      microAction: "Pushup 2 mnt",
      scaleDownFallback: "Pushup 10 dtk",
    }).unwrap();
    repo.goals.set(goal.id, goal);

    const result = await useCase.execute({
      id: goal.id,
      title: "Updated Title",
      category: "learning",
      whyText: "Updated Why Reason",
      microAction: "Baca 1 lembar",
      scaleDownFallback: "Baca 1 paragraf",
    });

    expect(result.isOk()).toBe(true);
    const updated = repo.goals.get(goal.id);
    expect(updated.title).toBe("Updated Title");
    expect(updated.category).toBe("learning");
    expect(updated.whyStatement.whyText).toBe("Updated Why Reason");
    expect(updated.microAction).toBe("Baca 1 lembar");
    expect(updated.scaleDownFallback).toBe("Baca 1 paragraf");
  });
});
```

- [ ] **Step 2: Run test to verify it passes or check failures**

Run: `npx vitest run tests/modules/goals/UpdateGoalUseCase.test.ts`
Expected: PASS (or verify `UpdateGoalUseCase.ts` covers `whyText` and `microAction`).

- [ ] **Step 3: Update `GoalForgeWizard.tsx` to support Edit Mode**

Props:
```tsx
export interface GoalForgeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalDTO | (UpdateGoalDTO & { milestones?: string[] })) => Promise<void>;
  isLoading?: boolean;
  initialGoal?: Goal | null;
}
```
If `initialGoal` is provided:
- Form fields are pre-filled with `initialGoal.title`, `initialGoal.category`, `initialGoal.whyStatement.whyText`, `initialGoal.microAction`, `initialGoal.scaleDownFallback`, and `initialGoal.milestones`.
- Modal title changes from "Tempa Sasaran Baru (Forge Goal)" to "Edit Sasaran: {title}".
- Submit button text says "Simpan Perubahan".

- [ ] **Step 4: Update `useGoalsController.ts` & `GoalTreeItem.tsx`**

1. In `useGoalsController.ts`:
   - Add state: `editingGoal: Goal | null`.
   - Add `openEditModal(goal: Goal)` and `closeEditModal()`.
   - Add `updateGoal(data: UpdateGoalDTO & { milestones?: string[] }): Promise<boolean>`.
2. In `GoalTreeItem.tsx`:
   - Add `onEditGoal?: (goal: Goal) => void` prop.
   - Add an Edit button (`<Pencil className="w-3.5 h-3.5" />`) next to Pause and Achieved buttons.
3. In `src/app/page.tsx`:
   - Connect `GoalUpdatedEvent` listener: when fired, update linked microAction in sanctuary.

- [ ] **Step 5: Run tests and verify they pass**

Run: `npx vitest run tests/modules/goals/UpdateGoalUseCase.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit changes**

```bash
git add src/modules/goals/ tests/modules/goals/UpdateGoalUseCase.test.ts src/app/page.tsx
git commit -m "feat: implement full goal editing including why statement, micro-actions, and milestones"
```

---

### Task 4: Modul To-Do (Domain, Storage, & Event Bus)

**Files:**
- Create: `src/modules/todo/domain/TodoItem.ts`
- Create: `src/modules/todo/domain/TodoRepositoryPort.ts`
- Create: `src/modules/todo/domain/events/TodoCompletedEvent.ts`
- Create: `src/modules/todo/infrastructure/LocalStorageTodoRepository.ts`
- Create: `src/modules/todo/presentation/useTodoController.ts`
- Create: `src/modules/todo/index.ts`
- Test: `tests/modules/todo/TodoItem.test.ts`
- Test: `tests/modules/todo/LocalStorageTodoRepository.test.ts`

**Interfaces:**
- Consumes: `BaseEntity`, `InMemoryEventBus`.
- Produces: `TodoItem`, `TodoRepositoryPort`, `useTodoController`, `TodoCompletedEvent`.

- [ ] **Step 1: Write test for `TodoItem` entity**

Create `tests/modules/todo/TodoItem.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { TodoItem } from "@/modules/todo/domain/TodoItem";

describe("TodoItem Domain Entity", () => {
  it("creates a valid todo item", () => {
    const res = TodoItem.create({
      title: "Membeli buku jurnal",
      priority: "high",
      dueDate: "2026-10-05",
    });
    expect(res.isOk()).toBe(true);
    const todo = res.unwrap();
    expect(todo.title).toBe("Membeli buku jurnal");
    expect(todo.priority).toBe("high");
    expect(todo.isCompleted).toBe(false);
    expect(todo.completedAt).toBeNull();
  });

  it("fails if title is empty or whitespace", () => {
    const res = TodoItem.create({ title: "   " });
    expect(res.isErr()).toBe(true);
  });

  it("toggles completion status and sets completedAt", () => {
    const todo = TodoItem.create({ title: "Valid title" }).unwrap();
    todo.toggleComplete();
    expect(todo.isCompleted).toBe(true);
    expect(todo.completedAt).not.toBeNull();

    todo.toggleComplete();
    expect(todo.isCompleted).toBe(false);
    expect(todo.completedAt).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/todo/TodoItem.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `TodoItem.ts`, `TodoCompletedEvent.ts`, `TodoRepositoryPort.ts`, and `LocalStorageTodoRepository.ts`**

1. In `src/modules/todo/domain/TodoItem.ts`:
```ts
import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export type TodoPriority = "low" | "medium" | "high";

export interface TodoItemProps {
  id?: string;
  title: string;
  priority?: TodoPriority;
  dueDate?: string | null;
  isCompleted?: boolean;
  completedAt?: string | null;
  createdAt?: string;
}

export class TodoItem extends BaseEntity {
  private _title: string;
  private _priority: TodoPriority;
  private _dueDate: string | null;
  private _isCompleted: boolean;
  private _completedAt: string | null;
  private _createdAt: string;

  private constructor(props: TodoItemProps) {
    super(props.id || crypto.randomUUID());
    this._title = props.title.trim();
    this._priority = props.priority || "medium";
    this._dueDate = props.dueDate || null;
    this._isCompleted = Boolean(props.isCompleted);
    this._completedAt = props.completedAt || null;
    this._createdAt = props.createdAt || new Date().toISOString();
  }

  public get title(): string { return this._title; }
  public get priority(): TodoPriority { return this._priority; }
  public get dueDate(): string | null { return this._dueDate; }
  public get isCompleted(): boolean { return this._isCompleted; }
  public get completedAt(): string | null { return this._completedAt; }
  public get createdAt(): string { return this._createdAt; }

  public toggleComplete(): void {
    this._isCompleted = !this._isCompleted;
    this._completedAt = this._isCompleted ? new Date().toISOString() : null;
  }

  public static create(props: TodoItemProps): Result<TodoItem, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Judul tugas tidak boleh kosong");
    }
    return Result.ok(new TodoItem(props));
  }

  public toJSON(): TodoItemProps & { id: string } {
    return {
      id: this.id,
      title: this._title,
      priority: this._priority,
      dueDate: this._dueDate,
      isCompleted: this._isCompleted,
      completedAt: this._completedAt,
      createdAt: this._createdAt,
    };
  }
}
```

2. In `src/modules/todo/domain/events/TodoCompletedEvent.ts`:
```ts
import { DomainEvent } from "@/shared/domain/DomainEvent";

export class TodoCompletedEvent implements DomainEvent {
  public readonly eventName = "TodoCompleted";
  public readonly occurredOn: Date;

  constructor(public readonly payload: { todoId: string; title: string; completedAt: string }) {
    this.occurredOn = new Date();
  }
}
```

3. In `src/modules/todo/domain/TodoRepositoryPort.ts` & `LocalStorageTodoRepository.ts`:
Implement CRUD for todos using storage key `kaizen_todos`.

4. In `src/modules/todo/presentation/useTodoController.ts`:
Provide `todos`, `activeTodosCount`, `addTodo`, `toggleCompleteTodo`, `deleteTodo`, `filter`, `setFilter`.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npx vitest run tests/modules/todo/TodoItem.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add src/modules/todo/ tests/modules/todo/
git commit -m "feat: implement TodoItem entity, repository, and useTodoController"
```

---

### Task 5: Modul Jadwal Rutin (Domain, Storage, & Reset Policy)

**Files:**
- Create: `src/modules/routines/domain/RoutineSchedule.ts`
- Create: `src/modules/routines/domain/RoutineRepositoryPort.ts`
- Create: `src/modules/routines/infrastructure/LocalStorageRoutineRepository.ts`
- Create: `src/modules/routines/presentation/useRoutineController.ts`
- Create: `src/modules/routines/index.ts`
- Test: `tests/modules/routines/RoutineSchedule.test.ts`

**Interfaces:**
- Consumes: `BaseEntity`.
- Produces: `RoutineSchedule`, `RoutineRepositoryPort`, `useRoutineController`.

- [ ] **Step 1: Write test for `RoutineSchedule` entity and daily reset**

Create `tests/modules/routines/RoutineSchedule.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { RoutineSchedule } from "@/modules/routines/domain/RoutineSchedule";

describe("RoutineSchedule Domain Entity", () => {
  it("creates a valid routine schedule", () => {
    const res = RoutineSchedule.create({
      title: "Olahraga Pagi 15 Menit",
      time: "06:30",
      daysOfWeek: [1, 2, 3, 4, 5],
    });
    expect(res.isOk()).toBe(true);
    const routine = res.unwrap();
    expect(routine.time).toBe("06:30");
    expect(routine.daysOfWeek).toEqual([1, 2, 3, 4, 5]);
    expect(routine.isCompletedToday).toBe(false);
  });

  it("evaluates isCompletedToday based on lastCompletedDate", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const routine = RoutineSchedule.create({
      title: "Membaca Buku",
      time: "20:00",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      lastCompletedDate: todayStr,
    }).unwrap();

    expect(routine.isCompletedToday).toBe(true);

    // Old date should not be completed today
    const oldRoutine = RoutineSchedule.create({
      title: "Membaca Buku",
      time: "20:00",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      lastCompletedDate: "2026-01-01",
    }).unwrap();

    expect(oldRoutine.isCompletedToday).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/routines/RoutineSchedule.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `RoutineSchedule.ts`, `RoutineRepositoryPort.ts`, and `LocalStorageRoutineRepository.ts`**

In `src/modules/routines/domain/RoutineSchedule.ts`:
```ts
import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export interface RoutineScheduleProps {
  id?: string;
  title: string;
  time: string; // HH:mm
  daysOfWeek: number[]; // 0..6
  lastCompletedDate?: string | null;
  createdAt?: string;
}

export class RoutineSchedule extends BaseEntity {
  private _title: string;
  private _time: string;
  private _daysOfWeek: number[];
  private _lastCompletedDate: string | null;
  private _createdAt: string;

  private constructor(props: RoutineScheduleProps) {
    super(props.id || crypto.randomUUID());
    this._title = props.title.trim();
    this._time = props.time;
    this._daysOfWeek = props.daysOfWeek;
    this._lastCompletedDate = props.lastCompletedDate || null;
    this._createdAt = props.createdAt || new Date().toISOString();
  }

  public get title(): string { return this._title; }
  public get time(): string { return this._time; }
  public get daysOfWeek(): number[] { return this._daysOfWeek; }
  public get lastCompletedDate(): string | null { return this._lastCompletedDate; }
  public get createdAt(): string { return this._createdAt; }

  public get isCompletedToday(): boolean {
    const today = new Date().toISOString().split("T")[0];
    return this._lastCompletedDate === today;
  }

  public toggleCompleteToday(): void {
    const today = new Date().toISOString().split("T")[0];
    if (this.isCompletedToday) {
      this._lastCompletedDate = null;
    } else {
      this._lastCompletedDate = today;
    }
  }

  public static create(props: RoutineScheduleProps): Result<RoutineSchedule, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Nama rutinitas tidak boleh kosong");
    }
    if (!/^\d{2}:\d{2}$/.test(props.time)) {
      return Result.err("Format jam harus HH:mm");
    }
    if (!props.daysOfWeek || props.daysOfWeek.length === 0) {
      return Result.err("Pilih minimal 1 hari aktif");
    }
    return Result.ok(new RoutineSchedule(props));
  }

  public toJSON(): RoutineScheduleProps & { id: string } {
    return {
      id: this.id,
      title: this._title,
      time: this._time,
      daysOfWeek: this._daysOfWeek,
      lastCompletedDate: this._lastCompletedDate,
      createdAt: this._createdAt,
    };
  }
}
```

- [ ] **Step 4: Implement repository and controller**

In `src/modules/routines/infrastructure/LocalStorageRoutineRepository.ts`:
Implement storage with key `kaizen_routines`.
In `src/modules/routines/presentation/useRoutineController.ts`:
Provide `routines` (sorted by time `HH:mm`), `addRoutine`, `toggleCompleteToday`, `deleteRoutine`, `remainingCountToday`.

- [ ] **Step 5: Run tests and verify they pass**

Run: `npx vitest run tests/modules/routines/RoutineSchedule.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit changes**

```bash
git add src/modules/routines/ tests/modules/routines/
git commit -m "feat: implement RoutineSchedule entity, repository, and controller with daily reset"
```

---

### Task 6: Komponen UI Quick-Access Slide-Over Drawer & Bottom Sheet

**Files:**
- Create: `src/components/layout/SlideOverDrawer.tsx`
- Create: `src/modules/todo/presentation/TodoListPanel.tsx`
- Create: `src/modules/routines/presentation/RoutineSchedulePanel.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/app/page.tsx`
- Test: Manual UI & `npm run build`

**Interfaces:**
- Consumes: `useTodoController`, `useRoutineController`.
- Produces: Header Quick Access action buttons for To-Do and Routines with pending indicators, responsive slide-over drawer / bottom sheet containing both panels.

- [ ] **Step 1: Create `SlideOverDrawer.tsx`**

Implement a responsive modal overlay:
- On desktop: slides in from the right edge with backdrop.
- On mobile: slides up from the bottom as a bottom sheet.
- Supports smooth keyboard Escape and outside click dismissal.

- [ ] **Step 2: Create `TodoListPanel.tsx`**

- Form: Quick add task input, priority selection pills, optional due date.
- Filter: Tab pills for *Semua*, *Aktif*, *Selesai*.
- List: Tasks with custom 44px checkbox, priority badge, due date display, strikethrough effect when done, and subtle delete icon.
- EventBus: When completed, publishes `TodoCompletedEvent`.

- [ ] **Step 3: Create `RoutineSchedulePanel.tsx`**

- Form: Activity title input, time picker (`HH:mm`), day selector chips (S, S, R, K, J, S, M).
- List: Routines sorted by time. Each routine shows time badge, active days, 44px daily checkbox, and delete button.

- [ ] **Step 4: Integrate buttons in `Header.tsx` and `page.tsx`**

- In `Header.tsx`:
  - Add "To-Do" button with pending tasks counter badge.
  - Add "Jadwal" button with pending routines counter badge.
  - Clicking either opens `SlideOverDrawer` with the corresponding active tab.
- In `src/app/page.tsx`:
  - Wire up `inMemoryEventBus.subscribe("TodoCompleted", ...)` to increment micro-wins in reflection.

- [ ] **Step 5: Run build check**

Run: `npm run build`
Expected: Build succeeds without type or bundling errors.

- [ ] **Step 6: Commit changes**

```bash
git add src/components/layout/SlideOverDrawer.tsx src/modules/todo/presentation/TodoListPanel.tsx src/modules/routines/presentation/RoutineSchedulePanel.tsx src/components/layout/Header.tsx src/app/page.tsx
git commit -m "feat: add responsive SlideOverDrawer with To-Do and Routine Schedule panels"
```

---

### Task 7: Modul Self-Reward & Home Page Celebration Banner

**Files:**
- Create: `src/modules/rewards/domain/SelfReward.ts`
- Create: `src/modules/rewards/domain/SelfRewardRepositoryPort.ts`
- Create: `src/modules/rewards/infrastructure/LocalStorageRewardRepository.ts`
- Create: `src/modules/rewards/presentation/SelfRewardBanner.tsx`
- Create: `src/modules/rewards/presentation/useRewardController.ts`
- Create: `src/modules/rewards/index.ts`
- Modify: `src/app/page.tsx`
- Test: `tests/modules/rewards/SelfReward.test.ts`

**Interfaces:**
- Consumes: `StreakCounter` (from `reflection`), `BaseEntity`.
- Produces: `SelfReward`, `SelfRewardBanner`, `useRewardController`.

- [ ] **Step 1: Write test for `SelfReward` eligibility and lifecycle**

Create `tests/modules/rewards/SelfReward.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { SelfReward } from "@/modules/rewards/domain/SelfReward";

describe("SelfReward Domain Entity", () => {
  it("initializes with pending status", () => {
    const reward = SelfReward.create({
      title: "Traktir kopi spesial & roti",
      targetStreak: 7,
    }).unwrap();

    expect(reward.status).toBe("pending");
    expect(reward.targetStreak).toBe(7);
  });

  it("transitions to earned when streak reaches target", () => {
    const reward = SelfReward.create({
      title: "Nonton bioskop",
      targetStreak: 7,
    }).unwrap();

    reward.checkEligibility(7);
    expect(reward.status).toBe("earned");
    expect(reward.earnedDate).not.toBeNull();
  });

  it("transitions to claimed when claimed by user", () => {
    const reward = SelfReward.create({
      title: "Beli buku baru",
      targetStreak: 7,
      status: "earned",
    }).unwrap();

    reward.claim();
    expect(reward.status).toBe("claimed");
    expect(reward.claimedDate).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/rewards/SelfReward.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `SelfReward.ts`, repository, and controller**

In `src/modules/rewards/domain/SelfReward.ts`:
```ts
import { BaseEntity } from "@/shared/domain/BaseEntity";
import { Result } from "@/shared/domain/Result";

export type RewardStatus = "pending" | "earned" | "claimed";

export interface SelfRewardProps {
  id?: string;
  title: string;
  targetStreak: number;
  status?: RewardStatus;
  earnedDate?: string | null;
  claimedDate?: string | null;
  createdAt?: string;
}

export class SelfReward extends BaseEntity {
  private _title: string;
  private _targetStreak: number;
  private _status: RewardStatus;
  private _earnedDate: string | null;
  private _claimedDate: string | null;
  private _createdAt: string;

  private constructor(props: SelfRewardProps) {
    super(props.id || crypto.randomUUID());
    this._title = props.title.trim();
    this._targetStreak = props.targetStreak || 7;
    this._status = props.status || "pending";
    this._earnedDate = props.earnedDate || null;
    this._claimedDate = props.claimedDate || null;
    this._createdAt = props.createdAt || new Date().toISOString();
  }

  public get title(): string { return this._title; }
  public get targetStreak(): number { return this._targetStreak; }
  public get status(): RewardStatus { return this._status; }
  public get earnedDate(): string | null { return this._earnedDate; }
  public get claimedDate(): string | null { return this._claimedDate; }
  public get createdAt(): string { return this._createdAt; }

  public updateTitle(newTitle: string): void {
    if (newTitle.trim().length > 0) this._title = newTitle.trim();
  }

  public checkEligibility(currentStreak: number): boolean {
    if (this._status === "pending" && currentStreak >= this._targetStreak) {
      this._status = "earned";
      this._earnedDate = new Date().toISOString().split("T")[0];
      return true;
    }
    return false;
  }

  public claim(): void {
    this._status = "claimed";
    this._claimedDate = new Date().toISOString().split("T")[0];
  }

  public static create(props: SelfRewardProps): Result<SelfReward, string> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.err("Nama self-reward tidak boleh kosong");
    }
    return Result.ok(new SelfReward(props));
  }

  public toJSON(): SelfRewardProps & { id: string } {
    return {
      id: this.id,
      title: this._title,
      targetStreak: this._targetStreak,
      status: this._status,
      earnedDate: this._earnedDate,
      claimedDate: this._claimedDate,
      createdAt: this._createdAt,
    };
  }
}
```

- [ ] **Step 4: Create `SelfRewardBanner.tsx` and integrate in `src/app/page.tsx`**

- In `SelfRewardBanner.tsx`:
  - Renders when `activeReward.status === "earned"`.
  - Festive warm design with trophy / gift icon, confetti trigger on click, reward description, and "Klaim & Nikmati Hadiah" button.
  - If no reward title is set yet, provides an inline input so user can declare what they are giving themselves!
  - Once claimed, sets up the next reward target for streak 14.
- In `src/app/page.tsx`:
  - Mount `<SelfRewardBanner />` at the top of the Sanctuary view when streak condition is met.

- [ ] **Step 5: Run tests and verify they pass**

Run: `npx vitest run tests/modules/rewards/SelfReward.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit changes**

```bash
git add src/modules/rewards/ tests/modules/rewards/ src/app/page.tsx
git commit -m "feat: implement SelfReward entity, repository, and home page celebration banner"
```

---

### Task 8: Update Cadangan Data (Backup/Restore) & Verifikasi Menyeluruh

**Files:**
- Modify: `src/modules/backup/domain/SystemSnapshot.ts`
- Modify: `src/modules/backup/infrastructure/LocalStorageBackupRepository.ts`
- Modify: `src/modules/backup/presentation/DataBackupModal.tsx`
- Test: `tests/modules/backup/LocalStorageBackupRepository.test.ts` or run full test suite

**Interfaces:**
- Consumes: All repository ports (`GoalRepositoryPort`, `SanctuaryRepositoryPort`, `ReflectionRepositoryPort`, `TodoRepositoryPort`, `RoutineRepositoryPort`, `SelfRewardRepositoryPort`, `CategoryRepositoryPort`).
- Produces: Complete system snapshot export/import supporting all new modules with full backward compatibility.

- [ ] **Step 1: Update `SystemSnapshot.ts` schema**

In `src/modules/backup/domain/SystemSnapshot.ts`:
```ts
export interface SystemSnapshot {
  version: string;
  exportedAt: string;
  goals: any[];
  microActions: any[];
  reflections: any[];
  todos?: any[];
  routines?: any[];
  rewards?: any[];
  customCategories?: any[];
}
```

- [ ] **Step 2: Update `LocalStorageBackupRepository.ts`**

Include `kaizen_todos`, `kaizen_routines`, `kaizen_self_rewards`, and `kaizen_goal_categories` in both export and restore methods.
Ensure backward compatibility: if imported JSON lacks these fields, populate empty arrays or default categories without throwing errors.

- [ ] **Step 3: Run complete Vitest suite**

Run: `npm run test`
Expected: All tests PASS.

- [ ] **Step 4: Run production build check**

Run: `npm run build`
Expected: Production build succeeds with 0 errors.

- [ ] **Step 5: Commit changes**

```bash
git add src/modules/backup/
git commit -m "feat: update system backup and restore for todos, routines, rewards, and custom categories"
```
