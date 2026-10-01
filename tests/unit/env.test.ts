import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import nextConfig from "../../next.config.mjs";

describe("Environment & Test Runner Verification", () => {
  it("verifies basic arithmetic and Kaizen 1% formula", () => {
    expect(1 + 1).toBe(2);
    // Kaizen 1% daily improvement: 1.01^365 ≈ 37.78
    const compoundGrowth = Math.pow(1.01, 365);
    expect(compoundGrowth).toBeGreaterThan(37);
  });

  it("verifies React component DOM rendering and jest-dom matchers", () => {
    render(
      React.createElement(
        "div",
        {
          "data-testid": "zen-box",
          className: "p-4 bg-sand-100 text-charcoal-900",
        },
        "KaizenFlow Environment Ready"
      )
    );

    const element = screen.getByTestId("zen-box");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("KaizenFlow Environment Ready");
    expect(element).toHaveClass("bg-sand-100");
  });
});

describe("Environment & Next.js Configuration", () => {
  it("should configure optimizePackageImports for lucide-react", () => {
    expect(nextConfig.experimental?.optimizePackageImports).toContain("lucide-react");
  });
});
