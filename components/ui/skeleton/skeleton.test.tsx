import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Skeleton } from "./skeleton";
import styles from "./skeleton.module.css";

describe("Skeleton", () => {
  it("defaults to the rectangle type", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveClass(styles.rectangle);
  });

  it.each(["rectangle", "text", "circle"] as const)(
    "renders the %s type with its own class",
    (type) => {
      render(<Skeleton type={type} data-testid="skeleton" />);

      expect(screen.getByTestId("skeleton")).toHaveClass(styles[type]);
    },
  );

  it("is hidden from assistive tech by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
  });

  it("allows adding extra classes via className alongside the shape class", () => {
    render(
      <Skeleton type="circle" className="size-[32px]" data-testid="skeleton" />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass(styles.circle);
    expect(skeleton.className).toContain("size-[32px]");
  });

  it("forwards additional props to the underlying div", () => {
    render(<Skeleton data-testid="custom-skeleton" />);

    expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
  });

  it("fills the container by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-fit-container",
      "true",
    );
  });

  it("keeps the fixed width when shouldFitContainer is false", () => {
    render(<Skeleton data-testid="skeleton" shouldFitContainer={false} />);

    expect(screen.getByTestId("skeleton")).not.toHaveAttribute(
      "data-fit-container",
    );
  });
});
