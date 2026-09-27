import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoalManagerView } from "@/modules/goals/presentation/GoalManagerView";
import { Goal } from "@/modules/goals/domain/Goal";
import { EmotionalAnchor } from "@/modules/goals/domain/EmotionalAnchor";
import { Milestone } from "@/modules/goals/domain/Milestone";

describe("GoalManagerView", () => {
  const why = EmotionalAnchor.create("Build mental clarity").unwrap();
  const sampleGoal = Goal.create({
    id: "goal-1",
    title: "Meditate 100 Days",
    category: "mindset",
    whyStatement: why,
    microAction: "Sit for 1 breath",
    scaleDownFallback: "Hand on heart for 3 seconds",
  }).unwrap();

  const milestone = Milestone.create(sampleGoal.id, "Complete 7 days", 1, "m-1").unwrap();
  sampleGoal.addMilestone(milestone);

  const mockController = {
    goals: [sampleGoal],
    filteredGoals: [sampleGoal],
    isLoading: false,
    error: null,
    isForgeOpen: false,
    openForgeModal: vi.fn(),
    closeForgeModal: vi.fn(),
    createGoal: vi.fn().mockResolvedValue(true),
    deleteGoal: vi.fn().mockResolvedValue(true),
    updateGoalStatus: vi.fn().mockResolvedValue(true),
    toggleMilestone: vi.fn().mockResolvedValue(true),
    addMilestone: vi.fn().mockResolvedValue(true),
    deleteMilestone: vi.fn().mockResolvedValue(true),
    filterCategory: "all" as const,
    setFilterCategory: vi.fn(),
    filterStatus: "all" as const,
    setFilterStatus: vi.fn(),
    refreshGoals: vi.fn().mockResolvedValue(undefined),
  };

  it("renders header and master goals with tree items", () => {
    render(<GoalManagerView controller={mockController} />);

    expect(screen.getByText(/goal forge & decomposition/i)).toBeInTheDocument();
    expect(screen.getByText("Meditate 100 Days")).toBeInTheDocument();
    expect(screen.getByText(/build mental clarity/i)).toBeInTheDocument();
    expect(screen.getByText(/sit for 1 breath/i)).toBeInTheDocument();
    expect(screen.getByText(/hand on heart for 3 seconds/i)).toBeInTheDocument();
    expect(screen.getByText("Complete 7 days")).toBeInTheDocument();
  });

  it("handles openForgeModal when clicking Forge New Goal", () => {
    render(<GoalManagerView controller={mockController} />);

    const forgeBtn = screen.getByRole("button", { name: /forge new goal/i });
    fireEvent.click(forgeBtn);

    expect(mockController.openForgeModal).toHaveBeenCalled();
  });

  it("renders empty state when filteredGoals is empty", () => {
    const emptyController = {
      ...mockController,
      goals: [],
      filteredGoals: [],
    };

    render(<GoalManagerView controller={emptyController} />);

    expect(screen.getByText(/no goals forged yet/i)).toBeInTheDocument();
  });

  it("triggers category filter when category buttons are clicked", () => {
    render(<GoalManagerView controller={mockController} />);

    const mindsetBtn = screen.getByRole("button", { name: /mindset/i });
    fireEvent.click(mindsetBtn);

    expect(mockController.setFilterCategory).toHaveBeenCalledWith("mindset");
  });

  it("triggers toggleMilestone when milestone checkbox is clicked", () => {
    render(<GoalManagerView controller={mockController} />);

    const toggleBtn = screen.getByLabelText(/toggle completion for complete 7 days/i);
    fireEvent.click(toggleBtn);

    expect(mockController.toggleMilestone).toHaveBeenCalledWith("goal-1", "m-1");
  });
});
