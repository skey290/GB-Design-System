import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chips } from "./chips";
import styles from "./chips.module.css";

describe("Chips", () => {
  it("renders children as label text", () => {
    render(<Chips>Label</Chips>);

    expect(screen.getByRole("button", { name: "Label" })).toBeInTheDocument();
  });

  it("defaults to the primary variant", () => {
    render(<Chips>Primary</Chips>);

    expect(screen.getByRole("button", { name: "Primary" })).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it.each(["primary", "secondary", "outline", "ghost"] as const)(
    "sets data-variant to %s",
    (variant) => {
      render(<Chips variant={variant}>{variant}</Chips>);

      expect(screen.getByRole("button", { name: variant })).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it("applies disabled state and prevents interaction", async () => {
    const user = userEvent.setup();
    const onClick = () => {
      throw new Error("onClick should not fire when disabled");
    };

    render(
      <Chips disabled onClick={onClick}>
        Disabled
      </Chips>,
    );

    const chip = screen.getByRole("button", { name: "Disabled" });
    expect(chip).toBeDisabled();

    await user.click(chip);
  });

  it("marks the chip as pressed when selected", () => {
    render(<Chips selected>Selected</Chips>);

    const chip = screen.getByRole("button", { name: "Selected" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveAttribute("data-selected", "true");
  });

  it("is not pressed by default", () => {
    render(<Chips>Not selected</Chips>);

    const chip = screen.getByRole("button", { name: "Not selected" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).not.toHaveAttribute("data-selected");
  });

  it("forwards additional props to the underlying button", () => {
    render(<Chips data-testid="custom-chip">Custom</Chips>);

    expect(screen.getByTestId("custom-chip")).toBeInTheDocument();
  });

  it("does not render a delete badge by default", () => {
    render(<Chips>No delete</Chips>);

    expect(
      screen.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
  });

  it("renders a delete badge and fires onDelete without toggling the chip", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onClick = vi.fn();

    render(
      <Chips showDeleteIcon onDelete={onDelete} onClick={onClick}>
        Deletable
      </Chips>,
    );

    const deleteBadge = screen.getByRole("button", { name: "Remove" });
    await user.click(deleteBadge);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("activates the delete badge with the keyboard (Enter)", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <Chips showDeleteIcon onDelete={onDelete}>
        Deletable
      </Chips>,
    );

    const deleteBadge = screen.getByRole("button", { name: "Remove" });
    deleteBadge.focus();
    await user.keyboard("{Enter}");

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not render the delete badge when the chip is disabled (Figma)", () => {
    render(
      <Chips showDeleteIcon disabled>
        Deletable
      </Chips>,
    );

    expect(
      screen.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["primary", false],
    ["primary", true],
    ["secondary", true],
    ["ghost", true],
  ] as const)(
    "colors the delete icon independently of the %s chip (selected=%s)",
    (variant, selected) => {
      render(
        <Chips variant={variant} selected={selected} showDeleteIcon>
          Deletable
        </Chips>,
      );

      const badge = screen.getByRole("button", { name: "Remove" });
      expect(badge).toHaveClass(styles.deleteBadge);
    },
  );
});
