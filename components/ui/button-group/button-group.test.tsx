import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonGroup, type ButtonGroupType } from "./button-group";

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
        screen.getByRole("button", { name: secondary }).className,
      ).toContain("border-border");
      expect(screen.getByRole("button", { name: primary }).className).toContain(
        "bg-primary",
      );
    },
  );

  it("keeps the error type free of destructive colors (Figma uses the same tokens)", () => {
    render(<ButtonGroup type="error" />);

    const refresh = screen.getByRole("button", { name: "Refresh" });
    const back = screen.getByRole("button", { name: "Back to Dashboard" });

    expect(refresh.className).toContain("border-border");
    expect(back.className).toContain("bg-primary");
    expect(refresh.className).not.toContain("destructive");
    expect(back.className).not.toContain("destructive");
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

    expect(container.firstElementChild?.className).toContain("w-[344px]");
  });

  it("fills the container when shouldFitContainer is true", () => {
    const { container } = render(<ButtonGroup shouldFitContainer />);

    expect(container.firstElementChild?.className).toContain("w-full");
    expect(container.firstElementChild?.className).not.toContain("w-[344px]");
  });

  it("uses the Figma space-10 gap between the two buttons", () => {
    const { container } = render(<ButtonGroup />);

    expect(container.firstElementChild?.className).toContain(
      "gap-[var(--gb-spacing-2-5)]",
    );
  });

  it("disables both buttons when disabled is true", () => {
    render(<ButtonGroup type="save" disabled />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("gives both buttons the same disabled treatment (Figma: outline/primary 구분 사라짐)", () => {
    render(<ButtonGroup type="save" />);

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const save = screen.getByRole("button", { name: "Save" });

    for (const button of [cancel, save]) {
      expect(button.className).toContain(
        "disabled:bg-[var(--gb-background-disabled)]",
      );
      expect(button.className).toContain(
        "disabled:text-[var(--gb-text-static-gray)]",
      );
      expect(button.className).toContain(
        "disabled:border-[var(--gb-border-overlay)]",
      );
    }
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
      const { className } = container.firstElementChild as HTMLElement;

      expect(className).toContain("h-[53px]");
      expect(className).toContain("rounded-[var(--gb-radius-scale-full)]");
      expect(className).toContain("bg-[var(--gb-background-sheer)]");
      expect(className).toContain(
        "[backdrop-filter:var(--gb-backdrop-blur-8)]",
      );
      expect(className).toContain("gap-[var(--gb-spacing-3)]");
    });

    it("renders the icon-only item as icon-ghost and labelled items as ghost", () => {
      render(<ButtonGroup type="menu" />);

      expect(screen.getByRole("tab", { name: "home" }).className).toContain(
        "size-[36px]",
      );
      expect(screen.getByRole("tab", { name: "Assets" }).className).toContain(
        "rounded-[var(--gb-radius-scale-full)]",
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
      const disabledSelected = screen.getByRole("tab", {
        name: "Compass",
      }).className;
      const disabledUnselected = screen.getByRole("tab", {
        name: "Assets",
      }).className;
      unmount();

      render(<ButtonGroup type="menu" activeId="compass" />);
      const enabledSelected = screen.getByRole("tab", {
        name: "Compass",
      }).className;

      // disabled면 활성 항목도 비활성 항목과 완전히 같은 클래스를 받는다
      expect(disabledSelected).toBe(disabledUnselected);
      expect(enabledSelected).not.toBe(disabledSelected);
    });

    it("keeps the pill container unchanged when disabled (Figma: 안쪽 색만 죽음)", () => {
      const { container } = render(<ButtonGroup type="menu" disabled />);
      const { className } = container.firstElementChild as HTMLElement;

      expect(className).toContain("bg-[var(--gb-background-sheer)]");
      expect(className).not.toContain("--gb-background-disabled");
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
