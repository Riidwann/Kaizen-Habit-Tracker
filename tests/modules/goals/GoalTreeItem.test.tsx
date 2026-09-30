import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalTreeItem } from "@/modules/goals/presentation/GoalTreeItem";
import { Goal } from "@/modules/goals/domain/Goal";
import { EmotionalAnchor } from "@/modules/goals/domain/EmotionalAnchor";
import { Milestone } from "@/modules/goals/domain/Milestone";

describe("GoalTreeItem - Achieved Status & Confirmation", () => {
  const createTestGoal = (status: "active" | "paused" | "achieved" = "active") => {
    const why = EmotionalAnchor.create("Build healthy body and mind").unwrap();
    const goal = Goal.create({
      id: "goal-test-1",
      title: "Olahraga Rutin 30 Hari",
      category: "health",
      whyStatement: why,
      microAction: "Pakai sepatu olahraga",
      scaleDownFallback: "Peregangan 1 menit",
    }).unwrap();

    const milestone = Milestone.create(goal.id, "Hari ke-7 berturut-turut", 1, "m-1").unwrap();
    goal.addMilestone(milestone);
    if (status !== "active") {
      goal.updateStatus(status);
    }
    return goal;
  };

  it("1. renders active goal with trophy button and clicking it opens confirmation modal", async () => {
    const goal = createTestGoal("active");
    const onUpdateStatus = vi.fn();
    const onToggleMilestone = vi.fn();
    const onAddMilestone = vi.fn();
    const onDeleteGoal = vi.fn();

    render(
      <GoalTreeItem
        goal={goal}
        onUpdateStatus={onUpdateStatus}
        onToggleMilestone={onToggleMilestone}
        onAddMilestone={onAddMilestone}
        onDeleteGoal={onDeleteGoal}
      />
    );

    // Initial state: status is active
    expect(screen.getByText("AKTIF")).toBeInTheDocument();

    // Click trophy button (Tandai Tercapai)
    const trophyBtn = screen.getByRole("button", { name: /Mark Achieved|Tandai Tercapai/i });
    fireEvent.click(trophyBtn);

    // Status should NOT be updated yet
    expect(onUpdateStatus).not.toHaveBeenCalled();

    // Confirmation modal should be visible
    expect(
      screen.getByRole("heading", { name: /Tandai "Olahraga Rutin 30 Hari" sebagai Tercapai\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selamat atas dedikasi dan konsistensi Anda!/i)
    ).toBeInTheDocument();
  });

  it("2. confirming modal marks goal as achieved and triggers celebration", async () => {
    const goal = createTestGoal("active");
    const onUpdateStatus = vi.fn();

    render(
      <GoalTreeItem
        goal={goal}
        onUpdateStatus={onUpdateStatus}
        onToggleMilestone={vi.fn()}
        onAddMilestone={vi.fn()}
        onDeleteGoal={vi.fn()}
      />
    );

    // Open confirmation
    const trophyBtn = screen.getByRole("button", { name: /Mark Achieved|Tandai Tercapai/i });
    fireEvent.click(trophyBtn);

    // Click confirm button
    const confirmBtn = screen.getByRole("button", { name: /Ya, Target Tercapai!/i });
    fireEvent.click(confirmBtn);

    // onUpdateStatus called with 'achieved'
    expect(onUpdateStatus).toHaveBeenCalledTimes(1);
    expect(onUpdateStatus).toHaveBeenCalledWith("goal-test-1", "achieved");
  });

  it("3. achieved goal renders prominent badge, celebration banner, and allows reactivating back to active", () => {
    const goal = createTestGoal("achieved");
    const onUpdateStatus = vi.fn();

    render(
      <GoalTreeItem
        goal={goal}
        onUpdateStatus={onUpdateStatus}
        onToggleMilestone={vi.fn()}
        onAddMilestone={vi.fn()}
        onDeleteGoal={vi.fn()}
      />
    );

    // Prominent celebratory badge
    expect(screen.getByText(/🏆 TERCAPAI/i)).toBeInTheDocument();

    // Celebratory banner
    expect(screen.getByText(/Target Telah Berhasil Tercapai!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Langkah-langkah kecil Anda telah membuahkan hasil nyata/i)
    ).toBeInTheDocument();

    // Revert button in celebration banner
    const revertBannerBtn = screen.getByRole("button", { name: /Buka Kembali Target/i });
    fireEvent.click(revertBannerBtn);

    expect(onUpdateStatus).toHaveBeenCalledWith("goal-test-1", "active");

    // Quick action revert button in header row
    const quickRevertBtn = screen.getByRole("button", { name: /Kembalikan ke Status Aktif/i });
    fireEvent.click(quickRevertBtn);

    expect(onUpdateStatus).toHaveBeenCalledWith("goal-test-1", "active");
  });
});

describe("GoalTreeItem Milestone Delete Button", () => {
  it("renders milestone delete button without hidden opacity classes", () => {
    const goal = Goal.create({
      title: "Test Goal",
      category: "health",
      whyStatement: EmotionalAnchor.create("Health is wealth").unwrap(),
      milestones: [Milestone.create("goal-1", "Milestone 1", 1).unwrap()],
    }).unwrap();

    render(
      <GoalTreeItem
        goal={goal}
        onToggleMilestone={vi.fn()}
        onAddMilestone={vi.fn()}
        onDeleteMilestone={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDeleteGoal={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText("Delete milestone Milestone 1");
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn.className).not.toContain("opacity-0");
  });
});

