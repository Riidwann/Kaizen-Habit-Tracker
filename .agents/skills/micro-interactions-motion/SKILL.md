---
name: micro-interactions-motion
description: >-
  Use this skill when designing or implementing animations, feedback states, tactile button
  responses, skeleton loading placeholders, modal transitions, and fluid 60fps micro-interactions
  that respect accessibility and reduced-motion preferences.
---

# Micro-Interactions & Fluid Motion

Micro-interactions are the subtle communicative feedback loops that make a digital product feel alive, tangible, and responsive to human touch. Motion must always explain cause-and-effect, never exist as superficial distraction.

---

## 1. The Core Purpose of UI Motion

- **Direct Feedback:** Confirm user action immediately (a habit checked off scales up and displays a crisp green tick).
- **Spatial Continuity:** Guide the user's eye so they understand where an element originated and where it went (e.g. a sheet sliding up from the bottom).
- **Perceived Performance:** Smooth skeleton shimmers and optimistic UI updates eliminate the feeling of latency.

---

## 2. The 60 FPS Performance Rule

- **Hardware Accelerated Properties Only:**
  - Animate **`transform`** (`translate`, `scale`, `rotate`) and **`opacity`**.
  - **Never** animate properties that trigger layout re-calculation or repaints: `height`, `width`, `margin`, `padding`, `top`, `left`, `right`, `bottom`.
- Use CSS `will-change` sparingly, only for complex persistent animations.
- Rely on Tailwind transitions: `transition-all duration-200 ease-out` or specific `transition-transform duration-150`.

---

## 3. Tactile Touch & Press Feedback

Buttons and interactive cards must feel physically responsive:
- **Active Scaling:** Apply subtle compression on press:
  ```tsx
  <button className="transition-all duration-150 active:scale-[0.97] hover:brightness-105">
    Simpan Perubahan
  </button>
  ```
- **Haptic / Visual Confirmation:**
  - When a user logs a habit, immediately fill the check circle with a swift spring-in icon:
  ```tsx
  <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
  ```

---

## 4. Easing Curves & Timing Standards

- **Durations:**
  - Micro-taps / Buttons: **100ms – 150ms**
  - Tooltips / Dropdowns / Popovers: **150ms – 200ms**
  - Modals / Drawers / Page transitions: **250ms – 300ms**
  - Anything slower than **400ms** feels sluggish and impedes productivity.
- **Easings:**
  - **Enter:** Decelerate rapidly (`ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
  - **Exit:** Accelerate out quickly (`ease-in`).
  - Never use `linear` for UI movement.

---

## 5. Skeleton Loading over Blank Spinners

- Avoid intrusive full-screen blocking spinners.
- Use pulsating skeleton placeholders that replicate the layout geometry:
  ```tsx
  <div className="animate-pulse space-y-3">
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
  </div>
  ```

---

## 6. Accessibility & Reduced Motion

- Always respect the user's operating system preferences for reduced motion:
  ```tsx
  <div className="transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none">
  ```
- In CSS:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 7. Verification Checklist

Before considering micro-interactions complete:
1. Do buttons and touch cards have tactile press feedback (`active:scale-[0.97]`)?
2. Are all animated properties restricted to `transform` and `opacity`?
3. Are animation durations under 350ms for snappy interaction?
4. Are loading states handled with smooth skeleton shimmers?
5. Does the application honor `prefers-reduced-motion`?
