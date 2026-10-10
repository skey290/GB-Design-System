import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("defaults to the rectangle shape", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain(
      "rounded-[var(--gb-radius-scale-2xl)]",
    );
  });

  it.each([
    ["rectangle", "rounded-[var(--gb-radius-scale-2xl)]"],
    ["text", "rounded-[var(--gb-radius-scale-md)]"],
    ["circle", "rounded-[var(--gb-radius-scale-full)]"],
  ] as const)(
    "renders the %s shape with expected classes",
    (shape, expectedClass) => {
      render(<Skeleton shape={shape} data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton.className).toContain(expectedClass);
    },
  );

  it("applies the infinite shimmer animation class", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain(
      "animate-[shimmer_2s_ease-in-out_infinite]",
    );
  });

  it("is hidden from assistive tech by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
  });

  it("allows overriding size/shape classes via className", () => {
    render(
      <Skeleton
        shape="circle"
        className="size-[32px]"
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("size-[32px]");
    expect(skeleton.className).not.toContain("size-[27px]");
  });

  it("forwards additional props to the underlying div", () => {
    render(<Skeleton data-testid="custom-skeleton" />);

    expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
  });
});
