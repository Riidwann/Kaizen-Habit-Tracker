import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

describe("Header with HeaderMenu", () => {
  it("renders brand, streak badge, theme toggle, and menu button", () => {
    render(
      <Header
        currentStreak={5}
        onOpenBackup={vi.fn()}
        onOpenGuide={vi.fn()}
      />
    );

    expect(screen.getByText("KaizenFlow")).toBeInTheDocument();
    expect(screen.getByText(/Satu langkah kecil hari ini\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Menu Opsi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
  });

  it("opens menu dropdown when Menu Opsi is clicked", () => {
    const handleOpenBackup = vi.fn();
    const handleOpenGuide = vi.fn();
    const handleLoadSample = vi.fn();

    render(
      <Header
        currentStreak={2}
        onOpenBackup={handleOpenBackup}
        onOpenGuide={handleOpenGuide}
        onLoadSample={handleLoadSample}
      />
    );

    const menuBtn = screen.getByRole("button", { name: /Menu Opsi/i });
    fireEvent.click(menuBtn);

    // Menu items appear
    expect(screen.getByRole("menuitem", { name: /Panduan Kaizen/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Cadangan Data/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Muat Contoh Data/i })).toBeInTheDocument();

    // Clicking Panduan calls onOpenGuide and closes menu
    fireEvent.click(screen.getByRole("menuitem", { name: /Panduan Kaizen/i }));
    expect(handleOpenGuide).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menuitem", { name: /Panduan Kaizen/i })).not.toBeInTheDocument();
  });
});
