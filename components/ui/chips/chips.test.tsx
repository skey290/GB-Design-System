import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chips } from "./chips";

describe("Chips", () => {
  it("renders children as label text", () => {
    render(<Chips>Label</Chips>);

    expect(screen.getByRole("button", { name: "Label" })).toBeInTheDocument();
  });

  it("defaults to the primary variant", () => {
    render(<Chips>Primary</Chips>);

    const chip = screen.getByRole("button", { name: "Primary" });
    expect(chip.className).toContain("bg-primary");
  });

  it.each([
    ["primary", "bg-primary"],
    ["secondary", "bg-[var(--background-surface-secondary)]"],
    ["outline", "bg-background"],
    ["ghost", "bg-transparent"],
  ] as const)(
    "renders the %s variant with expected classes",
    (variant, expectedClass) => {
      render(<Chips variant={variant}>{variant}</Chips>);

      const chip = screen.getByRole("button", { name: variant });
      expect(chip.className).toContain(expectedClass);
    },
  );

  it.each(["primary", "secondary", "outline", "ghost"] as const)(
    "previews the active look on hover for the %s variant (Figma has no hover State)",
    (variant) => {
      render(<Chips variant={variant}>{variant}</Chips>);

      const chip = screen.getByRole("button", { name: variant });
      expect(chip.className).toContain(
        "hover:bg-[var(--background-static-gray)]",
      );
      expect(chip.className).toContain("hover:text-[var(--text-static-white)]");
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
    expect(chip.className).toContain("disabled:opacity-[var(--opacity-70)]");

    await user.click(chip);
  });

  it.each(["primary", "secondary", "outline", "ghost"] as const)(
    "unifies disabled look to the primary-disabled appearance for the %s variant",
    (variant) => {
      render(
        <Chips variant={variant} disabled>
          {variant}
        </Chips>,
      );

      const chip = screen.getByRole("button", { name: variant });
      expect(chip.className).toContain("disabled:bg-primary");
      expect(chip.className).toContain("disabled:text-muted-foreground");
    },
  );

  it("marks the chip as pressed when selected", () => {
    render(<Chips selected>Selected</Chips>);

    const chip = screen.getByRole("button", { name: "Selected" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("is not pressed by default", () => {
    render(<Chips>Not selected</Chips>);

    const chip = screen.getByRole("button", { name: "Not selected" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
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
      <Chips deletable onDelete={onDelete} onClick={onClick}>
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
      <Chips deletable onDelete={onDelete}>
        Deletable
      </Chips>,
    );

    const deleteBadge = screen.getByRole("button", { name: "Remove" });
    deleteBadge.focus();
    await user.keyboard("{Enter}");

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("disables the delete badge (no callback, aria-disabled) when the chip is disabled", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <Chips deletable disabled onDelete={onDelete}>
        Deletable
      </Chips>,
    );

    const deleteBadge = screen.getByRole("button", { name: "Remove" });
    expect(deleteBadge).toHaveAttribute("aria-disabled", "true");
    expect(deleteBadge).toHaveAttribute("tabIndex", "-1");

    await user.click(deleteBadge);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
