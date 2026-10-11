import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Progress } from "./progress";

describe("Progress", () => {
  it("shows the in-progress label while below max", () => {
    render(<Progress value={10} />);

    expect(screen.getByText("Loading image..")).toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  it("switches to the completed label once value reaches max", () => {
    render(<Progress value={100} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByText("Loading image..")).not.toBeInTheDocument();
  });

  it("forwards the value to the underlying progress bar", () => {
    render(<Progress value={40} aria-label="업로드" />);

    const bar = screen.getByRole("progressbar", { name: "업로드" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("respects a custom max when deciding completion", () => {
    render(<Progress value={5} max={5} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("merges className onto the root", () => {
    const { container } = render(<Progress value={0} className="mt-4" />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild?.className).toContain("mt-4");
  });
});
