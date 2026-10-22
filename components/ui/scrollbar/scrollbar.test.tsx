import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Scrollbar } from "./scrollbar";
import styles from "./scrollbar.module.css";

describe("Scrollbar", () => {
  it("defaults to the thick thickness", () => {
    const { container } = render(<Scrollbar thumbTop={0} thumbHeight={50} />);

    expect(container.firstElementChild).toHaveClass(styles.track, styles.thick);
  });

  it.each(["thick", "thin"] as const)(
    "applies the %s thickness class",
    (thickness) => {
      const { container } = render(
        <Scrollbar thickness={thickness} thumbTop={0} thumbHeight={50} />,
      );

      expect(container.firstElementChild).toHaveClass(
        styles.track,
        styles[thickness],
      );
    },
  );

  it("positions the thumb from thumbTop/thumbHeight", () => {
    const { container } = render(<Scrollbar thumbTop={25} thumbHeight={40} />);

    const thumb = container.querySelector(`.${styles.thumb}`) as HTMLElement;
    expect(thumb.style.top).toBe("25%");
    expect(thumb.style.height).toBe("40%");
  });

  it("merges a caller className", () => {
    const { container } = render(
      <Scrollbar thumbTop={0} thumbHeight={100} className="shrink-0" />,
    );

    expect(container.firstElementChild?.className).toContain("shrink-0");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Scrollbar thumbTop={0} thumbHeight={100} />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards additional props to the track", () => {
    const { container } = render(
      <Scrollbar thumbTop={0} thumbHeight={100} data-testid="scroll-track" />,
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "scroll-track",
    );
  });

  it("forwards ref to the track", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Scrollbar ref={ref} thumbTop={0} thumbHeight={100} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
