import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SelfRewardBanner } from "@/modules/rewards/presentation/SelfRewardBanner";
import { SelfReward } from "@/modules/rewards/domain/SelfReward";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("SelfRewardBanner", () => {
  const sampleReward = SelfReward.create({
    title: "Traktir es krim favorit",
    targetStreak: 7,
    status: "earned",
  }).unwrap();

  it("renders nothing when isEarned is false", () => {
    const { container } = render(
      <SelfRewardBanner
        reward={sampleReward}
        isEarned={false}
        onClaim={vi.fn()}
        onUpdateTitle={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders celebration banner when isEarned is true", () => {
    render(
      <SelfRewardBanner
        reward={sampleReward}
        isEarned={true}
        onClaim={vi.fn()}
        onUpdateTitle={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Luar Biasa! Konsistensi 7 Hari Tercapai!/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Traktir es krim favorit/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Klaim & Nikmati Hadiah/i })
    ).toBeInTheDocument();
  });

  it("allows editing the reward title", async () => {
    const onUpdateTitle = vi.fn().mockResolvedValue(true);
    render(
      <SelfRewardBanner
        reward={sampleReward}
        isEarned={true}
        onClaim={vi.fn()}
        onUpdateTitle={onUpdateTitle}
      />
    );

    const editBtn = screen.getByRole("button", { name: /Ubah rencana apresiasi diri/i });
    act(() => {
      fireEvent.click(editBtn);
    });

    const input = screen.getByDisplayValue("Traktir es krim favorit");
    act(() => {
      fireEvent.change(input, { target: { value: "Liburan singkat ke pantai" } });
    });

    const saveBtn = screen.getByRole("button", { name: /Simpan perubahan nama hadiah/i });
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(onUpdateTitle).toHaveBeenCalledWith("Liburan singkat ke pantai");
  });

  it("calls onClaim when user clicks Klaim & Nikmati Hadiah", async () => {
    const onClaim = vi.fn().mockResolvedValue(true);
    render(
      <SelfRewardBanner
        reward={sampleReward}
        isEarned={true}
        onClaim={onClaim}
        onUpdateTitle={vi.fn()}
      />
    );

    const claimBtn = screen.getByRole("button", { name: /Klaim & Nikmati Hadiah/i });
    await act(async () => {
      fireEvent.click(claimBtn);
    });

    expect(onClaim).toHaveBeenCalled();
  });
});
