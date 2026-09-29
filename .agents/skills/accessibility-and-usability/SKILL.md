---
name: accessibility-and-usability
description: >-
  Use this skill when auditing or implementing web accessibility (WCAG 2.1 AA), keyboard
  navigation (Tab, Enter, Escape), visible focus rings, ARIA landmarks, screen reader support
  (sr-only, aria-live), color contrast (>= 4.5:1), and empathetic form usability.
---

# Accessibility & Ergonomic Usability (WCAG 2.1 AA)

Accessibility is not a compliance checkbox; it is the foundation of high-craft engineering. An application that cannot be navigated by keyboard or understood by screen readers is incomplete.

---

## 1. Semantic HTML over "Div Soup"

Always reach for semantic HTML elements before generic `<div>` and `<span>`:
- **Document Landmarks:** `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. Every page should have exactly one `<main>` landmark.
- **Interactive Controls:** Use `<button>` for actions that trigger changes and `<a>` for links that navigate URLs.
  - Never put `onClick` on a `<div role="button">` when a native `<button type="button">` exists.
- **Lists:** Use `<ul>` / `<ol>` and `<li>` for repeated data items (e.g. habit lists, history rows).
- **Dialogs & Modals:** Use `<dialog>` or proper `role="dialog"` with `aria-modal="true"` and an `aria-labelledby` title.

---

## 2. Keyboard Navigation & Visible Focus Rings

- **Focus Visibility:** Never suppress focus outlines with `outline: none` without providing an explicit replacement.
  ```tsx
  <button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">
    ...
  </button>
  ```
- **Modal Trap & Escape Key:**
  - Pressing `Escape` must immediately close any open modal, dialog, or drawer.
  - When a modal opens, trap keyboard focus within the modal so users do not accidentally tab into background content.
  - When a modal closes, return focus to the trigger button that opened it.

---

## 3. Color Contrast Ratios (WCAG AA Compliance)

- **Normal Text (under 18pt / 24px):** Minimum contrast ratio of **4.5:1** against the background.
  - Light mode: use `text-slate-800` (`#1E293B`) or `text-slate-900` on white, not washed-out `text-slate-400`.
  - Dark mode: use `text-slate-100` (`#F1F5F9`) or `text-slate-200` on dark slate/zinc, not dim `text-slate-500`.
- **Large Text & Graphical Objects (UI Icons, Borders):** Minimum contrast ratio of **3:1**.
- **Never convey meaning through color alone:** If a habit is failed or overdue, supplement red color with an icon (e.g. `AlertCircle`) and explicit descriptive text.

---

## 4. Screen Readers & ARIA Labels

- **Icon-Only Buttons:** Every button without visible text must have an `aria-label` or visually hidden screen reader text:
  ```tsx
  <button
    onClick={toggleTheme}
    aria-label="Ganti mode tema tampilan"
    className="..."
  >
    <Moon className="w-5 h-5" aria-hidden="true" />
  </button>
  ```
- **Expandable Elements:** Use `aria-expanded={isOpen}` and `aria-controls="content-id"` on accordions and dropdowns.
- **Live Updates:** Use `aria-live="polite"` on status messages (like "Habit berhasil ditandai selesai") so screen readers announce changes without interrupting speech.
- **Hidden Text (`sr-only`):** Provide context for screen readers when visual layout is compact:
  ```tsx
  <span className="sr-only">Streak saat ini: </span>
  <span className="font-bold">5 Hari</span>
  ```

---

## 5. Empathetic Forms & Error Handling

- **Explicit Label Association:** Every input must be tied to a label via matching `id` and `htmlFor`:
  ```tsx
  <label htmlFor="habit-title" className="block text-sm font-medium">
    Nama Kebiasaan
  </label>
  <input
    id="habit-title"
    type="text"
    aria-describedby="habit-title-error"
    className="..."
  />
  ```
- **Clear Error Messaging:** Error states must explain *why* the input failed and *how* to correct it. Point directly to the field with `aria-invalid="true"`.

---

## 6. Verification Checklist

Before certifying frontend code as accessible:
1. Can the entire interface be navigated and operated using only the `Tab`, `Enter`, `Space`, and `Escape` keys?
2. Are focus rings clearly visible when tabbing through buttons and inputs?
3. Do all icon-only buttons possess descriptive `aria-label` attributes?
4. Do text colors achieve at least 4.5:1 contrast in both light and dark modes?
5. Do modals close upon pressing the `Escape` key?
