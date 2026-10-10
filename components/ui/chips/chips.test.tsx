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
    ["secondary", "bg-[var(--gb-background-surface-secondary)]"],
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
      expect(chip.className).toContain("hover:bg-[var(--gb-background-mute)]");
      expect(chip.className).toContain(
        "hover:text-[var(--gb-text-static-white)]",
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
    expect(chip.className).toContain("disabled:opacity-[var(--gb-opacity-70)]");

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
      // outline은 보더를 inset box-shadow로 그린다 — 이것까지 지워져야 네 variant가 같은 모습이다.
      expect(chip.className).toContain("disabled:shadow-none");
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

  it("does not render the delete badge when the chip is disabled (Figma)", () => {
    render(
      <Chips deletable disabled>
        Deletable
      </Chips>,
    );

    expect(
      screen.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
  });

  // 배지 배경은 칩과 반대 색이라, 아이콘 색을 상속시키면 primary/selected에서
  // 배경과 같은 색이 되어 X가 보이지 않는다.
  it.each([
    ["primary", false],
    ["primary", true],
    ["secondary", true],
    ["ghost", true],
  ] as const)(
    "colors the delete icon independently of the %s chip (selected=%s)",
    (variant, selected) => {
      render(
        <Chips variant={variant} selected={selected} deletable>
          Deletable
        </Chips>,
      );

      const badge = screen.getByRole("button", { name: "Remove" });
      expect(badge.className).toContain("text-[var(--gb-icon-default)]");
    },
  );

  it("does not add a real border to any variant (width parity with Figma)", () => {
    const { rerender } = render(<Chips variant="outline">Outline</Chips>);
    const outline = screen.getByRole("button", { name: "Outline" });
    expect(outline.className).toContain(
      "shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-default)]",
    );
    expect(outline.className).not.toContain(
      "border-[length:var(--gb-border-1)]",
    );

    rerender(<Chips variant="primary">Primary</Chips>);
    expect(
      screen.getByRole("button", { name: "Primary" }).className,
    ).not.toContain("border-");
  });
});
