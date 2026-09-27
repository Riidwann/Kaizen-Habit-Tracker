import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Button, Card, Modal, Badge, Input, Textarea } from "@/shared/presentation";
import { Sparkles } from "lucide-react";

describe("Zen UI Kit", () => {
  describe("Button", () => {
    it("renders label and handles click", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Focus Now</Button>);

      const btn = screen.getByRole("button", { name: /focus now/i });
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies primary and emergency variants", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      let btn = screen.getByRole("button", { name: /primary/i });
      expect(btn.className).toContain("bg-sage-600");

      rerender(<Button variant="emergency">Emergency</Button>);
      btn = screen.getByRole("button", { name: /emergency/i });
      expect(btn.className).toContain("bg-amber-600");
    });

    it("supports disabled and loading states", () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );

      const btn = screen.getByRole("button", { name: /disabled button/i });
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();

      rerender(
        <Button isLoading onClick={handleClick}>
          Loading Button
        </Button>
      );
      const loadingBtn = screen.getByRole("button");
      expect(loadingBtn).toBeDisabled();
      fireEvent.click(loadingBtn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders icons if provided", () => {
      render(
        <Button leftIcon={<Sparkles data-testid="left-icon" />}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });
  });

  describe("Card", () => {
    it("renders content with clean zen styling", () => {
      render(
        <Card data-testid="zen-card" padding="lg">
          <h3>Daily Focus</h3>
          <p>Micro actions for today</p>
        </Card>
      );

      const card = screen.getByTestId("zen-card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent("Daily Focus");
      expect(card.className).toContain("rounded-2xl");
      expect(card.className).toContain("p-6");
    });
  });

  describe("Modal", () => {
    it("renders content when isOpen is true and unmounts when false", async () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Focus Mode">
          <p>Timer content</p>
        </Modal>
      );

      expect(screen.getByText("Focus Mode")).toBeInTheDocument();
      expect(screen.getByText("Timer content")).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={vi.fn()} title="Focus Mode">
          <p>Timer content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.queryByText("Focus Mode")).not.toBeInTheDocument();
      });
    });

    it("triggers onClose when clicking close button", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Breakdown Goal">
          <p>Modal Body</p>
        </Modal>
      );

      const closeBtn = screen.getByRole("button", { name: /close dialog/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("triggers onClose on Escape key press", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Escape Test">
          <p>Modal Body</p>
        </Modal>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Badge", () => {
    it("renders badge with correct variant colors", () => {
      const { rerender } = render(<Badge variant="sage">Active Habit</Badge>);
      let badge = screen.getByText("Active Habit");
      expect(badge.className).toContain("bg-sage-100");
      expect(badge.className).toContain("rounded-full");

      rerender(<Badge variant="amber">2 min</Badge>);
      badge = screen.getByText("2 min");
      expect(badge.className).toContain("bg-amber-100");
    });
  });

  describe("Input & Textarea", () => {
    it("renders input with label, error, and handles change", () => {
      const handleChange = vi.fn();
      render(
        <Input
          label="Habit Name"
          placeholder="e.g. 1 push-up"
          value="Meditate"
          onChange={handleChange}
          error="Name is required"
        />
      );

      expect(screen.getByLabelText(/habit name/i)).toBeInTheDocument();
      const input = screen.getByPlaceholderText(/e.g. 1 push-up/i);
      expect(input).toHaveValue("Meditate");
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "Read 1 page" } });
      expect(handleChange).toHaveBeenCalled();
    });

    it("renders textarea correctly", () => {
      render(
        <Textarea
          label="Reflection Note"
          placeholder="How did it feel?"
          defaultValue="Felt calm and present."
        />
      );

      expect(screen.getByLabelText(/reflection note/i)).toBeInTheDocument();
      const textarea = screen.getByPlaceholderText(/how did it feel\?/i);
      expect(textarea).toHaveValue("Felt calm and present.");
    });
  });
});
