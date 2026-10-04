# Spesifikasi Desain: Deployment Cloud Gratis & CI/CD Kaizen APP

- **Tanggal**: 2026-10-04
- **Status**: Disetujui
- **Topik**: Vercel Free Hosting, PWA Cache-Control Headers, Git Continuous Deployment, Mobile Installation

---

## 1. Latar Belakang & Tujuan (Objective)

Pengguna ingin mendeploy Kaizen APP ke platform hosting gratis, dapat dijalankan secara online dari perangkat ponsel pintar (HP) dengan dukungan penuh Progressive Web App (PWA) dan HTTPS, serta menjamin kemudahan pembaruan (*updates*) di masa depan secara otomatis setiap kali ada perubahan kode.

---

## 2. Sasaran Desain & Kriteria Keberhasilan (Success Criteria)

1. **100% Gratis & Tanpa Biaya Tersembunyi**:
   - Memanfaatkan Vercel Hobby Tier yang menyediakan bandwidth gratis, build otomatis, dan sertifikat SSL/HTTPS gratis.
2. **Online & Dapat Diinstal di HP (PWA Ready)**:
   - Aplikasi dapat diakses via URL publik HTTPS (misal `https://*.vercel.app`) dan diinstal langsung ke layar utama (*home screen*) ponsel Android maupun iOS tanpa melalui App Store / Play Store.
3. **Pembaruan Otomatis (Continuous Deployment)**:
   - Setiap perintah `git push origin main` secara otomatis memicu proses build dan pembaruan aplikasi di cloud dalam kurun waktu $\le 60$ detik.
4. **Optimal PWA Caching Policy**:
   - Menjamin file Service Worker (`/sw.js`) tidak terkunci cache browser ponsel dengan menetapkan `Cache-Control: public, max-age=0, must-revalidate` pada level CDN Vercel.
5. **Keamanan & Persistensi Data**:
   - Seluruh data kebiasaan pengguna tetap tersimpan aman di `localStorage` ponsel saat aplikasi menerima pembaruan versi baru.
6. **Zero Regression**:
   - 100% test suite yang ada (51 files, 292 tests) tetap lulus dan kompilasi build bersih dari error.

---

## 3. Rincian Arsitektur Solusi (Architectural Specification)

### 3.1. Konfigurasi Vercel Header & Caching (`vercel.json`)

File konfigurasi [vercel.json](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/vercel.json) ditambahkan pada root direktori project untuk mengatur header HTTP tingkat edge:

```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    },
    {
      "source": "/icons/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Tujuan**:
- Menginstruksikan browser ponsel agar selalu mengecek versi terbaru dari `/sw.js` setiap kali aplikasi dibuka.
- Memberikan izin penuh cakupan root (`/`) bagi Service Worker.
- Memaksimalkan kecepatan pemuatan ikon statis dengan cache panjang.

### 3.2. Integrasi Continuous Deployment (Git -> Vercel)

Alur deployment memanfaatkan integrasi native GitHub dengan Vercel:
1. **Repository Target**: `https://github.com/Riidwann/Kaizen-Habit-Tracker.git` (Branch `main`).
2. **Koneksi Akun**:
   - Pengguna login ke [vercel.com](https://vercel.com) menggunakan akun GitHub (`Riidwann`).
   - Memilih opsi **"Add New Project"** -> **"Import"** repository `Kaizen-Habit-Tracker`.
   - Vercel mendeteksi framework `Next.js` secara otomatis:
     - Build Command: `next build`
     - Output Directory: `.next`
     - Install Command: `npm install`
3. **Siklus Update Masa Depan**:
   - Pengembang membuat perubahan kode -> melakukan commit -> menjalankan `git push origin main`.
   - Webhook GitHub memberi sinyal ke Vercel secara otomatis.
   - Vercel menjalankan runner isolated, menguji kompilasi, dan menerbitkan build baru ke CDN global tanpa downtime.

### 3.3. Panduan Akses & Penginstalan di Ponsel Pengguna

1. **Android (Google Chrome)**:
   - Akses URL aplikasi (misal `https://kaizen-habit-tracker-*.vercel.app`).
   - Klik tombol panduan instalasi PWA yang ada pada antarmuka aplikasi atau menu Chrome (⋮) -> **"Tambahkan ke Layar Utama" / "Install Aplikasi"**.
   - Aplikasi berjalan dalam mode `standalone` (tampilan penuh layaknya aplikasi native tanpa URL bar browser).
2. **iOS / iPhone (Apple Safari)**:
   - Buka URL aplikasi di Safari.
   - Ketuk tombol **Bagikan (Share)** -> pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)**.
   - Aplikasi otomatis muncul dengan ikon Zen Ensō di layar utama iPhone.

---

## 4. Rencana Pengujian & Validasi

1. **Validasi File Konfigurasi**:
   - Memverifikasi format JSON [vercel.json](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/vercel.json) valid dan sesuai standar Vercel Project Configuration.
2. **Kompilasi Build Lokal**:
   - Menjalankan `npm run build` di lokal untuk memastikan tidak ada kesalahan konfigurasi atau runtime error.
3. **Regression Testing**:
   - Menjalankan `npm run test` untuk memastikan semua 51 test suites dan 292 tests tetap lulus 100%.
4. **Git Sync Verification**:
   - Memastikan commit konfigurasi berhasil di-push ke GitHub remote `origin/main` sehingga siap di-import oleh Vercel.
