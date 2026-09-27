# Task 1 Brief: Project Scaffolding & Setup (DDD Modular Monolith)

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `tests/setup.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Consumes: Node.js & npm packages.
- Produces: Working Next.js + Tailwind (Zen Japandi color tokens) + Vitest environment with path aliases `@/shared/*`, `@/modules/*`, and `@/*`.

### Step-by-Step Instructions:

1. **Create `package.json`**:
```json
{
  "name": "kaizen-habit-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.441.0",
    "framer-motion": "^11.5.4",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "canvas-confetti": "^1.9.3"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "@types/node": "^20.16.5",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/canvas-confetti": "^1.9.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.45",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.1",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "jsdom": "^25.0.0"
  }
}
```

2. **Install dependencies**:
Run `npm install` in PowerShell.

3. **Create `tsconfig.json`**:
Configure standard Next.js TypeScript config with path aliases:
`"@/*": ["./src/*"]`, `"@/shared/*": ["./src/shared/*"]`, `"@/modules/*": ["./src/modules/*"]`.

4. **Create `tailwind.config.ts`**:
Include content glob `["./src/**/*.{js,ts,jsx,tsx,mdx}"]`.
Extend theme with Zen Japandi color tokens:
- `sand`: `{ 50: '#FDFBF7', 100: '#F7F4EC', 200: '#EFE9DC', 300: '#E2D8C3', 400: '#C8B896', 500: '#AC9A73', 900: '#2A241A' }`
- `sage`: `{ 50: '#F2F7F4', 100: '#E2EFE7', 400: '#68B38A', 500: '#10B981', 600: '#059669', 700: '#047857' }`
- `amber`: `{ 500: '#F59E0B', 600: '#D97706' }`
- `stone`: Tailwind default stone colors.

5. **Create `postcss.config.mjs`**:
Plugins: `tailwindcss: {}`, `autoprefixer: {}`.

6. **Create `next.config.mjs`**:
Standard Next.js config (`export default {}`).

7. **Create `vitest.config.ts` & `tests/setup.ts`**:
- `vitest.config.ts`: environment `'jsdom'`, setupFiles `'./tests/setup.ts'`, path alias `@/` -> `./src/`.
- `tests/setup.ts`: import `@testing-library/jest-dom/vitest`.

8. **Create `src/app/globals.css` and `src/app/layout.tsx`**:
- `src/app/globals.css`: Tailwind directives and smooth font styling.
- `src/app/layout.tsx`: HTML shell with clean font class and body.

9. **Create and Run `tests/unit/env.test.ts`**:
Write a test to verify Vitest + jsdom + React testing library works properly.
Run `npx vitest run tests/unit/env.test.ts`.

10. **Commit**:
`git add .` and `git commit -m "chore: scaffold project with nextjs, tailwind, ddd path aliases, and vitest"`.
