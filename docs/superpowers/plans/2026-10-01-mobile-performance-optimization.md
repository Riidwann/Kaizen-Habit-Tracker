# Optimasi Performa Mobile (HP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengoptimalkan performa Kaizen APP saat diakses di perangkat mobile (HP) dengan memangkas ukuran first-load JS bundle, mengeliminasi re-render waterfall di tingkat root, dan mempercepat responsivitas sentuhan tombol melalui akselerasi GPU CSS.

**Architecture:** Melakukan code-splitting dinamis menggunakan `next/dynamic` pada seluruh modal dan tab sekunder, mengganti animasi runtime JS pada `Button.tsx` dengan CSS GPU hardware-accelerated, mengoptimalkan konfigurasi bundler Next.js (`optimizePackageImports`), serta menstabilkan re-render komponen shell melalui `React.memo` dan `useCallback`.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library.

**Spec:** [docs/superpowers/specs/2026-10-01-mobile-performance-optimization-design.md](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-10-01-mobile-performance-optimization-design.md)

## Global Constraints

- Semua 51 test suites (288 tests) yang ada di `tests/` harus tetap lulus 100% tanpa regresi.
- Seluruh antarmuka props publik komponen UI (khususnya `ButtonProps`, `HeaderProps`, `TabNavigationProps`) harus 100% backward compatible.
- Area sentuh (touch targets) tombol, checkbox, dan tab bar tetap memenuhi standar minimal 44x44px.
- Menghormati pengaturan aksesibilitas `prefers-reduced-motion` untuk menghemat daya dan mencegah lag pada ponsel berspesifikasi rendah.

---

### Task 1: Optimasi Konfigurasi Next.js & Pembersihan Dependensi

**Files:**
- Modify: `next.config.mjs:1-7`
- Modify: `package.json:14-38`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Consumes: Next.js bundler configuration options.
- Produces: Optimized package import tree-shaking for `lucide-react` and cleaner dependency footprint.

- [ ] **Step 1: Write test verifying package configuration / imports**

Verifikasi `tests/unit/env.test.ts` untuk memastikan dependensi dan lingkungan Next.js terkonfigurasi dengan benar:

```typescript
// tests/unit/env.test.ts
import { describe, it, expect } from "vitest";
import packageJson from "../../package.json";

describe("Environment & Package Configuration", () => {
  it("should not contain unused canvas-confetti dependency", () => {
    const deps = (packageJson as any).dependencies || {};
    const devDeps = (packageJson as any).devDependencies || {};
    expect(deps["canvas-confetti"]).toBeUndefined();
    expect(devDeps["@types/canvas-confetti"]).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/env.test.ts`
Expected: FAIL karena `canvas-confetti` masih ada di `package.json`.

- [ ] **Step 3: Update `package.json` and `next.config.mjs`**

Hapus `canvas-confetti` dan `@types/canvas-confetti` dari `package.json`:
```json
{
  "name": "kaizen-habit-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:host": "next dev -H 0.0.0.0",
    "build": "next build",
    "start": "next start",
    "start:host": "next start -H 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.441.0",
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@types/node": "^20.16.5",
    "@types/react": "^18.3.8",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.6.2",
    "vitest": "^2.1.1"
  }
}
```

Perbarui `next.config.mjs` untuk mengaktifkan `experimental.optimizePackageImports`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.mjs tests/unit/env.test.ts
git commit -m "perf(config): enable lucide tree-shaking and remove unused canvas-confetti"
```

---

### Task 2: Refaktor Button ke Native HTML dengan Akselerasi GPU CSS

**Files:**
- Modify: `src/shared/presentation/Button.tsx:1-91`
- Test: `tests/shared/ZenUIKit.test.tsx`

**Interfaces:**
- Consumes: React standard `ButtonHTMLAttributes<HTMLButtonElement>`.
- Produces: Fast, zero-JS-loop touch response button supporting all existing variants and icons.

- [ ] **Step 1: Write test verifying native button and GPU transform classes**

Perbarui `tests/shared/ZenUIKit.test.tsx`:
```typescript
it("applies GPU-accelerated active transform classes without framer-motion overhead", () => {
  render(<Button variant="primary">Kirim</Button>);
  const button = screen.getByRole("button", { name: /kirim/i });
  expect(button.className).toContain("active:scale-[0.98]");
  expect(button.className).toContain("transition-transform");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/shared/ZenUIKit.test.tsx`
Expected: FAIL karena `Button.tsx` masih menggunakan `motion.button` tanpa kelas `active:scale-[0.98]`.

- [ ] **Step 3: Implement minimal native button in `src/shared/presentation/Button.tsx`**

Ganti isi `src/shared/presentation/Button.tsx`:
```tsx
import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "emergency" | "danger" | "sage";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 shadow-sm focus-visible:ring-sage-500",
  sage:
    "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-800 shadow-sm focus-visible:ring-sage-500",
  secondary:
    "bg-sand-200 text-charcoal-800 hover:bg-sand-300 dark:bg-charcoal-800 dark:text-sand-100 dark:hover:bg-charcoal-700 shadow-xs focus-visible:ring-sand-400",
  outline:
    "border border-sand-300 dark:border-charcoal-700 bg-transparent text-charcoal-800 dark:text-sand-100 hover:bg-sand-100/60 dark:hover:bg-charcoal-800/60 focus-visible:ring-sage-500",
  ghost:
    "bg-transparent text-charcoal-700 dark:text-sand-200 hover:bg-sand-100/80 dark:hover:bg-charcoal-800/80 focus-visible:ring-sand-400",
  emergency:
    "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-sm focus-visible:ring-amber-500",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]",
  md: "px-4 py-2 text-sm rounded-xl gap-2 min-h-[44px]",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5 min-h-[48px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-100 ease-out select-none",
          "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/shared/ZenUIKit.test.tsx`
Expected: All 12 tests in `ZenUIKit.test.tsx` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/presentation/Button.tsx tests/shared/ZenUIKit.test.tsx
git commit -m "perf(ui): replace framer-motion button with GPU-accelerated native CSS button"
```

---

### Task 3: Memoization Komponen Shell (`Header` dan `TabNavigation`)

**Files:**
- Modify: `src/components/layout/Header.tsx:1-224`
- Modify: `src/components/layout/TabNavigation.tsx:1-85`
- Test: `tests/components/layout/Header.test.tsx`
- Test: `tests/components/layout/TabNavigation.test.tsx`

**Interfaces:**
- Consumes: HeaderProps and TabNavigationProps.
- Produces: Memoized `Header` and `TabNavigation` preventing unnecessary re-renders when parent states change.

- [ ] **Step 1: Write test verifying Header and TabNavigation render stably with React.memo**

Periksa `tests/components/layout/Header.test.tsx` dan `tests/components/layout/TabNavigation.test.tsx` untuk memastikan props dan event handler berjalan normal.

- [ ] **Step 2: Run test to verify existing tests pass**

Run: `npm run test -- tests/components/layout/Header.test.tsx tests/components/layout/TabNavigation.test.tsx`
Expected: PASS

- [ ] **Step 3: Wrap `Header` and `TabNavigation` with `React.memo`**

Di `src/components/layout/Header.tsx`:
```tsx
export const Header: React.FC<HeaderProps> = React.memo(({
  // existing props
  ...
}) => {
  // existing implementation
});
Header.displayName = "Header";
```

Di `src/components/layout/TabNavigation.tsx`:
```tsx
export const TabNavigation: React.FC<TabNavigationProps> = React.memo(({
  activeTab,
  onTabChange,
  className,
}) => {
  // existing implementation
});
TabNavigation.displayName = "TabNavigation";
```

- [ ] **Step 4: Run tests to verify all tests still pass**

Run: `npm run test -- tests/components/layout/Header.test.tsx tests/components/layout/TabNavigation.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/TabNavigation.tsx
git commit -m "perf(layout): wrap Header and TabNavigation in React.memo to prevent unnecessary re-renders"
```

---

### Task 4: Dynamic Code-Splitting untuk Modals & Tampilan Tab Non-Default

**Files:**
- Modify: `src/app/page.tsx:1-399`
- Test: `tests/integration/KaizenFlowApp.test.tsx`

**Interfaces:**
- Consumes: `next/dynamic` from Next.js, existing module controllers and views.
- Produces: Slim initial page bundle where `GoalForgeWizard`, `DataBackupModal`, `KaizenGuideModal`, `HanseiModal`, `SlideOverDrawer`, `GoalManagerView`, and `CompoundVisualizerView` are loaded on-demand.

- [ ] **Step 1: Review integration test requirements**

Cek `tests/integration/KaizenFlowApp.test.tsx` untuk memastikan tes integrasi mencakup pembukaan modal panduan, hansei, backup, dan tab target/kemajuan.
Perhatikan: Dalam environment tes Vitest (JSDOM), dynamic imports Next.js harus tetap dapat di-render tanpa mematahkan asynchronous `findByRole` / `findByText`.

- [ ] **Step 2: Run integration tests before modifications**

Run: `npm run test -- tests/integration/KaizenFlowApp.test.tsx`
Expected: PASS (7 tests pass)

- [ ] **Step 3: Implement dynamic imports and callback stabilization in `src/app/page.tsx`**

Perbarui `src/app/page.tsx`:
Gunakan `dynamic` dari `next/dynamic` dengan wrapper ringan:
```tsx
import dynamic from "next/dynamic";

// Dynamically split modals (loaded on demand)
const GoalForgeWizard = dynamic(
  () => import("@/modules/goals").then((mod) => mod.GoalForgeWizard),
  { ssr: false }
);
const HanseiModal = dynamic(
  () => import("@/modules/reflection").then((mod) => mod.HanseiModal),
  { ssr: false }
);
const DataBackupModal = dynamic(
  () => import("@/modules/backup").then((mod) => mod.DataBackupModal),
  { ssr: false }
);
const KaizenGuideModal = dynamic(
  () => import("@/components/layout/KaizenGuideModal").then((mod) => mod.KaizenGuideModal),
  { ssr: false }
);
const SlideOverDrawer = dynamic(
  () => import("@/components/layout/SlideOverDrawer").then((mod) => mod.SlideOverDrawer),
  { ssr: false }
);
const TodoListPanel = dynamic(
  () => import("@/modules/todo").then((mod) => mod.TodoListPanel),
  { ssr: false }
);
const RoutineSchedulePanel = dynamic(
  () => import("@/modules/routines").then((mod) => mod.RoutineSchedulePanel),
  { ssr: false }
);

// Dynamically split secondary tab views
const GoalManagerView = dynamic(
  () => import("@/modules/goals").then((mod) => mod.GoalManagerView),
  {
    loading: () => (
      <div className="py-12 text-center text-charcoal-400 dark:text-sand-500 animate-pulse text-sm">
        Memuat target Kaizen...
      </div>
    ),
    ssr: false,
  }
);
const CompoundVisualizerView = dynamic(
  () => import("@/modules/reflection").then((mod) => mod.CompoundVisualizerView),
  {
    loading: () => (
      <div className="py-12 text-center text-charcoal-400 dark:text-sand-500 animate-pulse text-sm">
        Memuat visualisasi kemajuan...
      </div>
    ),
    ssr: false,
  }
);
```

Stabilkan semua event handler dengan `useCallback` agar tidak membuat instans baru saat state lokal berubah:
- `handleOpenHansei`
- `handleOpenBackup`
- `handleOpenGuide`
- `handleOpenTodo`
- `handleOpenRoutine`
- `handleCloseDrawer`

- [ ] **Step 4: Run integration tests to verify dynamic loading works seamlessly**

Run: `npm run test -- tests/integration/KaizenFlowApp.test.tsx`
Expected: PASS (All 7 integration tests pass)

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "perf(page): implement dynamic code-splitting for modals, drawer, and secondary tabs"
```

---

### Task 5: Validasi Komprehensif Seluruh Test Suite & Production Build

**Files:**
- Test: All 51 test files
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`

**Interfaces:**
- Consumes: Entire application codebase.
- Produces: Production-ready bundle verification, zero TypeScript errors, 100% green tests.

- [ ] **Step 1: Run complete test suite**

Run: `npm run test`
Expected: All 51 test files and 288+ tests PASS.

- [ ] **Step 2: Run TypeScript typechecker**

Run: `npx tsc --noEmit`
Expected: Exits with code 0 (zero errors).

- [ ] **Step 3: Run production build and analyze bundle output**

Run: `npm run build`
Expected:
- Build succeeds.
- Output log shows separate split chunks for modals and dynamically imported tab views.
- First Load JS shared by all chunks is optimized.

- [ ] **Step 4: Final commit & tag if needed**

```bash
git add -A
git commit -m "perf: complete mobile performance optimization across bundle, UI, and re-renders"
```
