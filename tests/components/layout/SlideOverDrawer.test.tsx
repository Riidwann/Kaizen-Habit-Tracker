import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlideOverDrawer } from "@/components/layout/SlideOverDrawer";

describe("SlideOverDrawer Component", () => {
  it("renders when isOpen is true with tabs and children", () => {
    const handleClose = vi.fn();
    const handleTabChange = vi.fn();

    render(
      <SlideOverDrawer
        isOpen={true}
        onClose={handleClose}
        activeTab="todo"
        onTabChange={handleTabChange}
        activeTodosCount={3}
        remainingRoutinesCount={1}
      >
        <div data-testid="drawer-child">Child Content</div>
      </SlideOverDrawer>
    );

    expect(screen.getByText("Akses Cepat")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-child")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    // Tab switching
    const routineTabBtn = screen.getByRole("tab", { name: /Jadwal Rutin/i });
    fireEvent.click(routineTabBtn);
    expect(handleTabChange).toHaveBeenCalledWith("routine");

    // Close button
    const closeBtn = screen.getByRole("button", { name: /Tutup panel/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("handles Escape key to close", () => {
    const handleClose = vi.fn();

    render(
      <SlideOverDrawer
        isOpen={true}
        onClose={handleClose}
        activeTab="todo"
        onTabChange={vi.fn()}
      >
        <div>Content</div>
      </SlideOverDrawer>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render content when isOpen is false", () => {
    render(
      <SlideOverDrawer
        isOpen={false}
        onClose={vi.fn()}
        activeTab="todo"
        onTabChange={vi.fn()}
      >
        <div data-testid="drawer-child">Hidden Content</div>
      </SlideOverDrawer>
    );

    expect(screen.queryByTestId("drawer-child")).not.toBeInTheDocument();
  });
});
