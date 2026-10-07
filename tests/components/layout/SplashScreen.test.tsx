import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SplashScreen } from "@/components/layout/SplashScreen";

describe("SplashScreen", () => {
  it("renders brand logo with centered monogram, wordmark, and tagline", () => {
    const { container } = render(<SplashScreen minDurationMs={1000} />);
    expect(screen.getByText("Kaizen")).toBeInTheDocument();
    expect(screen.getByText("Flow")).toBeInTheDocument();
    expect(screen.getByText(/1% BETTER EVERY DAY/i)).toBeInTheDocument();
    expect(container.querySelector("g[transform='translate(-3.8, 9.9)']")).toBeInTheDocument();
  });

  it("calls onComplete when user taps the screen to skip", async () => {
    const onComplete = vi.fn();
    render(<SplashScreen minDurationMs={5000} onComplete={onComplete} />);
    const container = screen.getByTestId("splash-screen");
    fireEvent.click(container);
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it("has accessible button role, aria-label, and tabIndex", () => {
    render(<SplashScreen minDurationMs={5000} />);
    const splash = screen.getByRole("button", { name: /tutup splash screen/i });
    expect(splash).toBeInTheDocument();
    expect(splash).toHaveAttribute("tabindex", "0");
  });

  it("calls onComplete when user presses Escape key", async () => {
    const onComplete = vi.fn();
    render(<SplashScreen minDurationMs={5000} onComplete={onComplete} />);
    const container = screen.getByRole("button", { name: /tutup splash screen/i });
    fireEvent.keyDown(container, { key: "Escape" });
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });
});
