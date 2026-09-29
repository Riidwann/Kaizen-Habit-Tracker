import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MicroActionCard } from "@/modules/sanctuary/presentation/MicroActionCard";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";

describe("MicroActionCard Zen Minimalist", () => {
  const createMockAction = (isCompleted = false, isScaledDown = false) =>
    MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Membaca 1 halaman buku",
      scaleDownTitle: "Buka buku dan baca 1 kalimat",
      estimatedMinutes: 2,
      isCompletedToday: isCompleted,
      isScaledDown: isScaledDown,
    }).unwrap();

  it("renders clean card with 44px check target and options menu button", () => {
    const action = createMockAction();
    const handleToggleComplete = vi.fn();
    const handleToggleScaleDown = vi.fn();
    const handleStartTimer = vi.fn();

    render(
      <MicroActionCard
        action={action}
        onToggleComplete={handleToggleComplete}
        onToggleScaleDown={handleToggleScaleDown}
        onStartTimer={handleStartTimer}
      />
    );

    expect(screen.getByText("Membaca 1 halaman buku")).toBeInTheDocument();
    expect(screen.getByText(/2m/i)).toBeInTheDocument();

    // Check button exists
    const checkBtn = screen.getByRole("checkbox");
    expect(checkBtn).toBeInTheDocument();

    // Options button exists
    const optionsBtn = screen.getByRole("button", { name: /Opsi Kebiasaan/i });
    expect(optionsBtn).toBeInTheDocument();
  });

  it("toggles options menu and triggers timer action", () => {
    const action = createMockAction();
    const handleToggleComplete = vi.fn();
    const handleToggleScaleDown = vi.fn();
    const handleStartTimer = vi.fn();

    render(
      <MicroActionCard
        action={action}
        onToggleComplete={handleToggleComplete}
        onToggleScaleDown={handleToggleScaleDown}
        onStartTimer={handleStartTimer}
      />
    );

    const optionsBtn = screen.getByRole("button", { name: /Opsi Kebiasaan/i });
    fireEvent.click(optionsBtn);

    // Menu options appear
    expect(screen.getByRole("menuitem", { name: /Mulai Timer/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Peringan Tugas|Kecilkan/i })).toBeInTheDocument();

    // Click timer option
    fireEvent.click(screen.getByRole("menuitem", { name: /Mulai Timer/i }));
    expect(handleStartTimer).toHaveBeenCalledWith(action);
  });

  it("calls onToggleComplete when checkbox is clicked", () => {
    const action = createMockAction();
    const handleToggleComplete = vi.fn();
    const handleToggleScaleDown = vi.fn();
    const handleStartTimer = vi.fn();

    render(
      <MicroActionCard
        action={action}
        onToggleComplete={handleToggleComplete}
        onToggleScaleDown={handleToggleScaleDown}
        onStartTimer={handleStartTimer}
      />
    );

    const checkBtn = screen.getByRole("checkbox");
    fireEvent.click(checkBtn);
    expect(handleToggleComplete).toHaveBeenCalledWith("act-1");
  });
});
