import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabNavigation } from "@/components/layout/TabNavigation";

describe("TabNavigation (3 Zen Tabs)", () => {
  it("renders exactly 3 tabs: Hari Ini, Target, and Kemajuan", () => {
    const handleTabChange = vi.fn();
    render(<TabNavigation activeTab="sanctuary" onTabChange={handleTabChange} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);

    expect(screen.getByRole("tab", { name: /Hari Ini/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Target/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Kemajuan/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /Cadangan/i })).not.toBeInTheDocument();
  });

  it("calls onTabChange when a tab is clicked", () => {
    const handleTabChange = vi.fn();
    render(<TabNavigation activeTab="sanctuary" onTabChange={handleTabChange} />);

    const targetTab = screen.getByRole("tab", { name: /Target/i });
    fireEvent.click(targetTab);

    expect(handleTabChange).toHaveBeenCalledWith("goals");
  });

  it("is memoized with React.memo and has displayName", () => {
    expect(TabNavigation.displayName).toBe("TabNavigation");
    expect((TabNavigation as any).$$typeof).toBe(Symbol.for("react.memo"));
  });
});

