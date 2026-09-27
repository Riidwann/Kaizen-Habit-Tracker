import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompoundVisualizerView } from "@/modules/reflection/presentation/CompoundVisualizerView";
import { HanseiReflection } from "@/modules/reflection/domain/HanseiReflection";

describe("CompoundVisualizerView", () => {
  const sampleReflections: HanseiReflection[] = [
    new HanseiReflection({
      id: "ref-1",
      date: "2026-09-27",
      winOfTheDay: "Membaca 2 halaman",
      tomorrowAdjustment: "Buka buku setelah makan malam",
    }),
    new HanseiReflection({
      id: "ref-2",
      date: "2026-09-28",
      winOfTheDay: "Push up 5 kali",
      tomorrowAdjustment: "Siapkan matras olahraga",
    }),
  ];

  it("renders header, stats metrics, and visualizer graph correctly", () => {
    render(
      <CompoundVisualizerView
        currentStreak={5}
        longestStreak={7}
        isGracePeriod={false}
        totalMicroWins={14}
        compoundMultiplier={1.15}
        percentageGain={14.9}
        reflections={sampleReflections}
      />
    );

    // Header & Titles
    expect(screen.getByRole("heading", { name: /1% Compound Engine/i })).toBeInTheDocument();

    // Streak badge
    expect(screen.getByText(/5 Hari Bertumbuh/i)).toBeInTheDocument();

    // Stats metrics
    expect(screen.getAllByText(/1.15x/i).length).toBeGreaterThan(0);
    expect(screen.getByText("14 Aksi Selesai")).toBeInTheDocument();

    // SVG Visualizer
    expect(screen.getByTestId("compound-curve-svg")).toBeInTheDocument();

    // History list items
    expect(screen.getByText("Membaca 2 halaman")).toBeInTheDocument();
    expect(screen.getByText("Push up 5 kali")).toBeInTheDocument();
  });

  it("displays grace period indicator when isGracePeriod is true", () => {
    render(
      <CompoundVisualizerView
        currentStreak={4}
        longestStreak={6}
        isGracePeriod={true}
        totalMicroWins={10}
        compoundMultiplier={1.10}
        percentageGain={10.5}
        reflections={[]}
      />
    );

    expect(screen.getByText(/Mode Pemulihan Aktif/i)).toBeInTheDocument();
    expect(screen.getByText(/Never Miss Twice/i)).toBeInTheDocument();
  });

  it("shows empty state when no reflections exist", () => {
    render(
      <CompoundVisualizerView
        currentStreak={0}
        longestStreak={0}
        isGracePeriod={false}
        totalMicroWins={0}
        compoundMultiplier={1.0}
        percentageGain={0}
        reflections={[]}
      />
    );

    expect(screen.getByText(/Belum ada catatan refleksi Hansei/i)).toBeInTheDocument();
  });

  it("calls onOpenHanseiModal when reflection button is clicked", () => {
    const mockOpenModal = vi.fn();

    render(
      <CompoundVisualizerView
        currentStreak={3}
        longestStreak={3}
        isGracePeriod={false}
        totalMicroWins={3}
        compoundMultiplier={1.03}
        percentageGain={3.03}
        reflections={sampleReflections}
        onOpenHanseiModal={mockOpenModal}
      />
    );

    const reflectBtn = screen.getByRole("button", {
      name: /refleksi hansei|mulai refleksi|tulis refleksi/i,
    });
    fireEvent.click(reflectBtn);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});
