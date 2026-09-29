---
name: responsive-adaptive-ux
description: >-
  Use this skill when designing or implementing responsive layouts, mobile-first interfaces,
  touch ergonomics (>= 44px tap targets), safe-area insets, bottom sheets/drawers,
  and dynamic viewport handling for mobile and desktop screens.
---

# Responsive & Adaptive UX: Mobile-First Ergonomics

A truly professional web application must feel indistinguishable from a native app on mobile while maintaining power-user density on desktop.

---

## 1. The Mobile-First Philosophy

- **Design from Smallest to Largest:** Write default CSS classes for 360px–390px mobile screens first, then progressively enhance with `sm:`, `md:`, and `lg:` breakpoints.
- **Never rely on desktop hover states:** Every interactive feature must be accessible via direct tap/touch without needing hover triggers.
- **Single-Column Fluidity:** Mobile layouts must flow vertically without horizontal scrollbars (`overflow-x-hidden` on main layouts).

---

## 2. Ergonomics & The Thumb Zone

- **Natural Reachability:** The bottom 30% of a mobile screen is the "easy thumb reach" zone. Place high-frequency actions (primary tabs, quick check-offs, search, floating action buttons) at the bottom.
- **Navigation Duality:**
  - **Mobile (< 640px):** Sticky bottom navigation bar with 3 to 5 key destinations, high visual clarity, and active tab highlights.
  - **Desktop (>= 640px):** Top navbar or left-hand collapsible sidebar with expanded metadata and secondary utility links.
- **Floating Bar Spacing:** Always pad page content with bottom clearance (`pb-24` or `pb-28`) so that floating bars or bottom navigation never obscure actionable list items or submit buttons.

---

## 3. Touch Target Architecture (44px Minimum)

- **Minimum Tap Size:** Every touchable element (buttons, icon toggles, checkboxes, tabs) must provide an interactive bounding box of at least **44 × 44 pixels** (WCAG 2.5.5 / Apple HIG standard).
- **Icon Buttons:** When an icon is visually 20px (`w-5 h-5`), enclose it in a `p-2.5` or `p-3` wrapper or specify `min-h-[44px] min-w-[44px] flex items-center justify-center` to ensure fat-finger accuracy.
- **Hit-Box Separation:** Maintain at least 8px to 12px of gap between adjacent interactive targets to prevent accidental mis-taps.

---

## 4. Viewport Stability & Virtual Keyboard Safety

- **Use Dynamic Viewport Units:** Never use plain `h-screen` or `100vh` on mobile, as mobile browser URL address bars cause sudden content shifts.
  - Use `h-[100dvh]` or `min-h-[100dvh]` (dynamic viewport height).
- **Form Modal Scrolling:** Modal sheets and dialogs must contain internal scroll constraints:
  ```tsx
  <div className="max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden">
    <header className="flex-shrink-0 p-4 border-b">...</header>
    <main className="flex-1 overflow-y-auto p-4 overscroll-contain">...</main>
    <footer className="flex-shrink-0 p-4 border-t">...</footer>
  </div>
  ```
- **Virtual Keyboard Resiliency:** Ensure form inputs are never hidden beneath the virtual keyboard.

---

## 5. Bottom Sheet / Drawer vs Desktop Dialog

- On mobile (< 640px), prefer bottom sheets sliding up from the screen bottom with rounded top corners (`rounded-t-2xl sm:rounded-2xl`).
- Provide an intuitive top drag-handle pill (`w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2`) to visually communicate sheet affordance.
- On desktop (>= 640px), center the dialog with an aesthetic backdrop blur (`backdrop-blur-sm bg-black/40`).

---

## 6. Safe Area Insets (Notches & Home Indicators)

- Always accommodate device notches and iPhone home bars:
  ```css
  padding-bottom: env(safe-area-inset-bottom, 16px);
  padding-top: env(safe-area-inset-top, 0px);
  ```
- In Tailwind:
  ```tsx
  <nav className="fixed bottom-0 inset-x-0 pb-[env(safe-area-inset-bottom)] ...">
  ```

---

## 7. Verification Checklist

Before considering responsive implementation complete:
1. Is there zero horizontal overflow at 360px viewport width?
2. Are all buttons and icons at least 44×44px in tap area?
3. Does bottom navigation clear the content behind it without overlapping?
4. Do modals and sheets scroll properly without getting clipped when forms open?
5. Is the layout intuitive with one hand in the bottom thumb zone?
