import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalForgeWizard } from "@/modules/goals/presentation/GoalForgeWizard";
import { Goal } from "@/modules/goals/domain/Goal";
import { EmotionalAnchor } from "@/modules/goals/domain/EmotionalAnchor";
import { Milestone } from "@/modules/goals/domain/Milestone";

describe("GoalForgeWizard", () => {
  it("renders when isOpen is true and shows Step 1 inputs", () => {
    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText(/goal forge|buat target/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vision title|nama target/i)).toBeInTheDocument();
    expect(screen.getByText(/health/i)).toBeInTheDocument();
    expect(screen.getByText(/mindset/i)).toBeInTheDocument();
  });

  it("prevents proceeding to Step 2 if vision title is empty", async () => {
    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    // Should still be on Step 1 and show error or stay on step 1
    expect(screen.getByLabelText(/vision title|nama target/i)).toBeInTheDocument();
    expect(screen.queryByText(/why is this deeply important for you|mengapa target ini/i)).not.toBeInTheDocument();
  });

  it("navigates through all 4 steps and submits complete goal data", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(true);
    const handleClose = vi.fn();

    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    // --- STEP 1: Vision & Category ---
    const titleInput = screen.getByLabelText(/vision title|nama target/i);
    fireEvent.change(titleInput, { target: { value: "Build Mindful Daily Routine" } });
    
    // Select Category (e.g. Mindset)
    const mindsetCategoryBtn = screen.getByRole("button", { name: /mindset/i });
    fireEvent.click(mindsetCategoryBtn);

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    // --- STEP 2: The Emotional Anchor (Why) ---
    expect(await screen.findByText(/why is this deeply important for you|mengapa target ini/i)).toBeInTheDocument();
    const whyInput = screen.getByLabelText(/the why|motivasi utama/i);
    fireEvent.change(whyInput, { target: { value: "To stay centered, reduce anxiety, and feel fulfilled" } });

    // Test back button
    const backBtn = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backBtn);
    expect(screen.getByLabelText(/vision title|nama target/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Build Mindful Daily Routine")).toBeInTheDocument();

    // Go forward again
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(await screen.findByText(/why is this deeply important for you|mengapa target ini/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // --- STEP 3: First Milestone ---
    const milestoneInput = await screen.findByLabelText(/milestone title|tonggak pencapaian/i);
    expect(milestoneInput).toBeInTheDocument();
    fireEvent.change(milestoneInput, { target: { value: "Complete 7 days unbroken streak" } });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // --- STEP 4: Micro-Action & Emergency Scale-Down ---
    const microActionInput = await screen.findByLabelText(/starter micro-action|langkah kecil awal/i);
    expect(microActionInput).toBeInTheDocument();
    fireEvent.change(microActionInput, { target: { value: "Sit on cushion for 1 breath" } });

    const fallbackInput = screen.getByLabelText(/emergency fallback|versi ringan/i);
    fireEvent.change(fallbackInput, { target: { value: "Take 3 deep breaths in bed" } });

    // Submit
    const forgeBtn = screen.getByRole("button", { name: /forge goal|simpan target/i });
    fireEvent.click(forgeBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Build Mindful Daily Routine",
      category: "mindset",
      whyText: "To stay centered, reduce anxiety, and feel fulfilled",
      firstMilestoneTitle: "Complete 7 days unbroken streak",
      microAction: "Sit on cushion for 1 breath",
      scaleDownFallback: "Take 3 deep breaths in bed",
    });
  });

  it("supports inline custom category creation", async () => {
    const handleAddCategory = vi.fn().mockResolvedValue(true);

    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        onAddCategory={handleAddCategory}
      />
    );

    const addCatBtn = screen.getByRole("button", { name: /\+ kategori baru/i });
    fireEvent.click(addCatBtn);

    const nameInput = screen.getByLabelText(/nama kategori/i);
    fireEvent.change(nameInput, { target: { value: "Finance" } });

    const saveBtn = screen.getByRole("button", { name: /simpan kategori/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleAddCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "Finance",
          isCustom: true,
        })
      );
    });
  });

  it("supports deleting custom categories", async () => {
    const handleDeleteCategory = vi.fn().mockResolvedValue(true);
    const customCats = [
      {
        id: "finance",
        label: "Finance",
        badgeVariant: "amber" as const,
        colorClass: "text-amber-800",
        pastelBg: "bg-amber-50",
        borderColor: "border-amber-200",
        iconName: "Tag",
        description: "Finance",
        isCustom: true,
      },
    ];

    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        categories={customCats}
        onDeleteCategory={handleDeleteCategory}
      />
    );

    const deleteBtn = screen.getByLabelText(/hapus kategori finance/i);
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(handleDeleteCategory).toHaveBeenCalledWith("finance");
    });
  });

  it("pre-fills fields and updates header and submit button in edit mode", async () => {
    const goal = Goal.create({
      title: "Master Japanese N3",
      category: "learning",
      whyStatement: EmotionalAnchor.create("To study in Kyoto").unwrap(),
      microAction: "Review 5 kanji cards",
      scaleDownFallback: "Review 1 kanji card",
      milestones: [Milestone.create("goal-1", "Pass N4", 1).unwrap()],
    }).unwrap();

    const handleSubmit = vi.fn();

    render(
      <GoalForgeWizard
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
        initialGoal={goal}
      />
    );

    // Header says "Edit Target: {title}"
    expect(screen.getByText("Edit Target: Master Japanese N3")).toBeInTheDocument();

    // Input prefilled with title
    const titleInput = screen.getByDisplayValue("Master Japanese N3");
    expect(titleInput).toBeInTheDocument();

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 2: whyText prefilled
    expect(screen.getByDisplayValue("To study in Kyoto")).toBeInTheDocument();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 3: milestones list visible
    expect(screen.getByText(/Kelola Tonggak Pencapaian/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pass N4")).toBeInTheDocument();

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 4: micro action & fallback prefilled
    expect(screen.getByDisplayValue("Review 5 kanji cards")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Review 1 kanji card")).toBeInTheDocument();

    // Submit button says "Simpan Perubahan"
    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Master Japanese N3",
          category: "learning",
          whyText: "To study in Kyoto",
          microAction: "Review 5 kanji cards",
          scaleDownFallback: "Review 1 kanji card",
          milestones: ["Pass N4"],
        })
      );
    });
  });
});
