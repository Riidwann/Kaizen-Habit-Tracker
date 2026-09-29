# Spesifikasi Desain: KaizenFlow Zen Minimalist UI & PWA

**Tanggal:** 29 September 2026  
**Status:** Disetujui (Approved)  
**Tujuan:** Mentransformasi KaizenFlow menjadi aplikasi habit tracker yang sangat tenang, bersih (*Zen Minimalist*), bebas istilah membingungkan, memangkas kepadatan tombol hingga 70%, serta mengaktifkan kemampuan PWA (*Progressive Web App*) agar dapat dipasang di layar HP dan berfungsi 100% offline.

---

## 1. Latar Belakang & Masalah Pengguna

Berdasarkan evaluasi penggunaan nyata:
1. **Kepadatan Visual (Terlalu Ramai):** Halaman utama menampilkan terlalu banyak tombol yang bersaing menarik perhatian (tombol di header, tombol kartu habit, banner awal).
2. **Istilah Membingungkan (Jargon Asing):** Penggunaan istilah seperti *Sanctuary*, *Goal Forge & Decomposition*, *1% Compound*, *Hansei*, *Emergency Scale Down*, dan *Emotional Anchor* membuat pengguna awam merasa asing dan tidak memahami alur aplikasi.
3. **Kebutuhan Akses Mobile (PWA):** Sebagai habit tracker harian, aplikasi harus mudah diakses langsung dari layar beranda HP (*home screen*) tanpa bilah URL browser dan dapat digunakan saat offline.

---

## 2. Kamus Istilah Baru (100% Bahasa Indonesia Alami)

| Istilah Lama (Teknis / Asing) | Istilah Baru (Alami) | Penjelasan Bagi Pengguna |
|---|---|---|
| **Sanctuary (Fokus Harian)** | **Hari Ini** | Daftar kebiasaan yang perlu dikerjakan pada hari ini. |
| **Goal Forge (Pohon Sasaran)** | **Target** | Rencana tujuan besar yang dipecah menjadi langkah-langkah kecil. |
| **1% Compound (Pertumbuhan)** | **Kemajuan** | Grafik konsistensi, riwayat streak, dan evaluasi malam. |
| **Hansei (Refleksi Malam)** | **Refleksi Malam** | Catatan singkat sebelum tidur (1 kemenangan kecil & 1 penyesuaian esok). |
| **Emergency Scale-Down** | **Peringan Tugas (2 Menit)** | Pilihan untuk memperkecil kebiasaan ke level paling mudah saat malas agar tidak bolong. |
| **Emotional Anchor** | **Motivasi Utama** | Alasan pribadi mengapa kebiasaan ini penting untuk dijalani. |
| **Micro-Action** | **Kebiasaan Mikro** | Aksi kecil yang memakan waktu ≤ 2 menit. |
| **Milestone** | **Tonggak Pencapaian** | Titik capaian perantara menuju target utama. |

---

## 3. Arsitektur Antarmuka (Zen Minimalist Layout)

### 3.1. Header Atas (`Header.tsx`)
* **Kiri:** Logo Ensō Circle + Teks `KaizenFlow` + sub-teks "Satu langkah kecil hari ini."
* **Kanan (Hanya 3 Elemen Ringkas):**
  1. **Badge Streak:** `🌱 X Hari` (hijau sage lembut, klik untuk info streak).
  2. **Toggle Mode Gelap/Terang:** Ikon matahari / bulan.
  3. **Menu Opsi (`⋮` / MoreVertical):** Membuka popover dropdown yang menampung fungsi sekunder:
     - 📖 **Panduan Kaizen** (Membuka modal panduan prinsip 1% dan aturan 2 menit).
     - 💾 **Cadangan Data** (Ekspor dan impor data lokal).
     - ✨ **Muat Contoh Data** (Bagi pengguna baru yang ingin melihat sampel).
     - 📲 **Pasang di HP (PWA)** (Memicu install prompt browser).

### 3.2. Bilah Navigasi Bawah (`TabNavigation.tsx` - 3 Tab Saja)
1. **`Hari Ini`** (Ikon `Compass`): Daftar kebiasaan aktif untuk hari ini.
2. **`Target`** (Ikon `Target`): Daftar tujuan besar & pohon langkah kecilnya.
3. **`Kemajuan`** (Ikon `TrendingUp`): Grafik konsistensi & tombol Refleksi Malam.

### 3.3. Halaman "Hari Ini" (`DailySanctuaryView.tsx` & `MicroActionCard.tsx`)
* **Indikator Progres Harian:** Teks ringkas *"X dari Y kebiasaan selesai hari ini"* dengan garis progres persentase yang halus.
* **Struktur Kartu Kebiasaan (`MicroActionCard`):**
  - **Kiri:** Lingkaran centang sentuh berukuran minimal 44×44px. Ketukan satu kali langsung mengubah status menjadi selesai (`[✓]`) disertai haptic visual & teks redup bergaris coret.
  - **Tengah:** Judul kebiasaan, durasi estimasi (contoh: "2 mnt"), dan badge target (jika terhubung ke target besar).
  - **Kanan (Hanya 1 Tombol):** Ikon menu aksi `[⋯]`.
* **Menu Aksi `[⋯]` pada Kartu:**
  - ⏱️ **Mulai Timer (2 Menit):** Membuka dialog timer fokus jika pengguna ingin didampingi waktu.
  - ⚡ **Peringan Tugas (2 Menit):** Mengaktifkan mode darurat (misal: "baca 1 halaman" diringankan menjadi "baca 1 paragraf").
  - 🗑️ **Hapus Kebiasaan:** Menghapus dari daftar.
* **Tombol Tambah Tunggal:** Tombol `+ Tambah Kebiasaan Hari Ini` yang jelas dan bersih di bawah daftar.

### 3.4. Logika Perulangan Harian (Daily Recurrence & Midnight Rollover)
* Kebiasaan tidak hilang saat hari berganti.
* Saat aplikasi dimuat, jika tanggal `completedAt` tercatat sebelum hari ini (`toDateString() !== today.toDateString()`), sistem secara otomatis menyetel ulang status `isCompletedToday` menjadi `false`.
* Kebiasaan tetap berada di daftar "Hari Ini" untuk dikerjakan kembali dan meneruskan *streak*.

### 3.5. Halaman "Target" (`GoalManagerView.tsx`)
* Menampilkan daftar target pengguna yang tersusun rapi.
* Setiap kartu target dapat dibuka untuk melihat tonggak pencapaian dan kebiasaan mikro yang dihasilkan.
* Tombol utama: `+ Buat Target Baru` dengan panduan formulir 3 langkah mudah:
  1. *Apa target yang ingin Anda capai?*
  2. *Mengapa ini penting bagi Anda? (Motivasi Utama)*
  3. *Tindakan mikro 2 menit apa yang bisa Anda lakukan setiap hari untuk memulainya?*

### 3.6. Halaman "Kemajuan" (`CompoundVisualizerView.tsx`)
* **Kurva Pertumbuhan 1%:** Menampilkan grafik interaktif proyeksi pertumbuhan konsistensi harian.
* **Kartu Refleksi Malam (Hansei):**
  - Tombol elegan: `🌙 Tulis Refleksi Malam (30 Detik)`.
  - Formulir ramah dan cepat:
    1. *1 hal kecil yang berhasil saya lakukan hari ini:*
    2. *1 penyesuaian kecil untuk esok hari:*
  - Riwayat refleksi malam sebelumnya tersaji dalam kartu ringkas.

---

## 4. Arsitektur Progressive Web App (PWA)

### 4.1. Manifest Web App (`src/app/manifest.ts` / `public/manifest.json`)
```json
{
  "name": "KaizenFlow: Kebiasaan Mikro 1%",
  "short_name": "Kaizen",
  "description": "Aplikasi habit tracker berbasis filosofi Kaizen 1% dan aturan 2 menit.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF9",
  "theme_color": "#0F172A",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### 4.2. Service Worker (`public/sw.js`)
* **Cache Strategy:** *Network First, Falling Back to Cache* untuk navigasi, dan *Cache First* untuk aset statis (CSS, JS, Fonts, SVGs).
* **Offline Fallback:** Mengizinkan aplikasi dibuka dan digunakan sepenuhnya meskipun koneksi internet terputus total.
* **Registrasi:** Diinisialisasi secara otomatis di `src/app/layout.tsx` pada sisi klien (*client-side*).

### 4.3. Prompt Instalasi PWA (`usePwaInstall.ts`)
* Mendengarkan event `beforeinstallprompt` browser pada Android/Chrome.
* Menampilkan aksi "📲 Pasang Aplikasi di HP" di Menu `⋮` Header.
* Untuk iOS Safari: Menampilkan modal bantuan singkat petunjuk *Share → Add to Home Screen*.

---

## 5. Rencana Pengujian & Verifikasi

1. **Unit & Integration Test:**
   - Memastikan tes navigasi tab (3 tab: Hari Ini, Target, Kemajuan) lulus 100%.
   - Memastikan menu titik tiga `⋮` di Header membuka opsi Cadangan Data, Panduan Kaizen, dan Contoh Data dengan benar.
   - Memastikan toggle centang pada `MicroActionCard` mencatat penyelesaian dan memperbarui streak.
   - Memastikan auto-reset harian bekerja saat tanggal berganti.
2. **Build Verifikasi:**
   - Menjalankan `npm run build` (Next.js production build) tanpa error TypeScript atau lint.
3. **PWA Validation:**
   - Memvalidasi sintaks `manifest.json` dan registrasi `sw.js`.

---

Dokumen ini disetujui sebagai acuan tunggal sebelum pembuatan rencana kerja implementasi (*implementation plan*).
