import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoListPanel } from "@/modules/todo/presentation/TodoListPanel";
import { TodoItem } from "@/modules/todo/domain/TodoItem";

describe("TodoListPanel Component", () => {
  const sampleTodo = TodoItem.create({
    id: "todo-1",
    title: "Membaca jurnal 10 menit",
    priority: "high",
    dueDate: "2026-10-01",
    isCompleted: false,
  }).unwrap();

  const createMockController = (overrides = {}) => ({
    todos: [sampleTodo],
    allTodos: [sampleTodo],
    activeTodosCount: 1,
    completedTodosCount: 0,
    filter: "all" as const,
    setFilter: vi.fn(),
    addTodo: vi.fn().mockResolvedValue(true),
    toggleCompleteTodo: vi.fn().mockResolvedValue(true),
    deleteTodo: vi.fn().mockResolvedValue(true),
    isLoading: false,
    error: null,
    refreshTodos: vi.fn(),
    ...overrides,
  });

  it("renders form, filter chips, and task list", () => {
    const controller = createMockController();
    render(<TodoListPanel controller={controller} />);

    expect(screen.getByPlaceholderText(/Tambah tugas baru\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText("Semua")).toBeInTheDocument();
    expect(screen.getByText("Aktif")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
    expect(screen.getByText("Membaca jurnal 10 menit")).toBeInTheDocument();
    expect(screen.getAllByText("Tinggi").length).toBeGreaterThanOrEqual(1);
  });

  it("submits a new task through addTodo", async () => {
    const controller = createMockController();
    render(<TodoListPanel controller={controller} />);

    const input = screen.getByPlaceholderText(/Tambah tugas baru\.\.\./i);
    fireEvent.change(input, { target: { value: "Tugas Baru Kaizen" } });

    // Select priority Rendah
    const lowPriorityBtn = screen.getByRole("radio", { name: "Rendah" });
    fireEvent.click(lowPriorityBtn);

    const submitBtn = screen.getByRole("button", { name: /Simpan tugas baru/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(controller.addTodo).toHaveBeenCalledWith({
        title: "Tugas Baru Kaizen",
        priority: "low",
        dueDate: null,
      });
    });
  });

  it("toggles task completion and deletes task", async () => {
    const controller = createMockController();
    render(<TodoListPanel controller={controller} />);

    const checkboxBtn = screen.getByRole("checkbox", {
      name: /Tandai "Membaca jurnal 10 menit" selesai/i,
    });
    fireEvent.click(checkboxBtn);
    expect(controller.toggleCompleteTodo).toHaveBeenCalledWith("todo-1");

    const deleteBtn = screen.getByRole("button", {
      name: /Hapus tugas Membaca jurnal 10 menit/i,
    });
    fireEvent.click(deleteBtn);
    expect(controller.deleteTodo).toHaveBeenCalledWith("todo-1");
  });
});
