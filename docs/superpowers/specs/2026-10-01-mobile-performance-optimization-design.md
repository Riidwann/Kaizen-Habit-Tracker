# Spesifikasi Desain: Optimasi Performa Mobile (HP) Kaizen APP

- **Tanggal**: 2026-10-01
- **Status**: Disetujui
- **Topik**: Mobile Performance, Bundle Splitting, State Re-render Isolation, GPU Touch Interaction

---

## 1. Latar Belakang & Masalah (Problem Statement)

Ketika Kaizen APP diakses melalui perangkat ponsel pintar (HP/mobile browser), aplikasi terasa lambat dan berat (*sluggish*). Berdasarkan audit dan diagnostik teknis, terdapat 3 penyebab utama:

1. **Initial Bundle Monolitik pada Root (`page.tsx`)**:
   - `HomePage` mengimpor secara langsung (*eager import*) seluruh tampilan tab (`GoalManagerView`, `CompoundVisualizerView`, `DailySanctuaryView`), semua modal besar (`GoalForgeWizard`, `DataBackupModal`, `KaizenGuideModal`, `HanseiModal`), dan drawer slide-over (`SlideOverDrawer`).
   - Akibatnya, browser di ponsel harus mengunduh, mengekstrak, dan mem-parsing seluruh JavaScript tersebut sebelum First Contentful Paint (FCP) dan Time to Interactive (TTI) tercapai.
   - Pustaka icon `lucide-react` dimuat tanpa optimasi pohon impor (*tree-shaking* mendalam).

2. **Re-render Waterfall Akibat 7 Controller di Tingkat Root**:
   - `HomePage` menginisialisasi 7 custom hook controller sekaligus:
     - `useGoalsController`
     - `useSanctuaryController`
     - `useReflectionController`
     - `useBackupController`
     - `useTodoController`
     - `useRoutineController`
     - `useRewardController`
   - Setiap kali terjadi pembaruan state lokal (misalnya hitungan mundur detik pada timer `sanctuaryController`, centang item to-do, atau pergantian streak), seluruh fungsi `HomePage` dieksekusi ulang. Hal ini memicu re-render pada seluruh pohon komponen anak (`Header`, `TabNavigation`, semua modal, dan tampilan tab yang tidak aktif), membebani CPU ponsel dan menyebabkan drop FPS.

3. **Overhead Animasi JS Main-Thread pada Komponen Dasar (`Button.tsx`)**:
   - Komponen dasar [Button.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/shared/presentation/Button.tsx) menggunakan Framer Motion `motion.button` dengan kalkulasi JavaScript per sentuhan (`whileTap={{ scale: 0.98 }}`, `whileHover={{ scale: 1.01 }}`).
   - Pada layar sentuh HP (*touchscreen*), event `whileHover` tidak relevan dan menempelkan listener yang tidak perlu pada main-thread. Hal ini menimbulkan latensi perseptual (*touch delay*) saat tombol diklik.

---

## 2. Sasaran Desain & Kriteria Keberhasilan (Success Criteria)

1. **Pengurangan First-Load JS Bundle**:
   - Chunk JavaScript halaman utama berkurang signifikan melalui pemisahan kode (*code-splitting*) menggunakan `next/dynamic`.
   - Modals dan tab non-aktif hanya diunduh saat dibutuhkan (*on-demand*).
2. **Isolasi Re-render State**:
   - Update pada satu modul (seperti timer fokus atau aksi to-do) tidak me-render ulang `Header`, `TabNavigation`, atau modul lainnya.
3. **Respon Sentuh Instan (60-120fps)**:
   - Komponen tombol merespons interaksi sentuh secara instan via hardware acceleration (CSS transform GPU).
4. **Zero Regression**:
   - 100% tes yang ada (51 files, 288 tests) tetap lulus (*green*).
   - Antarmuka visual Zen Japandi, fungsionalitas DDD, dan integrasi EventBus tetap terjaga utuh.

---

## 3. Rincian Solusi Teknis (Architectural Design)

### 3.1. Optimasi Konfigurasi & Dependensi

1. **`next.config.mjs`**:
   - Mengaktifkan `experimental.optimizePackageImports: ['lucide-react']`. Pengaturan ini membuat bundler Next.js hanya mengemas ikon yang digunakan secara spesifik alih-alih indeks modul Lucide.
2. **Pembersihan Dependensi**:
   - Menghapus dependensi tak terpakai `canvas-confetti` dan `@types/canvas-confetti` dari `package.json` yang memakan ruang bundle dan node_modules.

### 3.2. Code-Splitting & Dynamic Imports

1. **Modals & Drawers On-Demand**:
   Modals yang jarang dibuka saat inisialisasi awal diubah menjadi dynamic imports dengan opsi `ssr: false`:
   - `GoalForgeWizard`
   - `DataBackupModal`
   - `KaizenGuideModal`
   - `HanseiModal`
   - `SlideOverDrawer` (beserta `TodoListPanel` dan `RoutineSchedulePanel`)
2. **Lazy Tab Views**:
   - Tab default `sanctuary` dimuat segera.
   - Tab `goals` (`GoalManagerView`) dan `reflection` (`CompoundVisualizerView`) dimuat secara dinamis saat dipilih oleh pengguna, dilengkapi komponen fallback skeleton/spinner Zen yang minimalis.

### 3.3. Isolasi State & Struktur Kontainer Tab

1. **Pemisahan Kontainer Tab**:
   - `SanctuaryTabContainer`: Mengelola siklus hidup `useSanctuaryController` dan `useRewardController`.
   - `GoalsTabContainer`: Mengelola siklus hidup `useGoalsController`.
   - `ReflectionTabContainer`: Mengelola siklus hidup `useReflectionController`.
2. **Memoization Komponen Persisten**:
   - [Header.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/components/layout/Header.tsx) dan [TabNavigation.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/components/layout/TabNavigation.tsx) dibungkus menggunakan `React.memo`.
   - Handler callback yang diteruskan dari root dibungkus dengan `useCallback` agar referensi fungsi stabil dan tidak memicu re-render yang tidak diinginkan.
3. **EventBus Coordinator yang Efisien**:
   - Event sinkronisasi global (`GoalCreated`, `GoalUpdated`, `BackupRestored`, `TodoCompleted`) tetap aktif untuk menjaga konsistensi data antar modul, namun referensi controller diakses via ref stabil (`useRef`) agar tidak merusak memoization.

### 3.4. Refaktor Komponen Tombol ke CSS GPU Hardware-Accelerated

1. **Implementasi [Button.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/shared/presentation/Button.tsx)**:
   - Mengganti `motion.button` dengan elemen HTML `<button>` standar.
   - Menggunakan kelas CSS akselerasi GPU: `active:scale-[0.98] transition-transform duration-100 ease-out`.
   - Menghapus ketergantungan `framer-motion` di dalam `Button.tsx`.
   - Mempertahankan seluruh signature props: `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, `disabled`, `className`, dan `ref`.
2. **Dukungan Aksesibilitas & Prefers-Reduced-Motion**:
   - Memastikan transisi menghormati prefers-reduced-motion melalui Tailwind utilities (`motion-reduce:transition-none motion-reduce:transform-none`).
   - Memastikan target sentuh tetap minimal 44x44px sesuai standar ergonomi layar sentuh mobile.

---

## 4. Alur Data & Komponen (Component Data Flow)

```
[ HomePage (Root Shell - Ultra Lean) ]
  ├── Header (React.memo)
  ├── TabNavigation (React.memo)
  ├── Main Content Boundary
  │     ├── Tab 'sanctuary' -> DailySanctuaryView & SelfRewardBanner (Sanctuary Scope)
  │     ├── Tab 'goals'     -> Dynamic GoalManagerView (Loaded on selection)
  │     └── Tab 'reflection'-> Dynamic CompoundVisualizerView (Loaded on selection)
  ├── Quick-Access Mobile Pill (44px target)
  └── Dynamic Modals / Drawer Shell (Loaded on open)
        ├── Dynamic SlideOverDrawer -> TodoListPanel & RoutineSchedulePanel
        ├── Dynamic GoalForgeWizard
        ├── Dynamic HanseiModal
        ├── Dynamic DataBackupModal
        └── Dynamic KaizenGuideModal
```

---

## 5. Rencana Pengujian & Validasi (Verification Plan)

1. **Automated Unit & Integration Tests (Vitest)**:
   - Menjalankan `npm run test` untuk memastikan semua 51 test suite (288 tests) lulus tanpa ada error atau kegagalan.
   - Menguji integrasi alur aplikasi pada [KaizenFlowApp.test.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/tests/integration/KaizenFlowApp.test.tsx).
2. **Next.js Production Build Validation**:
   - Menjalankan `npm run build` untuk memverifikasi bahwa:
     - Tidak ada kegagalan kompilasi.
     - Terbentuk chunk terpisah untuk modal dan modul dinamis.
     - First-load JS size berkurang secara nyata.
3. **Type Safety & Lint**:
   - Menjalankan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan tipe TypeScript.
