import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ActionTimerModal } from "@/modules/sanctuary/presentation/ActionTimerModal";
import { MicroAction } from "@/modules/sanctuary/domain/MicroAction";

describe("ActionTimerModal", () => {
  let sampleAction: MicroAction;
  let mockOnComplete: ReturnType<typeof vi.fn>;
  let mockOnClose: ReturnType<typeof vi.fn>;
  let mockWebAudio: any;

  beforeEach(() => {
    vi.useFakeTimers();

    sampleAction = MicroAction.create({
      id: "act-1",
      goalId: "goal-1",
      title: "Write 1 sentence",
      scaleDownTitle: "Open notebook",
      estimatedMinutes: 2,
    }).unwrap();

    mockOnComplete = vi.fn();
    mockOnClose = vi.fn();
    mockWebAudio = {
      playCompletionChime: vi.fn(),
      playSuccessChime: vi.fn(),
      playChime: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders when isOpen is true with action title and initial 02:00 countdown", () => {
    render(
      <ActionTimerModal
        isOpen={true}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    expect(screen.getByText("Write 1 sentence")).toBeInTheDocument();
    expect(screen.getByText("02:00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mulai|start|play/i })).toBeInTheDocument();
  });

  it("does not render dialog content when isOpen is false", () => {
    render(
      <ActionTimerModal
        isOpen={false}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    expect(screen.queryByText("Write 1 sentence")).not.toBeInTheDocument();
  });

  it("toggles play and pause on timer", () => {
    render(
      <ActionTimerModal
        isOpen={true}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    const playBtn = screen.getByRole("button", { name: /mulai|start|play/i });
    fireEvent.click(playBtn);

    // Advance 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("01:57")).toBeInTheDocument();

    // Now button should be Pause
    const pauseBtn = screen.getByRole("button", { name: /jeda|pause/i });
    fireEvent.click(pauseBtn);

    // Advance 2 more seconds while paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Remains 01:57
    expect(screen.getByText("01:57")).toBeInTheDocument();
  });

  it("resets timer back to 02:00 when reset button is clicked", () => {
    render(
      <ActionTimerModal
        isOpen={true}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    const playBtn = screen.getByRole("button", { name: /mulai|start|play/i });
    fireEvent.click(playBtn);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText("01:50")).toBeInTheDocument();

    const resetBtn = screen.getByRole("button", { name: /reset|ulang/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText("02:00")).toBeInTheDocument();
  });

  it("plays chime sound and invokes onComplete when countdown reaches 00:00", () => {
    render(
      <ActionTimerModal
        isOpen={true}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    const playBtn = screen.getByRole("button", { name: /mulai|start|play/i });
    fireEvent.click(playBtn);

    // Advance full 120 seconds
    act(() => {
      vi.advanceTimersByTime(120000);
    });

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(mockWebAudio.playCompletionChime).toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalledWith("act-1");
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <ActionTimerModal
        isOpen={true}
        onClose={mockOnClose}
        action={sampleAction}
        onComplete={mockOnComplete}
        webAudioService={mockWebAudio}
      />
    );

    const closeBtn = screen.getByLabelText(/close dialog/i);
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
