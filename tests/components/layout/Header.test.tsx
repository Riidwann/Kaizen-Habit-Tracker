import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header, TobiIshiLogo, EnsoLogo } from "@/components/layout/Header";

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
    expect(screen.getByLabelText("Tobi-Ishi K - KaizenFlow Logo")).toBeInTheDocument();
    expect(screen.getByText(/Satu langkah kecil hari ini\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Menu Opsi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
  });

  it("renders TobiIshiLogo (Concept B monogram) with correct aria-label and accessible graphic", () => {
    render(<TobiIshiLogo />);
    const logo = screen.getByLabelText("Tobi-Ishi K - KaizenFlow Logo");
    expect(logo).toBeInTheDocument();
  });

  it("exports EnsoLogo as an alias to TobiIshiLogo for backward compatibility", () => {
    expect(EnsoLogo).toBe(TobiIshiLogo);
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

  it("renders To-Do and Routine quick-access buttons with counters", () => {
    const handleOpenTodo = vi.fn();
    const handleOpenRoutine = vi.fn();

    render(
      <Header
        currentStreak={3}
        onOpenTodo={handleOpenTodo}
        onOpenRoutine={handleOpenRoutine}
        activeTodosCount={4}
        remainingRoutinesCount={2}
      />
    );

    const todoBtn = screen.getByRole("button", { name: /Buka daftar To-Do/i });
    expect(todoBtn).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    fireEvent.click(todoBtn);
    expect(handleOpenTodo).toHaveBeenCalledTimes(1);

    const routineBtn = screen.getByRole("button", { name: /Buka Jadwal Rutin/i });
    expect(routineBtn).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(routineBtn);
    expect(handleOpenRoutine).toHaveBeenCalledTimes(1);
  });

  it("is memoized with React.memo and has displayName", () => {
    expect(Header.displayName).toBe("Header");
    expect((Header as any).$$typeof).toBe(Symbol.for("react.memo"));
  });
});

