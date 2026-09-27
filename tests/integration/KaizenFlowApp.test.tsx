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

  it("1. loads and renders Header, TabNavigation, Sanctuary by default, and Footer", async () => {
    render(<HomePage />);

    // Header checks
    expect(screen.getAllByText("KaizenFlow")[0]).toBeInTheDocument();
    expect(
      screen.getByText(/Satu langkah kecil hari ini\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Refleksi Hansei/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cadangan Data/i })
    ).toBeInTheDocument();

    // TabNavigation checks
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Sanctuary|Fokus Harian/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Goal Forge|Pohon Tujuan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /1% Compound|Pertumbuhan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Cadangan Data/i })
    ).toBeInTheDocument();

    // Default Sanctuary View checks
    expect(
      screen.getByText(/Daily Sanctuary & Fokus Hari Ini/i)
    ).toBeInTheDocument();

    // Empty state / Welcoming starter banner checks after loading settles
    await waitFor(() => {
      expect(
        screen.getByText(/Selamat Datang di KaizenFlow/i)
      ).toBeInTheDocument();
    });

    // Footer checks
    expect(
      screen.getByText(
        /Perjalanan seribu mil dimulai dengan satu langkah mikro yang terlalu kecil untuk memicu rasa malas\./i
      )
    ).toBeInTheDocument();
  });

  it("2. switching to Goal Forge tab renders Goal Manager", async () => {
    render(<HomePage />);

    const goalForgeTab = screen.getByRole("tab", {
      name: /Goal Forge|Pohon Tujuan/i,
    });
    fireEvent.click(goalForgeTab);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Goal Forge & Decomposition/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Forge New Goal" })
    ).toBeInTheDocument();
  });

  it("3. switching to 1% Compound tab renders Compound Growth visualizer", async () => {
    render(<HomePage />);

    const compoundTab = screen.getByRole("tab", {
      name: /1% Compound|Pertumbuhan/i,
    });
    fireEvent.click(compoundTab);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /1% Compound Engine/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("compound-curve-svg")).toBeInTheDocument();
  });

  it("4. clicking Hansei opens Hansei modal and saves reflection", async () => {
    render(<HomePage />);

    // Click Hansei quick action in header
    const hanseiBtn = screen.getByRole("button", { name: /Refleksi Hansei/i });
    fireEvent.click(hanseiBtn);

    // Modal opens
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Hansei: Refleksi Malam 30 Detik/i })
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
        screen.queryByRole("heading", { name: /Hansei: Refleksi Malam 30 Detik/i })
      ).not.toBeInTheDocument();
    });
  });

  it("5. clicking Backup in Header opens Data Backup modal", async () => {
    render(<HomePage />);

    // Click Backup button in header
    const backupBtn = screen.getByRole("button", { name: /Cadangan Data/i });
    fireEvent.click(backupBtn);

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

  it("6. welcome banner can load sample data into the application", async () => {
    render(<HomePage />);

    // Welcome banner should have a button to load sample data
    const loadSampleBtn = await screen.findByRole("button", {
      name: /Muat Contoh Data/i,
    });
    fireEvent.click(loadSampleBtn);

    // After loading sample data, sanctuary actions should appear
    await waitFor(() => {
      expect(
        screen.getByText(/Lakukan 2 kali push-up saat bangun tidur/i)
      ).toBeInTheDocument();
    });
  });

  it("7. wires up EventBus so goal creation automatically adds micro-actions to daily sanctuary", async () => {
    render(<HomePage />);

    // Open forge modal via header or goal tab
    const goalTab = screen.getByRole("tab", {
      name: /Goal Forge|Pohon Tujuan/i,
    });
    fireEvent.click(goalTab);

    const forgeBtn = await screen.findByRole("button", {
      name: "Forge New Goal",
    });
    fireEvent.click(forgeBtn);

    // Step 1: Vision
    const titleInput = await screen.findByLabelText(/vision title/i);
    fireEvent.change(titleInput, { target: { value: "Belajar Next.js Architecture" } });

    const nextBtn1 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn1);

    // Step 2: Emotional Anchor
    const whyInput = await screen.findByLabelText(/the why/i);
    fireEvent.change(whyInput, {
      target: { value: "Membangun aplikasi berkualitas tinggi tanpa stres" },
    });

    const nextBtn2 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn2);

    // Step 3: Milestone
    const milestoneInput = await screen.findByLabelText(/milestone title/i);
    fireEvent.change(milestoneInput, {
      target: { value: "Pahami Event-Driven Architecture" },
    });

    const nextBtn3 = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn3);

    // Step 4: Micro-Action
    const microActionInput = await screen.findByLabelText(/starter micro-action/i);
    fireEvent.change(microActionInput, {
      target: { value: "Baca 1 file interface TypeScript" },
    });

    const finishBtn = screen.getByRole("button", { name: /forge goal/i });
    fireEvent.click(finishBtn);

    // Wizard should close
    await waitFor(() => {
      expect(screen.queryByLabelText(/starter micro-action/i)).not.toBeInTheDocument();
    });

    // Switch back to Sanctuary tab
    const sanctuaryTab = screen.getByRole("tab", {
      name: /Sanctuary|Fokus Harian/i,
    });
    fireEvent.click(sanctuaryTab);

    // Verify micro-action was automatically added to daily sanctuary
    await waitFor(() => {
      expect(
        screen.getByText("Baca 1 file interface TypeScript")
      ).toBeInTheDocument();
    });
  });
});
