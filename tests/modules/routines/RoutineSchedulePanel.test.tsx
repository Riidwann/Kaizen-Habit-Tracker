import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RoutineSchedulePanel } from "@/modules/routines/presentation/RoutineSchedulePanel";
import { RoutineSchedule } from "@/modules/routines/domain/RoutineSchedule";

describe("RoutineSchedulePanel Component", () => {
  const sampleRoutine = RoutineSchedule.create({
    id: "routine-1",
    title: "Meditasi Pagi",
    time: "06:30",
    daysOfWeek: [1, 2, 3, 4, 5],
  }).unwrap();

  const createMockController = (overrides = {}) => ({
    routines: [sampleRoutine],
    allRoutines: [sampleRoutine],
    todayRoutines: [sampleRoutine],
    remainingCountToday: 1,
    completedCountToday: 0,
    addRoutine: vi.fn().mockResolvedValue(true),
    toggleCompleteToday: vi.fn().mockResolvedValue(true),
    deleteRoutine: vi.fn().mockResolvedValue(true),
    isLoading: false,
    error: null,
    refreshRoutines: vi.fn(),
    ...overrides,
  });

  it("renders form, day chips, and routine items", () => {
    const controller = createMockController();
    render(<RoutineSchedulePanel controller={controller} />);

    expect(
      screen.getByPlaceholderText(/Nama rutinitas \(cth: Minum air putih/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Hari Ini")).toBeInTheDocument();
    expect(screen.getByText("Semua Rutinitas")).toBeInTheDocument();
    expect(screen.getByText("Meditasi Pagi")).toBeInTheDocument();
    expect(screen.getByText("06:30")).toBeInTheDocument();
  });

  it("submits a new routine through addRoutine", async () => {
    const controller = createMockController();
    render(<RoutineSchedulePanel controller={controller} />);

    const input = screen.getByPlaceholderText(/Nama rutinitas/i);
    fireEvent.change(input, { target: { value: "Senam Pagi 15 Menit" } });

    const submitBtn = screen.getByRole("button", {
      name: /Simpan jadwal rutinitas/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(controller.addRoutine).toHaveBeenCalledWith({
        title: "Senam Pagi 15 Menit",
        time: "07:00",
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      });
    });
  });

  it("toggles recurring day chips when options button is clicked", () => {
    const controller = createMockController();
    render(<RoutineSchedulePanel controller={controller} />);
    const toggleBtn = screen.getByLabelText(/Atur hari pengulangan/i);
    expect(screen.queryByText("Pilih Hari")).not.toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Pilih Hari")).toBeInTheDocument();
  });

  it("toggles routine completion and deletes routine", async () => {
    const controller = createMockController();
    render(<RoutineSchedulePanel controller={controller} />);

    const checkboxBtn = screen.getByRole("checkbox", {
      name: /Tandai "Meditasi Pagi" selesai hari ini/i,
    });
    fireEvent.click(checkboxBtn);
    expect(controller.toggleCompleteToday).toHaveBeenCalledWith("routine-1");

    const deleteBtn = screen.getByRole("button", {
      name: /Hapus rutinitas Meditasi Pagi/i,
    });
    fireEvent.click(deleteBtn);
    expect(controller.deleteRoutine).toHaveBeenCalledWith("routine-1");
  });
});
