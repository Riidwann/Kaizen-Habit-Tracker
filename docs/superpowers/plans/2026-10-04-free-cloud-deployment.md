# Free Cloud Deployment & Continuous Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyiapkan konfigurasi hosting cloud gratis Vercel dengan optimasi header caching Service Worker PWA, memvalidasi build produksi, memperbarui panduan instalasi/update, dan mensinkronisasikan repository ke GitHub remote agar siap di-deploy secara online ke ponsel pengguna.

**Architecture:** Membuat file `vercel.json` untuk konfigurasi HTTP cache-control pada Service Worker (`/sw.js`) dan web manifest, memvalidasi integritas pengujian (51 test suites) dan Next.js production build, serta menyusun panduan interaktif step-by-step untuk menghubungkan repository GitHub ke Vercel dashboard.

**Tech Stack:** Next.js 14, Vercel Platform, Service Worker / PWA, TypeScript, Vitest, Git.

**Spec:** [docs/superpowers/specs/2026-10-04-free-cloud-deployment-design.md](file:///C:/Users/HP/OneDrive/Documents/Project/Code/Kaizen%20APP/docs/superpowers/specs/2026-10-04-free-cloud-deployment-design.md)

## Global Constraints

- Semua 51 test suites (292 tests) harus tetap lulus 100%.
- File konfigurasi `vercel.json` harus valid JSON dan sesuai dengan skema resmi Vercel Project Configuration.
- Service Worker (`/sw.js`) harus memiliki header `max-age=0, must-revalidate` untuk mencegah stale caching di perangkat ponsel.
- Semua commit harus di-push ke branch `origin/main`.

---

### Task 1: Konfigurasi Header Caching Vercel (`vercel.json`) & Pengujian

**Files:**
- Create: `vercel.json`
- Modify: `tests/unit/env.test.ts:25-38`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Consumes: Vercel JSON specification.
- Produces: `vercel.json` file configuring edge caching for `/sw.js`, `/manifest.json`, and `/icons/*`.

- [ ] **Step 1: Write test verifying `vercel.json` structure and headers**

Tambahkan pengujian di `tests/unit/env.test.ts`:
```typescript
import fs from "fs";
import path from "path";

it("should have valid vercel.json with zero-cache header for service worker", () => {
  const vercelPath = path.resolve(__dirname, "../../vercel.json");
  expect(fs.existsSync(vercelPath)).toBe(true);
  const config = JSON.parse(fs.readFileSync(vercelPath, "utf-8"));
  expect(Array.isArray(config.headers)).toBe(true);
  const swHeader = config.headers.find((h: any) => h.source === "/sw.js");
  expect(swHeader).toBeDefined();
  expect(swHeader.headers.some((hdr: any) => hdr.key === "Cache-Control" && hdr.value.includes("max-age=0"))).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/env.test.ts`
Expected: FAIL karena `vercel.json` belum dibuat.

- [ ] **Step 3: Create `vercel.json`**

Buat file `vercel.json` di root:
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/env.test.ts`
Expected: PASS (4/4 tests pass in `tests/unit/env.test.ts`).

- [ ] **Step 5: Commit**

```bash
git add vercel.json tests/unit/env.test.ts
git commit -m "feat(deploy): configure vercel headers for pwa service worker caching"
```

---

### Task 2: Validasi Build Produksi & Regression Testing

**Files:**
- Test: All 51 test files
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`

**Interfaces:**
- Consumes: Entire application codebase and `vercel.json`.
- Produces: Verified production build ready for zero-error deployment on Vercel runners.

- [ ] **Step 1: Run complete test suite**

Run: `npm run test`
Expected: All 51 test suites and 293 tests PASS.

- [ ] **Step 2: Run TypeScript typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors (exits with code 0).

- [ ] **Step 3: Clean `.next` and run production build**

Run: `powershell -Command "if (Test-Path .next) { Remove-Item -Recurse -Force .next }; npm run build"`
Expected: Build succeeds with code 0, generating optimized client chunks and server output.

- [ ] **Step 4: Commit**

```bash
git status
# verify working tree is clean
```

---

### Task 3: Dokumentasi Panduan Deployment & Sinkronisasi Git Remote

**Files:**
- Modify: `README.md`
- Test: `git status`, `git push origin main`

**Interfaces:**
- Consumes: Git remote `origin/main`.
- Produces: Updated `README.md` containing 1-click Vercel deployment guide, mobile PWA installation steps, and future update instructions, pushed to GitHub remote.

- [ ] **Step 1: Update `README.md` with Deployment & Mobile Installation Guide**

Tambahkan petunjuk lengkap di `README.md`:
- Bagian **Deploy ke Cloud Gratis (Vercel)** dengan langkah 1-klik via dashboard vercel.com.
- Bagian **Cara Menjalankan & Menginstal di HP (PWA)** untuk Android dan iOS.
- Bagian **Cara Melakukan Update Kedepannya (Continuous Deployment)** dengan 3 perintah git.

- [ ] **Step 2: Run tests to verify zero regressions**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 3: Commit and Push to GitHub Remote**

```bash
git add README.md
git commit -m "docs: add Vercel deployment, mobile PWA setup, and continuous delivery guide"
git push origin main
```

- [ ] **Step 4: Verify remote status**

Run: `git status`
Expected: "Your branch is up to date with 'origin/main'", working tree clean.
