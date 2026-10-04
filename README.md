# 🌿 KaizenFlow - Habit Tracker

> *Filosofi Kaizen: Perbaikan bertahap 1% setiap hari yang berakumulasi menjadi perubahan hidup yang luar biasa.*

**KaizenFlow** adalah aplikasi habit tracker modern berbasis **Progressive Web App (PWA)** dengan estetika **Zen Japandi Minimalis**. Dirancang agar ringan, menenangkan, dan membantu Anda membangun kebiasaan positif secara konsisten tanpa rasa terbebani.

---

## ✨ Fitur Utama

- **🌱 Filosofi 1% & Aturan 2 Menit (2-Minute Rule)**: Pecah kebiasaan besar menjadi langkah mikro yang mudah dimulai dalam waktu kurang dari 2 menit.
- **🍵 Estetika Zen Japandi**: Antarmuka bersih, palet warna tenang alami (earth tones), tipografi elegan, serta animasi mikro yang lembut (*motion-reduce friendly*).
- **📱 100% Mobile-First & PWA**: Dapat diinstal di Android dan iOS langsung dari browser tanpa perlu Google Play Store atau Apple App Store.
- **⚡ Offline-First & Privasi Terjaga**: Berjalan mulus secara offline tanpa koneksi internet. Semua data disimpan secara lokal di perangkat Anda (tanpa pelacak, tanpa server database luar).
- **🔥 Visual Streak & Heatmap**: Pantau konsistensi harian Anda dengan visualisasi ringkas dan perayaan konfeti yang memotivasi.
- **♿ Aksesibilitas Penuh (WCAG AA)**: Target sentuh ergonomis (≥ 44px), navigasi keyboard lengkap, dan kontras warna optimal.

---

## 🚀 Panduan Deploy 1-Klik ke Vercel (100% Gratis)

Aplikasi ini dapat di-deploy ke **Vercel Hobby Plan (gratis selamanya)** dalam waktu kurang dari 1 menit:

1. **Buka Vercel**:
   Kunjungi [vercel.com](https://vercel.com) dan masuk (*Login*) menggunakan akun GitHub Anda.
2. **Import Repository**:
   Klik tombol **"Add New Project"**, lalu pilih repository GitHub Anda: **`Kaizen-Habit-Tracker`**.
3. **Konfigurasi & Deploy**:
   Vercel akan mendeteksi otomatis:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - Biarkan semua pengaturan dalam kondisi default, lalu klik tombol **"Deploy"**.
4. **Selesai!**:
   Dalam kurun waktu ~1 menit, aplikasi Anda aktif dan Vercel menyediakan URL publik HTTPS yang aman (misalnya: `https://kaizen-habit-tracker.vercel.app`).

---

## 📲 Panduan Menjalankan & Menginstal di HP (PWA)

Setelah aplikasi ter-deploy di Vercel, Anda dapat menginstalnya ke layar utama ponsel agar terasa seperti aplikasi native (bisa dibuka offline dan tanpa browser address bar):

### 🤖 Android (Google Chrome)
1. Buka URL Vercel aplikasi Anda di **Google Chrome**.
2. Anda akan melihat tombol **"Install KaizenFlow"** di dalam aplikasi, atau:
3. Ketuk ikon **Menu titik tiga (⋮)** di kanan atas browser Chrome.
4. Pilih **"Tambahkan ke Layar Utama"** (*Add to Home screen*) atau **"Install Aplikasi"** (*Install app*).
5. Ikon KaizenFlow akan muncul di homescreen perangkat Anda.

### 🍏 iPhone / iPad (Safari)
1. Buka URL Vercel aplikasi Anda di **Safari** (PWA di iOS membutuhkan Safari untuk instalasi).
2. Ketuk ikon **Share (⎋)** di bagian bawah layar.
3. Gulir ke bawah dan pilih **"Add to Home Screen"** (*Tambah ke Layar Utama*).
4. Beri nama (default: *KaizenFlow*) lalu ketuk **"Add"**.
5. Buka KaizenFlow langsung dari homescreen iOS Anda dengan tampilan layar penuh (*standalone*).

---

## 🔄 Cara Update Aplikasi di Masa Depan (Continuous Delivery)

Aplikasi ini sudah terintegrasi dengan Git. Setiap kali Anda melakukan perubahan kode di komputer lokal, pembaruan akan otomatis di-deploy ke Vercel tanpa perlu setup manual:

```bash
# 1. Simpan perubahan ke staging
git add .

# 2. Buat commit deskripsi perubahan
git commit -m "feat: tambah fitur baru atau pembaruan"

# 3. Kirim ke remote repository GitHub
git push origin main
```

> ⚡ **Otomatis**: Begitu perintah `git push` selesai, Vercel secara otomatis mendeteksi commit baru di branch `main` dan memperbarui aplikasi secara live dalam ~30 detik tanpa *downtime*.

---

## 💻 Menjalankan di Komputer Lokal (Local Development)

Jika ingin mengembangkan atau mencoba aplikasi secara lokal:

```bash
# Clone repository
git clone https://github.com/Riidwann/Kaizen-Habit-Tracker.git
cd "Kaizen-Habit-Tracker"

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Menjalankan Testing
Untuk memastikan seluruh unit test dan regression test berjalan dengan baik:
```bash
npm run test
```

### Membangun Versi Produksi Lokal
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library UI**: [React 18](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
- **Deployment & Hosting**: [Vercel](https://vercel.com/) (Hobby Plan - Free)

---

## 📄 Lisensi

Proyek ini dibuat untuk pengembangan kebiasaan hidup yang berkelanjutan. Bebas digunakan dan dimodifikasi untuk kebutuhan personal maupun open-source.
