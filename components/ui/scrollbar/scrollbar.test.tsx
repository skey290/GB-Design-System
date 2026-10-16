import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Scrollbar } from "./scrollbar";
import styles from "./scrollbar.module.css";

describe("Scrollbar", () => {
  it("renders its children", () => {
    render(
      <Scrollbar>
        <p>Scrollable content</p>
      </Scrollbar>,
    );

    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("defaults to the thick thickness", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);

    expect(container.firstElementChild).toHaveClass(styles.root, styles.thick);
  });

  it.each(["thick", "thin"] as const)(
    "applies the %s thickness class (track/thumb color, pill radius, scrollbar-width — see Storybook)",
    (thickness) => {
      const { container } = render(
        <Scrollbar thickness={thickness}>content</Scrollbar>,
      );

      expect(container.firstElementChild).toHaveClass(
        styles.root,
        styles[thickness],
      );
    },
  );

  it("merges a caller className", () => {
    const { container } = render(
      <Scrollbar className="h-[200px]">content</Scrollbar>,
    );

    expect(container.firstElementChild?.className).toContain("h-[200px]");
  });

  it("forwards additional props to the scroll container", () => {
    render(<Scrollbar data-testid="scroll-area">content</Scrollbar>);

    expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
  });

  it("forwards ref to the scroll container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Scrollbar ref={ref}>content</Scrollbar>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
