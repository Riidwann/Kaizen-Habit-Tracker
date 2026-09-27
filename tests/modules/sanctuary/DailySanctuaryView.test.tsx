import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DailySanctuaryView } from "@/modules/sanctuary/presentation/DailySanctuaryView";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";

describe("DailySanctuaryView", () => {
  let action1: MicroAction;
  let action2: MicroAction;
  let mockController: any;

  beforeEach(() => {
    action1 = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Write 1 TypeScript interface",
      scaleDownTitle: "Read 1 TypeScript type definition",
      estimatedMinutes: 2,
      category: "learning",
      isActiveToday: true,
      isCompletedToday: false,
    }).unwrap();

    action2 = MicroAction.create({
      id: "act-2",
      goalId: "goal-2",
      title: "Drink a glass of warm water",
      scaleDownTitle: "Take 1 sip of water",
      estimatedMinutes: 1,
      category: "health",
      isActiveToday: true,
      isCompletedToday: false,
    }).unwrap();

    mockController = {
      actions: [action1, action2],
      isLoading: false,
      error: null,
      activeTimerAction: null,
      isTimerOpen: false,
      allCompleted: false,
      completedCount: 0,
      totalCount: 2,
      progressPercentage: 0,
      handleToggleComplete: vi.fn(),
      handleToggleScaleDown: vi.fn(),
      handleOpenTimer: vi.fn(),
      handleCloseTimer: vi.fn(),
      handleTimerComplete: vi.fn(),
      refreshActions: vi.fn(),
    };
  });

  it("renders header with progress bar and 1-3 micro-action cards", () => {
    render(<DailySanctuaryView controller={mockController} />);

    expect(screen.getByText(/daily sanctuary|fokus hari ini/i)).toBeInTheDocument();
    expect(screen.getByText(/0 dari 2 selesai/i)).toBeInTheDocument();
    expect(screen.getByText("Write 1 TypeScript interface")).toBeInTheDocument();
    expect(screen.getByText("Drink a glass of warm water")).toBeInTheDocument();
  });

  it("triggers handleToggleScaleDown when 'Terlalu Berat?' button is clicked", () => {
    render(<DailySanctuaryView controller={mockController} />);

    const scaleDownButtons = screen.getAllByRole("button", { name: /terlalu berat|scale down|darurat/i });
    expect(scaleDownButtons.length).toBeGreaterThan(0);
    fireEvent.click(scaleDownButtons[0]);

    expect(mockController.handleToggleScaleDown).toHaveBeenCalledWith("act-1");
  });

  it("displays scaleDownTitle when action.isScaledDown is true", () => {
    action1.toggleScaleDown();
    render(<DailySanctuaryView controller={mockController} />);

    expect(screen.getByText("Read 1 TypeScript type definition")).toBeInTheDocument();
    expect(screen.getByText(/disederhanakan|mode darurat/i)).toBeInTheDocument();
  });

  it("triggers handleOpenTimer when '⏱️ 2-Min Timer' is clicked", () => {
    render(<DailySanctuaryView controller={mockController} />);

    const timerButtons = screen.getAllByRole("button", { name: /timer|2-min/i });
    expect(timerButtons.length).toBeGreaterThan(0);
    fireEvent.click(timerButtons[0]);

    expect(mockController.handleOpenTimer).toHaveBeenCalledWith(action1);
  });

  it("triggers handleToggleComplete when checkbox is clicked", () => {
    render(<DailySanctuaryView controller={mockController} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(2);
    fireEvent.click(checkboxes[0]);

    expect(mockController.handleToggleComplete).toHaveBeenCalledWith("act-1");
  });

  it("renders DailyCompletionState when all actions are completed", () => {
    const completedAction1 = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Write 1 TypeScript interface",
      scaleDownTitle: "Read 1 type",
      estimatedMinutes: 2,
      isActiveToday: true,
      isCompletedToday: true,
    }).unwrap();

    const completedAction2 = MicroAction.create({
      id: "act-2",
      goalId: "goal-2",
      title: "Drink water",
      scaleDownTitle: "Sip water",
      estimatedMinutes: 1,
      isActiveToday: true,
      isCompletedToday: true,
    }).unwrap();

    const completedController = {
      ...mockController,
      actions: [completedAction1, completedAction2],
      allCompleted: true,
      completedCount: 2,
      totalCount: 2,
      progressPercentage: 100,
    };

    render(<DailySanctuaryView controller={completedController} />);

    expect(screen.getByRole("heading", { name: /semua fokus selesai/i })).toBeInTheDocument();
    expect(screen.getByText(/2 dari 2 selesai/i)).toBeInTheDocument();
  });

  it("renders empty state when there are no focus actions for today", () => {
    const emptyController = {
      ...mockController,
      actions: [],
      allCompleted: false,
      completedCount: 0,
      totalCount: 0,
      progressPercentage: 0,
    };

    render(<DailySanctuaryView controller={emptyController} />);
    expect(screen.getByRole("heading", { name: /belum ada fokus/i })).toBeInTheDocument();
  });
});
