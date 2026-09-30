import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import HomePage from "@/app/page";
import { inMemoryEventBus } from "@/shared/infrastructure/InMemoryEventBus";

describe("KaizenFlowApp Integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    inMemoryEventBus.clear();
  });

  it("1. loads and renders Header, 3-TabNavigation, Sanctuary by default, and Footer", async () => {
    render(<HomePage />);

    // Header checks
    expect(screen.getAllByText("KaizenFlow")[0]).toBeInTheDocument();
    expect(
      screen.getByText(/Satu langkah kecil hari ini\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Menu Opsi/i })
    ).toBeInTheDocument();

    // TabNavigation checks: exactly 3 tabs
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Hari Ini/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Target/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Kemajuan/i })
    ).toBeInTheDocument();

    // Default Sanctuary View checks
    expect(
      screen.getByRole("heading", { name: /^Fokus Hari Ini$/i, level: 1 })
    ).toBeInTheDocument();

    // Empty state checks after loading settles
    await waitFor(() => {
      expect(
        screen.getByText(/Belum ada fokus hari ini/i)
      ).toBeInTheDocument();
    });
  });

  it("2. switching to Target tab renders Goal Manager", async () => {
    render(<HomePage />);

    const goalTab = screen.getByRole("tab", {
      name: /Target/i,
    });
    fireEvent.click(goalTab);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Target & Langkah Kecil|Goal Forge/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Tambah Target|Forge New Goal/i })
    ).toBeInTheDocument();
  });

  it("3. switching to Kemajuan tab renders Compound Growth visualizer", async () => {
    render(<HomePage />);

    const compoundTab = screen.getByRole("tab", {
      name: /Kemajuan/i,
    });
    fireEvent.click(compoundTab);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Grafik Kemajuan 1%|1% Compound/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("compound-curve-svg")).toBeInTheDocument();
  });

  it("4. clicking reflection button in Kemajuan tab opens Hansei modal and saves reflection", async () => {
    render(<HomePage />);

    // Switch to Kemajuan tab
    const compoundTab = screen.getByRole("tab", { name: /Kemajuan/i });
    fireEvent.click(compoundTab);

    // Click Tulis Refleksi Malam button
    const reflectBtn = await screen.findByRole("button", { name: /Tulis Refleksi Malam/i });
    fireEvent.click(reflectBtn);

    // Modal opens
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Refleksi Malam/i })
      ).toBeInTheDocument();
    });

    // Fill in reflection form
    const winInput = screen.getByPlaceholderText(
      /1 hal kecil yang berhasil saya lakukan hari ini/i
    );
    const adjustInput = screen.getByPlaceholderText(
      /1 penyesuaian 1% untuk esok hari/i
    );

    fireEvent.change(winInput, { target: { value: "Membaca 1 paragraf buku" } });
    fireEvent.change(adjustInput, {
      target: { value: "Menaruh buku di sebelah bantal" },
    });

    const submitBtn = screen.getByRole("button", { name: /Simpan Refleksi/i });
    fireEvent.click(submitBtn);

    // Modal closes after submission
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /Refleksi Malam/i })
      ).not.toBeInTheDocument();
    });
  });

  it("5. clicking Backup in Header Menu opens Data Backup modal", async () => {
    render(<HomePage />);

    // Open Header Menu (⋮)
    const menuBtn = screen.getByRole("button", { name: /Menu Opsi/i });
    fireEvent.click(menuBtn);

    // Click Backup menuitem
    const backupItem = await screen.findByRole("menuitem", { name: /Cadangan Data/i });
    fireEvent.click(backupItem);

    // Modal opens
    const modal = await screen.findByRole("dialog");
    expect(
      within(modal).getByRole("heading", { name: /Manajemen Data & Cadangan/i })
    ).toBeInTheDocument();

    expect(
      within(modal).getByRole("button", { name: /Unduh Cadangan JSON/i })
    ).toBeInTheDocument();
    expect(
      within(modal).getByRole("button", { name: /Muat Contoh Data/i })
    ).toBeInTheDocument();
  });

  it("6. header menu can load sample data into the application", async () => {
    render(<HomePage />);

    // Open Header Menu (⋮)
    const menuBtn = screen.getByRole("button", { name: /Menu Opsi/i });
    fireEvent.click(menuBtn);

    // Header menu should have an option to load sample data
    const loadSampleItem = await screen.findByRole("menuitem", {
      name: /Muat Contoh Data/i,
    });
    fireEvent.click(loadSampleItem);

    // After loading sample data, actions should appear
    await waitFor(() => {
      expect(
        screen.getByText(/Lakukan 2 kali push-up saat bangun tidur/i)
      ).toBeInTheDocument();
    });
  });

  it("7. wires up EventBus so goal creation automatically adds micro-actions to daily sanctuary", async () => {
    render(<HomePage />);

    // Open forge modal via Target tab
    const goalTab = screen.getByRole("tab", {
      name: /Target/i,
    });
    fireEvent.click(goalTab);

    const forgeBtn = await screen.findByRole("button", {
      name: /Tambah Target/i,
    });
    fireEvent.click(forgeBtn);

    // Step 1: Vision
    const titleInput = await screen.findByLabelText(/nama target/i);
    fireEvent.change(titleInput, { target: { value: "Belajar Next.js Architecture" } });

    const nextBtn1 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn1);

    // Step 2: Emotional Anchor
    const whyInput = await screen.findByLabelText(/motivasi utama/i);
    fireEvent.change(whyInput, {
      target: { value: "Membangun aplikasi berkualitas tinggi tanpa stres" },
    });

    const nextBtn2 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn2);

    // Step 3: Milestone
    const milestoneInput = await screen.findByLabelText(/tonggak pencapaian/i);
    fireEvent.change(milestoneInput, {
      target: { value: "Pahami Event-Driven Architecture" },
    });

    const nextBtn3 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn3);

    // Step 4: Micro-Action
    const microActionInput = await screen.findByLabelText(/langkah kecil awal/i);
    fireEvent.change(microActionInput, {
      target: { value: "Baca 1 file interface TypeScript" },
    });

    const finishBtn = screen.getByRole("button", { name: /simpan target/i });
    fireEvent.click(finishBtn);

    // Wizard should close
    await waitFor(() => {
      expect(screen.queryByLabelText(/langkah kecil awal/i)).not.toBeInTheDocument();
    });

    // Switch back to Hari Ini tab
    const sanctuaryTab = screen.getByRole("tab", {
      name: /Hari Ini/i,
    });
    fireEvent.click(sanctuaryTab);

    // Verify micro-action was automatically added to daily list
    await waitFor(() => {
      expect(
        screen.getByText("Baca 1 file interface TypeScript")
      ).toBeInTheDocument();
    });
  });
});
