# Spesifikasi Desain: Pembersihan UI, Branding Konsep B, dan Optimasi Performa KaizenFlow

- **Tanggal**: 2026-10-06
- **Status**: Disetujui
- **Topik**: UI Decluttering, Grouping per Goal, Drawer Simplification, Button Lag Elimination, Concept B Branding, Animated Splash Screen

---

## 1. Latar Belakang & Masalah (Problem Statement)

Pengguna menyampaikan beberapa umpan balik penting terkait pengalaman antarmuka (*user experience*), estetika visual, dan performa aplikasi KaizenFlow:

1. **Halaman Utama (Sanctuary / Hari Ini) Terlalu Padat (*Cluttered*)**:
   - Terdapat teks panduan panjang dan tombol-tombol panduan di bagian atas yang menghabiskan ruang vertikal layar, terutama pada perangkat ponsel pintar.
   - Tindakan mikro (*micro-actions*) ditampilkan datar tanpa pengelompokan yang jelas, padahal pengguna dapat memiliki beberapa Goal (tujuan hidup) sekaligus. Tanpa pengelompokan, tindakan terasa sporadis dan memicu beban kognitif (*cognitive overload*).

2. **Panel Akses Cepat (Slide-Over Drawer To-Do & Jadwal Rutin) Terlalu Sesak**:
   - Formulir input pembuatan to-do dan jadwal rutin memanjang ke bawah dengan banyak kontrol sekaligus (prioritas, pemilih jam, penanda hari), sehingga memakan area drawer dan membuat daftar tugas yang ada terhimpit.

3. **Lag, Delay, dan Penurunan Frame Rate (FPS Drop) Saat Menekan Tombol/Checkbox**:
   - Terdapat jeda terasa (*perceptual delay*) dan animasi tersendat saat pengguna menekan tombol centang (toggle aksi) atau tombol aksi lainnya.
   - Diagnostik teknis menunjukkan bahwa prop `layout` pada Framer Motion di [MicroActionCard.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/modules/sanctuary/presentation/MicroActionCard.tsx) memicu *layout thrashing* sinkron (`getBoundingClientRect`) pada setiap pergantian status, ditambah pemanggilan audio chime yang berjalan di alur eksekusi utama.

4. **Splash Screen PWA Kaku & Logo Belum Diperbarui**:
   - Saat aplikasi diinstal atau dibuka sebagai PWA di layar utama HP, splash screen masih bawaan statis dan kaku.
   - Logo aplikasi masih menggunakan ikon ensō awal dan belum mengadopsi logo resmi terpilih: **Konsep B (*Tobi-Ishi K* - Zen Stepping Stones Monogram)** dari direktori `docs/branding`.

---

## 2. Sasaran Desain & Kriteria Keberhasilan (Success Criteria)

1. **Halaman Utama Minimalis & Terstruktur (*Zen Sanctuary*)**:
   - Teks panduan panjang dan tombol panduan berlebih dihilangkan dari halaman utama.
   - Aksi mikro harian dikelompokkan secara rapi dan elegan berdasarkan **Goal** induknya (*Purpose Alignment*), dengan tetap mempertahankan prinsip Kaizen 1% dan aturan 2-menit.
2. **Drawer Akses Cepat yang Lapang & Efisien**:
   - Form input to-do dan rutinitas disederhanakan menjadi 1-baris cepat (*single-line quick add*), sementara detail lanjutan (prioritas, jam, tanggal) tersembunyi secara default (*collapsible*).
3. **Respon Tombol Seketika (0-Delay, 60fps)**:
   - Prop `layout` pada kartu aksi dihilangkan, animasi disetel cepat (100–120ms) dengan akselerasi GPU, dan pemutaran audio dibuat non-blocking.
4. **Branding Resmi Konsep B & Splash Screen Animasi Zen**:
   - Ikon PWA (`icon-192.svg`, `icon-512.svg`), manifest, dan header aplikasi mengadopsi logo Konsep B (*Tobi-Ishi K*).
   - Dihadirkan *Animated Splash Screen* berdurasi ~1,4 detik dengan koreografi pembentukan batu pijakan zen yang memukau dan transisi halus ke halaman utama.
5. **Zero Regression**:
   - 100% tes yang ada (seluruh 51 test suites, 293 unit & integration tests) tetap lulus (*green*).

---

## 3. Rincian Solusi Desain & Arsitektur

### 3.1. Pembersihan & Pengelompokan Halaman Utama (Goal-Grouped Sanctuary)

1. **Pembersihan Elemen Clutter**:
   - Di [DailySanctuaryView.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/modules/sanctuary/presentation/DailySanctuaryView.tsx), hapus blok teks pengantar panjang dan tombol panduan yang memakan header view.
   - Header dibuat sangat bersih: Hari & Tanggal, sapaan hening, dan progress bar ringkas ("X dari Y Selesai").

2. **Pengelompokan Aksi Mikro Berdasarkan Goal**:
   - Entitas `MicroAction` sudah memiliki properti `goalId: string`.
   - `DailySanctuaryView` mengelompokkan `actions` menggunakan `useMemo` berdasarkan `goalId` yang terpetakan ke entitas `Goal` (mengambil judul Goal, kategori, dan ikon/warna kategori).
   - Tampilan setiap grup:
     - Header grup minimalis: Judul Goal dengan badge kategori yang halus.
     - Daftar tindakan mikro di bawah masing-masing Goal.
     - Aksi mikro tanpa tautan Goal spesifik dimasukkan ke dalam grup fallback *"Fokus Harian Lainnya"*.
   - **Kesesuaian Filosofi Kaizen**: Kaizen mendukung banyak aspek kehidupan yang ingin ditingkatkan (kesehatan, karier, keuangan, dll.), asalkan setiap target dipecah menjadi tindakan mikro yang *"too small to fail"* (1–2 menit). Pengelompokan ini menerapkan prinsip 5S Kaizen: *Seiri* (Ringkas) dan *Seiton* (Rapi/Teratur).

### 3.2. Penyederhanaan Panel Drawer Akses Cepat (To-Do & Rutinitas)

1. **Form Input 1-Baris Cepat (*Quick-Add Form*)**:
   - Di [TodoListPanel.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/modules/todo/presentation/TodoListPanel.tsx) dan [RoutineSchedulePanel.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/modules/routines/presentation/RoutineSchedulePanel.tsx):
   - Kolom teks judul langsung berdampingan dengan tombol Tambah `[ + ]`.
   - Tombol toggle *"Opsi Tambahan"* (ikon slider/chevron) untuk membuka/menutup konfigurasi tingkat lanjut (prioritas penting/mendesak, waktu pelaksanaan/jam, pemilihan hari berulang).
   - Secara default opsi tertutup, sehingga drawer langsung menyajikan daftar tugas dengan spasi lega (*breathing room*).

### 3.3. Arsitektur Penghapusan Lag & Frame-Drops (Performa Interaksi)

1. **Pembersihan Layout-Thrashing di [MicroActionCard.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/modules/sanctuary/presentation/MicroActionCard.tsx)**:
   - Hapus prop `layout` dari elemen `<motion.div>`. Prop ini memaksa browser membaca geometri bounding box berulang-ulang setiap kali state checkbox berubah.
   - Gunakan transisi CSS GPU ringan (`transform: scale(...)`, `opacity`) atau `motion.div` tanpa `layout`.
   - Durasi animasi diperpendek menjadi **100–120ms** dengan kurva `ease-out`.

2. **Audio Chime Non-Blocking**:
   - Di [WebAudioService.ts](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/shared/infrastructure/WebAudioService.ts) atau pemanggil `toggleActionCompletion`:
   - Pastikan pemanggilan audio `playSuccessChime()` dibungkus dalam `requestAnimationFrame` atau microtask asinkron sehingga tidak menahan alur render React checkbox.

### 3.4. Branding Konsep B: Monogram *Tobi-Ishi K* (Zen Stepping Stones)

1. **Filosofi Logo Konsep B**:
   - **Grounded Habit Spine (Tiang Disiplin):** Batang vertikal kiri yang kokoh.
   - **Upper Stepping Stone (45° Ke Atas):** Batu pijakan pertumbuhan 1% berkelanjutan.
   - **Lower Stepping Stone (45° Ke Bawah):** Batu pijakan fondasi konsistensi harian.
   - Ketiganya membentuk huruf **K** (*Kaizen*) dengan gaya batu pijakan taman zen Jepang (*Tobi-Ishi*).

2. **Penerapan Aset**:
   - **Header Aplikasi ([Header.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/components/layout/Header.tsx))**: Ganti `EnsoLogo` dengan `TobiIshiLogo` berbasis SVG vektor murni yang responsif terhadap dark/light mode.
   - **PWA Icons ([icon-192.svg](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/public/icons/icon-192.svg), [icon-512.svg](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/public/icons/icon-512.svg))**: Buat ikon berlatar zen elegan (`#18181B` / `#FDFBF7`) dengan safe-area padding 15% untuk maskable icon Android/iOS.
   - **Manifest PWA ([manifest.json](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/public/manifest.json))**:
     - `background_color`: `"#FDFBF7"`
     - `theme_color`: `"#121214"`

### 3.5. Komponen Animated Zen Splash Screen

1. **Komponen [SplashScreen.tsx](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/src/components/layout/SplashScreen.tsx)**:
   - Fullscreen container dengan latar `bg-sand-50 dark:bg-charcoal-950`.
   - Z-index tertinggi (`z-50`), fixed inset-0.
   - **Koreografi Animasi (~1,4 detik total)**:
     - `0.0s - 0.4s`: Tiang vertikal K turun dengan smooth spring.
     - `0.2s - 0.6s`: Batu atas meluncur diagonal ke atas-kanan dengan aksen emerald/sage lembut.
     - `0.4s - 0.7s`: Batu bawah mengunci posisi membentuk monogram K yang utuh.
     - `0.6s - 1.0s`: Teks "KaizenFlow" dan tagline "1% BETTER EVERY DAY" muncul memudar masuk (*fade-in*).
     - `0.8s - 1.2s`: Efek riak lingkaran zen (*ripple*) memancar dari logo.
     - `1.2s - 1.4s`: Layar splash memudar lembut (`opacity: 0`, `scale: 1.03`) mengungkap dashboard utama.
   - **User Experience**:
     - Status ditampilkan saat *initial mount* sesi aplikasi (`sessionStorage`).
     - Pengguna dapat mengetuk layar untuk *skip* animasi secara instan.
     - Menghormati pengaturan `prefers-reduced-motion`.

---

## 4. Diagram Alur & Hirarki Komponen

```
[ Root Layout / Page ]
       │
       ├─► [ Animated SplashScreen ] (Hanya saat startup / initial session mount)
       │          └─► Konsep B: Tobi-Ishi K Monogram + Ripple + Tagline
       │
       └─► [ App Shell ]
              ├─► [ Header (Memoized) ]
              │          └─► TobiIshiLogo (Konsep B Monogram) + Streak + Quick Actions
              │
              ├─► [ DailySanctuaryView ] (Clean & Minimalist)
              │          ├─► Minimalist Progress Header (No text clutter)
              │          │
              │          └─► [ GoalGroupSection: Goal 1 ]
              │          │          ├─► MicroActionCard (No layout-thrashing, GPU fast)
              │          │          └─► MicroActionCard
              │          │
              │          └─► [ GoalGroupSection: Goal 2 ]
              │          │          └─► MicroActionCard
              │          │
              │          └─► [ GoalGroupSection: Fokus Harian Lainnya ]
              │                     └─► MicroActionCard
              │
              └─► [ SlideOverDrawer ]
                         ├─► TodoListPanel (1-baris quick add + collapsible details)
                         └─► RoutineSchedulePanel (1-baris quick add + collapsible details)
```

---

## 5. Rencana Pengujian & Verifikasi (Test & Verification Plan)

1. **Unit Tests**:
   - `DailySanctuaryView.test.tsx`: Memverifikasi tindakan mikro terkelompok rapi per `goalId` dan header grup tampil dengan benar.
   - `MicroActionCard.test.tsx`: Memverifikasi interaksi toggle checkbox berjalan instan dan callback terpanggil tanpa error.
   - `TodoListPanel.test.tsx` & `RoutineSchedulePanel.test.tsx`: Memverifikasi input 1-baris cepat berhasil menambahkan data dan toggle opsi lanjutan bekerja normal.
   - `SplashScreen.test.tsx`: Memverifikasi splash screen merender monogram Konsep B dan melakukan transisi keluar/unmount setelah durasi yang ditentukan atau saat di-skip.
   - `Header.test.tsx`: Memverifikasi logo baru `TobiIshiLogo` ter-render dan kompatibilitas props tetap utuh.
2. **Integration Tests**:
   - `KaizenFlowApp.test.tsx`: Memastikan alur komprehensif mulai dari render awal, transisi splash, penambahan to-do, hingga penyelesaian tindakan harian tetap lulus 100%.
3. **Regression & Build Check**:
   - Menjalankan `npm run test` untuk memastikan seluruh 51+ test suites lolos.
   - Menjalankan `npx tsc --noEmit` untuk memastikan 0 kesalahan TypeScript.
   - Menjalankan `npm run build` untuk memvalidasi produksi build Next.js.
