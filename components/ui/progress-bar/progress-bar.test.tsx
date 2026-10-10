import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("defaults to value 0 with min 0 / max 100", () => {
    render(<ProgressBar aria-label="upload" />);

    const bar = screen.getByRole("progressbar", { name: "upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders the indicator width proportional to value", () => {
    render(<ProgressBar aria-label="upload" value={40} />);

    const bar = screen.getByRole("progressbar", { name: "upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");

    const indicator = bar.querySelector(
      '[data-slot="progress-bar-indicator"]',
    ) as HTMLElement;
    expect(indicator.style.width).toBe("40%");
  });

  it("clamps values above max to max", () => {
    render(<ProgressBar aria-label="upload" value={250} max={100} />);

    const bar = screen.getByRole("progressbar", { name: "upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps values below min to min", () => {
    render(<ProgressBar aria-label="upload" value={-20} min={0} />);

    const bar = screen.getByRole("progressbar", { name: "upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports a custom min/max range", () => {
    render(<ProgressBar aria-label="upload" value={150} min={100} max={200} />);

    const bar = screen.getByRole("progressbar", { name: "upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "150");
    expect(bar).toHaveAttribute("aria-valuemin", "100");
    expect(bar).toHaveAttribute("aria-valuemax", "200");

    const indicator = bar.querySelector(
      '[data-slot="progress-bar-indicator"]',
    ) as HTMLElement;
    // (150 - 100) / (200 - 100) = 50%
    expect(indicator.style.width).toBe("50%");
  });
});
