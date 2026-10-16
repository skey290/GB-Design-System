import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Skeleton } from "./skeleton";
import styles from "./skeleton.module.css";

describe("Skeleton", () => {
  it("defaults to the rectangle shape", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveClass(styles.rectangle);
  });

  it.each(["rectangle", "text", "circle"] as const)(
    "renders the %s shape with its own class",
    (shape) => {
      render(<Skeleton shape={shape} data-testid="skeleton" />);

      expect(screen.getByTestId("skeleton")).toHaveClass(styles[shape]);
    },
  );

  it("is hidden from assistive tech by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
  });

  it("allows adding extra classes via className alongside the shape class", () => {
    render(
      <Skeleton
        shape="circle"
        className="size-[32px]"
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass(styles.circle);
    expect(skeleton.className).toContain("size-[32px]");
  });

  it("forwards additional props to the underlying div", () => {
    render(<Skeleton data-testid="custom-skeleton" />);

    expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
  });
});
