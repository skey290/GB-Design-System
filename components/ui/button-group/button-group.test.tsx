import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonGroup, type ButtonGroupType } from "./button-group";
import styles from "./button-group.module.css";

const PAIR_LABELS: Record<
  Exclude<ButtonGroupType, "menu">,
  [secondary: string, primary: string]
> = {
  skippable: ["Later", "Go Next"],
  "back-or-forth": ["Go back", "Go Next"],
  save: ["Cancel", "Save"],
  confirm: ["Cancel", "Confirm"],
  error: ["Refresh", "Back to Dashboard"],
};

const PAIR_TYPES = Object.keys(PAIR_LABELS) as Array<
  Exclude<ButtonGroupType, "menu">
>;

describe("ButtonGroup", () => {
  it("defaults to the skippable type", () => {
    render(<ButtonGroup />);

    expect(screen.getByRole("button", { name: "Later" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go Next" })).toBeInTheDocument();
  });

  it.each(PAIR_TYPES)("renders the Figma labels for the %s type", (type) => {
    const [secondary, primary] = PAIR_LABELS[type];
    render(<ButtonGroup type={type} />);

    expect(screen.getByRole("button", { name: secondary })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: primary })).toBeInTheDocument();
  });

  it.each(PAIR_TYPES)(
    "renders an outline + primary button pair for the %s type",
    (type) => {
      const [secondary, primary] = PAIR_LABELS[type];
      render(<ButtonGroup type={type} />);

      expect(
        screen.getByRole("button", { name: secondary }),
      ).toHaveAttribute("data-variant", "outline");
      expect(screen.getByRole("button", { name: primary })).toHaveAttribute(
        "data-variant",
        "primary",
      );
    },
  );

  it("keeps the error type free of a dedicated destructive variant (Figma uses the same tokens)", () => {
    render(<ButtonGroup type="error" />);

    const refresh = screen.getByRole("button", { name: "Refresh" });
    const back = screen.getByRole("button", { name: "Back to Dashboard" });

    expect(refresh).toHaveAttribute("data-variant", "outline");
    expect(back).toHaveAttribute("data-variant", "primary");
  });

  it("overrides both labels when given", () => {
    render(
      <ButtonGroup type="save" secondaryLabel="취소" primaryLabel="저장" />,
    );

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("uses the Figma 344px fixed width by default", () => {
    const { container } = render(<ButtonGroup />);

    expect(container.firstElementChild).not.toHaveAttribute(
      "data-fit-container",
    );
  });

  it("fills the container when shouldFitContainer is true", () => {
    const { container } = render(<ButtonGroup shouldFitContainer />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-fit-container",
      "true",
    );
  });

  it("uses the Figma space-10 gap between the two buttons", () => {
    const { container } = render(<ButtonGroup />);

    expect(container.firstElementChild).toHaveClass(styles.pair);
  });

  it("disables both buttons when disabled is true", () => {
    render(<ButtonGroup type="save" disabled />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("gives both buttons the same disabled treatment (Figma: outline/primary distinction disappears — guaranteed by grouping outline/primary into the same block in button.module.css)", () => {
    render(<ButtonGroup type="save" disabled />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls the click handlers for each side", async () => {
    const onSecondaryClick = vi.fn();
    const onPrimaryClick = vi.fn();
    render(
      <ButtonGroup
        type="confirm"
        onSecondaryClick={onSecondaryClick}
        onPrimaryClick={onPrimaryClick}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  describe("menu type", () => {
    it("renders the four Figma default items", () => {
      render(<ButtonGroup type="menu" />);

      expect(screen.getByRole("tab", { name: "home" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Assets" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Compass" })).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Content Studio" }),
      ).toBeInTheDocument();
    });

    it("applies the Figma pill container styles", () => {
      const { container } = render(<ButtonGroup type="menu" />);

      expect(container.firstElementChild).toHaveClass(styles.menu);
    });

    it("renders the icon-only item as icon-rounded and labelled items as ghost", () => {
      render(<ButtonGroup type="menu" />);

      expect(screen.getByRole("tab", { name: "home" })).toHaveAttribute(
        "data-variant",
        "icon-rounded",
      );
      expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
        "data-variant",
        "ghost",
      );
    });

    it("marks the active item as selected", () => {
      render(<ButtonGroup type="menu" activeId="compass" />);

      expect(screen.getByRole("tab", { name: "Compass" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });

    it("notifies on item click", async () => {
      const onActiveChange = vi.fn();
      render(
        <ButtonGroup
          type="menu"
          activeId="home"
          onActiveChange={onActiveChange}
        />,
      );

      await userEvent.click(screen.getByRole("tab", { name: "Assets" }));

      expect(onActiveChange).toHaveBeenCalledWith("assets");
    });

    it("moves the active item with arrow keys", async () => {
      const onActiveChange = vi.fn();
      render(
        <ButtonGroup
          type="menu"
          activeId="assets"
          onActiveChange={onActiveChange}
        />,
      );

      screen.getByRole("tab", { name: "Assets" }).focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(onActiveChange).toHaveBeenCalledWith("compass");
    });

    it("wraps around at both ends", async () => {
      const onActiveChange = vi.fn();
      render(
        <ButtonGroup
          type="menu"
          activeId="home"
          onActiveChange={onActiveChange}
        />,
      );

      screen.getByRole("tab", { name: "home" }).focus();
      await userEvent.keyboard("{ArrowLeft}");

      expect(onActiveChange).toHaveBeenCalledWith("contents-studio");
    });

    it("disables every item when disabled", () => {
      render(<ButtonGroup type="menu" activeId="compass" disabled />);

      for (const name of ["home", "Assets", "Compass", "Content Studio"]) {
        expect(screen.getByRole("tab", { name })).toBeDisabled();
      }
    });

    it("drops the selection highlight when disabled", () => {
      const { unmount } = render(
        <ButtonGroup type="menu" activeId="compass" disabled />,
      );
      // When disabled, the active item doesn't get data-selected either (same as an inactive item)
      expect(screen.getByRole("tab", { name: "Compass" })).not.toHaveAttribute(
        "data-selected",
      );
      unmount();

      render(<ButtonGroup type="menu" activeId="compass" />);
      expect(screen.getByRole("tab", { name: "Compass" })).toHaveAttribute(
        "data-selected",
        "true",
      );
    });

    it("keeps the pill container unchanged when disabled (Figma: only the inner color goes dead)", () => {
      const { container } = render(<ButtonGroup type="menu" disabled />);

      expect(container.firstElementChild).toHaveClass(styles.menu);
    });

    it("ignores keyboard navigation while disabled", async () => {
      const onActiveChange = vi.fn();
      render(
        <ButtonGroup
          type="menu"
          activeId="assets"
          onActiveChange={onActiveChange}
          disabled
        />,
      );

      await userEvent.keyboard("{ArrowRight}");

      expect(onActiveChange).not.toHaveBeenCalled();
    });

    it("renders custom items when given", () => {
      render(
        <ButtonGroup
          type="menu"
          items={[
            { id: "a", label: "First" },
            { id: "b", label: "Second" },
          ]}
          activeId="a"
        />,
      );

      expect(screen.getAllByRole("tab")).toHaveLength(2);
      expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
    });

    it("keeps the first item focusable when no activeId is given", () => {
      render(<ButtonGroup type="menu" />);

      expect(screen.getByRole("tab", { name: "home" })).toHaveAttribute(
        "tabindex",
        "0",
      );
      expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });
  });
});
