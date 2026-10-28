import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { SelfSlot } from "./self-slot";
import styles from "./self-slot.module.css";

const PERSONA = { name: "Data Scientist", initials: "DS" };

describe("SelfSlot", () => {
  it("renders the persona as an image-role avatar", () => {
    render(<SelfSlot persona={PERSONA} />);

    expect(
      screen.getByRole("img", { name: "Data Scientist" }),
    ).toBeInTheDocument();
  });

  it("renders the empty slot with the No Self placeholder", () => {
    render(<SelfSlot persona={null} />);

    const slot = screen.getByRole("img", { name: "No Self" });
    expect(slot).toBeInTheDocument();
    expect(slot).toHaveClass(styles.emptyRoot);
    expect(slot).not.toHaveAttribute("data-active");
  });

  it("keeps the highlight ring mounted (transparent) when inactive", () => {
    const { container } = render(<SelfSlot persona={PERSONA} />);

    const ring = container.querySelector(`.${styles.ring}`);
    expect(ring).not.toHaveAttribute("data-active");
  });

  it("turns the highlight ring on when active", () => {
    const { container } = render(
      <SelfSlot persona={PERSONA} status="active" />,
    );

    const ring = container.querySelector(`.${styles.ring}`);
    expect(ring).toHaveAttribute("data-active");
  });

  it("blurs the avatar only when active", () => {
    const { rerender } = render(<SelfSlot persona={PERSONA} />);
    expect(
      screen.getByRole("img", { name: "Data Scientist" }),
    ).not.toHaveAttribute("data-active");

    rerender(<SelfSlot persona={PERSONA} status="active" />);
    expect(screen.getByRole("img", { name: "Data Scientist" })).toHaveAttribute(
      "data-active",
    );
  });

  it("fills the empty slot's background only when active", () => {
    const { rerender } = render(<SelfSlot persona={null} />);
    expect(screen.getByRole("img", { name: "No Self" })).not.toHaveAttribute(
      "data-active",
    );

    rerender(<SelfSlot persona={null} status="active" />);
    expect(screen.getByRole("img", { name: "No Self" })).toHaveAttribute(
      "data-active",
    );
  });

  it("replaces the dashed border with a solid white one when active, instead of layering both", () => {
    render(<SelfSlot persona={null} status="active" />);

    const slot = screen.getByRole("img", { name: "No Self" });
    expect(slot).toHaveAttribute("data-active");
  });

  it("sizes the avatar to fill the 40px slot instead of Avatar's own 32px default", () => {
    render(<SelfSlot persona={PERSONA} />);

    expect(screen.getByRole("img", { name: "Data Scientist" })).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });
});
