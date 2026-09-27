import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataBackupModal } from "@/modules/backup/presentation/DataBackupModal";
import { BackupController } from "@/modules/backup/presentation/useBackupController";

describe("DataBackupModal", () => {
  let mockController: BackupController;
  let mockOnClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockController = {
      isExporting: false,
      isImporting: false,
      isLoadingSample: false,
      isClearing: false,
      statusMessage: null,
      errorMessage: null,
      lastExportedAt: null,
      handleExport: vi.fn().mockResolvedValue(true),
      handleImportFile: vi.fn().mockResolvedValue(true),
      handleImportJsonString: vi.fn().mockResolvedValue(true),
      handleLoadSampleData: vi.fn().mockResolvedValue(true),
      handleClearAllData: vi.fn().mockResolvedValue(true),
      clearMessages: vi.fn(),
    };
  });

  it("does not render modal when isOpen is false", () => {
    render(
      <DataBackupModal
        isOpen={false}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    expect(screen.queryByText(/Cadangan/i)).not.toBeInTheDocument();
  });

  it("renders export, import, sample data, and reset sections when isOpen is true", () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    // Modal title
    expect(screen.getByRole("heading", { name: /Manajemen Data & Cadangan/i })).toBeInTheDocument();

    // Export button
    expect(screen.getByRole("button", { name: /Unduh Cadangan JSON/i })).toBeInTheDocument();

    // Import file button / input
    expect(screen.getByText(/Pulihkan Cadangan/i)).toBeInTheDocument();

    // Sample data button
    expect(screen.getByRole("button", { name: /Muat Contoh Data/i })).toBeInTheDocument();

    // Reset button
    expect(screen.getByRole("button", { name: /Reset Semua Data/i })).toBeInTheDocument();
  });

  it("calls handleExport when clicking 'Unduh Cadangan JSON'", async () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    const exportBtn = screen.getByRole("button", { name: /Unduh Cadangan JSON/i });
    fireEvent.click(exportBtn);

    expect(mockController.handleExport).toHaveBeenCalledTimes(1);
  });

  it("calls handleImportFile when a JSON file is selected via input", async () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    const fileInput = screen.getByTestId("backup-file-input") as HTMLInputElement;
    const testFile = new File(['{"version":"1.0.0"}'], "backup.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(mockController.handleImportFile).toHaveBeenCalledWith(testFile);
    });
  });

  it("calls handleLoadSampleData when clicking 'Muat Contoh Data'", async () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    const sampleBtn = screen.getByRole("button", { name: /Muat Contoh Data/i });
    fireEvent.click(sampleBtn);

    expect(mockController.handleLoadSampleData).toHaveBeenCalledTimes(1);
  });

  it("requires confirmation before triggering handleClearAllData", async () => {
    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    const resetBtn = screen.getByRole("button", { name: /Reset Semua Data/i });
    fireEvent.click(resetBtn);

    // Initial click should ask for confirmation, not immediately clear
    expect(mockController.handleClearAllData).not.toHaveBeenCalled();

    // Confirmation button should now appear
    const confirmBtn = screen.getByRole("button", { name: /Yakin Hapus Semua Data\?/i });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(mockController.handleClearAllData).toHaveBeenCalledTimes(1);
    });
  });

  it("displays statusMessage and errorMessage alerts when provided", () => {
    mockController.statusMessage = "Data cadangan berhasil dipulihkan!";
    mockController.errorMessage = "Format file tidak valid";

    render(
      <DataBackupModal
        isOpen={true}
        onClose={mockOnClose}
        controller={mockController}
      />
    );

    expect(screen.getByText("Data cadangan berhasil dipulihkan!")).toBeInTheDocument();
    expect(screen.getByText("Format file tidak valid")).toBeInTheDocument();
  });
});
