import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SplashScreen } from "@/components/layout/SplashScreen";

describe("SplashScreen", () => {
  it("renders brand logo, wordmark, and tagline", () => {
    render(<SplashScreen minDurationMs={1000} />);
    expect(screen.getByText("Kaizen")).toBeInTheDocument();
    expect(screen.getByText("Flow")).toBeInTheDocument();
    expect(screen.getByText(/1% BETTER EVERY DAY/i)).toBeInTheDocument();
  });

  it("calls onComplete when user taps the screen to skip", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<SplashScreen minDurationMs={5000} onComplete={onComplete} />);
    const container = screen.getByTestId("splash-screen");
    fireEvent.click(container);
    vi.advanceTimersByTime(350);
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
