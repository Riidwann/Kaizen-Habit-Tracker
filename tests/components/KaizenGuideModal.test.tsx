import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KaizenGuideModal } from "@/components/layout/KaizenGuideModal";

describe("KaizenGuideModal", () => {
  it("does not render when isOpen is false", () => {
    render(<KaizenGuideModal isOpen={false} onClose={vi.fn()} />);
    expect(
      screen.queryByText(/Panduan Filosofi & Cara Penggunaan Kaizen/i)
    ).not.toBeInTheDocument();
  });

  it("renders when isOpen is true with 3 navigation sections", () => {
    render(<KaizenGuideModal isOpen={true} onClose={vi.fn()} />);

    expect(
      screen.getByText(/Panduan Filosofi & Cara Penggunaan Kaizen/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /1\. Apa Itu Kaizen\?/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2\. Alur 3 Langkah/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /3\. Fitur Utama & Aturan/i })).toBeInTheDocument();

    // Default active section shows Aturan 2 Menit
    expect(screen.getByText(/Aturan 2 Menit/i)).toBeInTheDocument();
  });

  it("switches tabs to show 3-step workflow and rules", () => {
    render(<KaizenGuideModal isOpen={true} onClose={vi.fn()} />);

    // Switch to Alur 3 Langkah
    const workflowTab = screen.getByRole("button", { name: /2\. Alur 3 Langkah/i });
    fireEvent.click(workflowTab);

    expect(screen.getByText(/Pohon Sasaran \(Goal Forge\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Fokus Harian \(Daily Sanctuary\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Refleksi Malam \(Hansei\)/i)).toBeInTheDocument();

    // Switch to Fitur Utama & Aturan
    const rulesTab = screen.getByRole("button", { name: /3\. Fitur Utama & Aturan/i });
    fireEvent.click(rulesTab);

    expect(screen.getByText(/Never Miss Twice/i)).toBeInTheDocument();
    expect(screen.getByText(/Tombol "Terlalu Berat\?"/i)).toBeInTheDocument();
  });

  it("calls onClose when 'Saya Mengerti' is clicked", () => {
    const handleClose = vi.fn();
    render(<KaizenGuideModal isOpen={true} onClose={handleClose} />);

    const understandBtn = screen.getByRole("button", { name: /Saya Mengerti/i });
    fireEvent.click(understandBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
