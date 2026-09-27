import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HanseiModal } from "@/modules/reflection/presentation/HanseiModal";

describe("HanseiModal", () => {
  let mockOnClose: ReturnType<typeof vi.fn>;
  let mockOnSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnSubmit = vi.fn();
  });

  it("does not render when isOpen is false", () => {
    render(
      <HanseiModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText(/Hansei/i)).not.toBeInTheDocument();
  });

  it("renders with night zen theme and guidance prompts when isOpen is true", () => {
    render(
      <HanseiModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Header / Zen title
    expect(screen.getByRole("heading", { name: /Hansei/i })).toBeInTheDocument();

    // Guidance prompts
    expect(
      screen.getByText(/1 hal kecil yang berhasil saya lakukan hari ini/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1 penyesuaian 1% untuk esok hari/i)
    ).toBeInTheDocument();

    // Save button
    expect(
      screen.getByRole("button", { name: /simpan|selesai|save/i })
    ).toBeInTheDocument();
  });

  it("allows user to input micro-win and 1% adjustment and triggers onSubmit", async () => {
    render(
      <HanseiModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const winInput = screen.getByPlaceholderText(/1 hal kecil|contoh: berjalan 2 menit/i);
    const adjustmentInput = screen.getByPlaceholderText(/1 penyesuaian|contoh: siapkan sepatu/i);

    fireEvent.change(winInput, {
      target: { value: "Membaca 1 halaman buku" },
    });
    fireEvent.change(adjustmentInput, {
      target: { value: "Letakkan buku di atas meja tidur" },
    });

    const submitBtn = screen.getByRole("button", { name: /simpan|selesai|save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        winOfTheDay: "Membaca 1 halaman buku",
        tomorrowAdjustment: "Letakkan buku di atas meja tidur",
      });
    });
  });

  it("prevents submission if inputs are empty or whitespace only", () => {
    render(
      <HanseiModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /simpan|selesai|save/i });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onClose when close or cancel button is clicked", () => {
    render(
      <HanseiModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeBtn = screen.getByLabelText(/close dialog|tutup/i);
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("pre-fills inputs if initial values are provided", () => {
    render(
      <HanseiModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialWin="Minum segelas air putih"
        initialAdjustment="Siapkan botol air di samping tempat tidur"
      />
    );

    expect(screen.getByDisplayValue("Minum segelas air putih")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Siapkan botol air di samping tempat tidur")).toBeInTheDocument();
  });
});
