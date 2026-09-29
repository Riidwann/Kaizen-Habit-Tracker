---
name: frontend-design
description: >-
  Use this skill when designing or restructuring UI layouts, establishing visual hierarchy,
  choosing typography and color tokens, or crafting a distinctive, intentional aesthetic that
  avoids generic AI-generated design defaults and Unicode glyph substitutions.
---

# Frontend Design: Intentional & Production-Grade UI

Approach interface design as a lead designer crafting a memorable, cohesive, and intentional visual identity. Every element, font choice, padding unit, and color token must be a deliberate design choice, not a framework default or AI cliché.

---

## 1. Anti-Defaults & Forbidden Patterns

Reject the standard tropes of AI-generated design:
- **Never substitute emojis or Unicode glyphs for icons.** (e.g. `🎯 Habit`, `▣ Settings`, `🔥 Streak`). Always use a dedicated, scalable SVG icon set (such as `lucide-react`, `heroicons`, or custom SVGs) with consistent stroke widths (`strokeWidth={1.75}` or `2`) and bounding boxes.
- **No generic purple/pink gradient washes.** Avoid `#8B5CF6 → #EC4899` or `#6366F1 → #A855F7` cards unless explicitly demanded by an Aurora Maximalist brief.
- **No uniform SaaS card kits.** Do not slice every piece of data into identical rounded rectangles with `shadow-sm` and `border border-slate-200`. Vary density, surface depth, and spatial grouping.
- **No filler labels or pseudo-tech badges.** Avoid gratuitous mono-caps kickers like `// TELEMETRY ACTIVE` or `OPERATOR LEVEL 1` on ordinary apps. If removing a string loses zero information, it is filler.
- **No template chrome.** Avoid appending `→` to every link, prepending `•` or `·` to arbitrary meta items, or wrapping every heading with uppercase tracking labels.

---

## 2. The Eight Aesthetic Anchors

Select an anchor suitable for the product domain. Commit to its token rules without hybrid drift:

### 1. Swiss (Clean, Modern, Editorial, Productive)
- **Surfaces:** Pure White `#FFFFFF` or Crisp Neutral `#F8FAFC` / `#0F172A`.
- **Typography:** Sans-serif (Inter, Helvetica Neue, Plus Jakarta Sans, Geist). Single family or maximum two weights.
- **Accent:** One deliberate punch (e.g., International Orange `#EA580C`, Pure Crimson `#DC2626`, or Cobalt `#2563EB`).
- **Structure:** Clear grid alignment, 1px subtle hairline dividers (`border-slate-100` / `border-slate-800`), asymmetrical balance, high whitespace ratio.

### 2. Industrial / Technical (Dev Tools, Analytics, Precision Trackers)
- **Surfaces:** Deep Zinc `#09090B` or Pitch `#000000`, slate contrast panels `#18181B`.
- **Typography:** Monospace (JetBrains Mono, IBM Plex Mono, Geist Mono) for data, stats, and headers; crisp neutral sans for body.
- **Signal Color:** High-contrast semantic indicators (Emerald `#10B981`, Amber `#F59E0B`, Crimson `#EF4444`).
- **Structure:** Flat borders (`1px solid #27272A`), tabular numerals (`font-variant-numeric: tabular-nums`), zero blur shadows.

### 3. Brutalist / Neo-Brutalist (Bold, High-Energy, Youth, Direct)
- **Surfaces:** High contrast primaries or hard black/white surfaces.
- **Shadows:** Hard offset, zero blur (`box-shadow: 4px 4px 0px #000000`).
- **Borders:** Thick dark outlines (`border-2 border-black` or `border-zinc-900`).
- **Controls:** Direct, tactile buttons with snappy click depth (`active:translate-x-[2px] active:translate-y-[2px]`).

### 4. Organic / Mindful (Wellness, Habit Tracking, Calming, Kaizen)
- **Surfaces:** Calming earth tones and soft neutrals (Emerald/Sage `#064E3B`, Forest `#065F46`, Stone `#FAFAF9`, Warm Sand `#F5F5F4`).
- **Typography:** Warm humanist sans (Plus Jakarta Sans, Epilogue) or refined editorial serif pairings.
- **Structure:** Soft radii (`rounded-2xl`, `rounded-3xl`), gentle border contrast (`border-emerald-500/10`), breathing whitespace.
- **Tone:** Encouraging, friction-free, non-punitive.

### 5. Aurora Maximalism (Creative, Entertainment, Immersive Web3/AI)
- **Surfaces:** Deep dark backdrop with radial gradient lighting effects and glowing borders (`backdrop-blur-md`, `border-white/10`).

### 6. Retro-Futuristic (Gaming, Synthwave, Cyberpunk)
- **Surfaces:** Pitch black with phosphor green or cyan/amber neon lines and CRT scanline hints.

### 7. Lo-Fi / Editorial (Publishing, Notebook, Research, Zine)
- **Surfaces:** Textured paper tones, intentional slight rotations, mono label tags, minimal styling.

### 8. Enterprise Minimalist (Fintech, Healthcare, Mission Critical)
- **Surfaces:** Neutral slate palettes, crisp data density, accessible contrast, quiet accents.

---

## 3. The 60-30-10 Color Rule & Surface Hierarchy

- **60% Dominant Base:** Background canvas and primary reading surface (`bg-white` / `bg-slate-900` or `bg-stone-50` / `bg-zinc-950`).
- **30% Structural Secondary:** Cards, navigation, sidebars, modal surfaces, table headers (`bg-slate-50` / `bg-slate-800/50`).
- **10% Intentional Accent:** Call-to-action buttons, active tabs, streak flames, progress fills (`bg-emerald-600`, `text-emerald-500`). Never dilute the accent across 40% of the screen.

---

## 4. Typography Scale & Readability Rules

- Use a consistent type scale:
  - Display / Hero: `text-3xl font-extrabold tracking-tight` (30–36px)
  - Section Header: `text-xl font-bold tracking-tight` (20–24px)
  - Subheader / Card Title: `text-base font-semibold` (16–18px)
  - Body Text: `text-sm font-normal text-slate-600 dark:text-slate-300` (14px, line-height 1.5)
  - Caption / Microcopy: `text-xs font-medium text-slate-400 dark:text-slate-500` (12px)
- **Never capitalize all body text or labels.** Avoid ALL-CAPS except for intentional 2-3 letter acronyms (e.g., `API`, `USD`, `ID`).
- Keep line lengths under 75 characters for optimal scanning speed.

---

## 5. Microcopy & Content Discipline

- **Real Contextual Copy:** Replace placeholder words like "Item 1" or "Lorem Ipsum" with authentic domain language (e.g., "Membaca 10 Menit", "1% Better Every Day").
- **Action-Oriented CTAs:** Use clear verbs that state what happens: "Simpan Kebiasaan" instead of "Submit", "Mulai Hari Ini" instead of "Click Here".
- **Constructive Empty States:** Never leave a screen blank. Every empty state must have:
  1. A clear icon illustrating the status.
  2. A headline explaining what is missing.
  3. A 1-sentence tip explaining why it matters.
  4. An action button to create or start immediately.

---

## 6. Pre-Implementation Review Checklist

Before finishing UI components, check:
1. Are real SVG icons used instead of emojis or Unicode glyphs?
2. Is the color palette anchored to a single coherent theme?
3. Does the layout have breathing room without crowded borders?
4. Are interactive elements visually distinct from static text?
5. Is the copy respectful, clear, and native to the user's language?
