import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalForgeWizard } from "@/modules/goals/presentation/GoalForgeWizard";

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
});
