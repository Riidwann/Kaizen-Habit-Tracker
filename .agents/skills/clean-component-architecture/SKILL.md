---
name: clean-component-architecture
description: >-
  Use this skill when designing or refactoring React component hierarchies, separating
  presentational UI from business logic via custom hook controllers, managing state with
  Zustand or context without re-render bloat, and enforcing clean TypeScript architecture.
---

# Clean Component Architecture: Separation of Concerns & Scalability

A clean frontend codebase separates visual presentation from domain business logic. UI components must be easily readable, testable, and maintainable without sprawling 500-line monolithic files.

---

## 1. Container-Presenter (Smart vs. Dumb) Pattern

- **Presentational (Dumb) Components:**
  - Receive pure props (`data`, `onAction`).
  - Contain zero business logic, zero direct database/API queries, and zero global store mutations.
  - Focused strictly on markup, styling (Tailwind/CSS), and local UI state (e.g., dropdown expanded or collapsed).
  - Highly reusable and trivial to test with Storybook or unit tests.
- **Container / Controller (Smart) Components & Hooks:**
  - Connect to global stores (Zustand, Redux, React Query).
  - Handle validation, network calls, data transforms, and analytics.
  - Pass clean, prepared data down to presentational components.

---

## 2. Custom Hook Controllers

When a component grows past ~150 lines or mixes complex logic with UI rendering, extract logic into a custom controller hook:

```tsx
// ❌ Messy Monolith:
export function HabitTracker() {
  const [data, setData] = useState(...);
  // 100 lines of calculations, local storage, validation, timer tickers...
  return <div>...</div>;
}

// ✅ Clean Architecture:
// 1. Controller Hook: useHabitController.ts
export function useHabitController() {
  const habits = useHabitStore((s) => s.habits);
  const logHabit = useHabitStore((s) => s.logHabit);
  // encapsulates calculations, streak logic, validation
  return { habits, logHabit, stats };
}

// 2. View Component: HabitTrackerView.tsx
export function HabitTracker() {
  const { habits, logHabit, stats } = useHabitController();
  return <HabitList items={habits} onCheck={logHabit} stats={stats} />;
}
```

---

## 3. Atomic & Predictable Directory Hierarchy

Organize component trees predictably:
```text
src/
├── components/
│   ├── ui/               # Primitives (Button, Modal, Input, Badge, Tooltip)
│   ├── layout/           # Scaffolding (Header, BottomNav, Sidebar, Container)
│   ├── features/         # Domain organisms (HabitCard, KaizenWizard, AnalyticsChart)
├── hooks/                # Custom controller hooks (useHabitController, useTheme)
├── stores/               # State slices & Zustand stores
├── types/                # Domain models, strict TypeScript interfaces
└── utils/                # Pure helper functions (formatters, dates, math)
```

---

## 4. State Isolation & Store Optimization (Zustand / Redux)

- **Selective Subscriptions:** Never subscribe to the entire store object if only a single field is needed:
  ```tsx
  // ❌ Re-renders on any store update:
  const store = useHabitStore();

  // ✅ Selective re-render only when `activeTab` changes:
  const activeTab = useHabitStore((state) => state.activeTab);
  const setActiveTab = useHabitStore((state) => state.setActiveTab);
  ```
- **Action Decoupling:** Action functions in stores should be stable references that do not cause component re-renders.

---

## 5. Composition over Prop-Drilling

Instead of threading 10 props through 4 levels of children:
- Use **Component Composition** (`children` prop) or compound components:
  ```tsx
  <Card>
    <Card.Header title="Meditasi Pagi" icon={<Compass />} />
    <Card.Body>...</Card.Body>
    <Card.Footer actions={<Button>Selesai</Button>} />
  </Card>
  ```

---

## 6. TypeScript Interface Discipline

- Explicitly type all component props. Never use `any` or loose `Record<string, any>`.
- Use discriminating unions for conditional states (e.g. `status: 'idle' | 'loading' | 'success' | 'error'`).
- Export prop types alongside components: `export interface HabitCardProps { ... }`.

---

## 7. Architecture Verification Checklist

Before completing component code:
1. Is the visual markup cleanly decoupled from complex business calculations?
2. Are components under ~200 lines, delegating sub-elements to focused child components?
3. Are store selectors atomic, preventing accidental unnecessary re-renders?
4. Are prop types strictly typed with TypeScript interfaces?
5. Are UI primitives placed in a shared directory for reuse?
