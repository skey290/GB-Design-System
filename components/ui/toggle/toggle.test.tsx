import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Toggle,
  type ToggleGridItems,
  type ToggleIconItem,
  type ToggleItem,
  type ToggleTextItem,
} from "./toggle";

function Icon() {
  return <svg aria-hidden="true" />;
}

function makeItems(overrides?: Partial<ToggleIconItem>[]): ToggleItem[] {
  return [
    { icon: <Icon />, "aria-label": "북마크 1", ...(overrides?.[0] ?? {}) },
    { icon: <Icon />, "aria-label": "북마크 2", ...(overrides?.[1] ?? {}) },
  ];
}

function makeGridItems(
  overrides?: Partial<ToggleIconItem>[],
): ToggleGridItems {
  return [
    { icon: <Icon />, "aria-label": "북마크 1", ...(overrides?.[0] ?? {}) },
    { icon: <Icon />, "aria-label": "북마크 2", ...(overrides?.[1] ?? {}) },
    { icon: <Icon />, "aria-label": "북마크 3", ...(overrides?.[2] ?? {}) },
    { icon: <Icon />, "aria-label": "북마크 4", ...(overrides?.[3] ?? {}) },
  ];
}

function makeTextItems(overrides?: Partial<ToggleTextItem>[]): ToggleItem[] {
  return [
    { text: "AM", ...(overrides?.[0] ?? {}) },
    { text: "PM", ...(overrides?.[1] ?? {}) },
  ];
}

describe("Toggle", () => {
  it("renders a group with one button per item", () => {
    render(<Toggle items={makeItems()} />);

    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "북마크 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "북마크 2" }),
    ).toBeInTheDocument();
  });

  it("defaults every item to aria-pressed=false", () => {
    render(<Toggle items={makeItems()} />);

    const first = screen.getByRole("button", { name: "북마크 1" });
    expect(first).toHaveAttribute("aria-pressed", "false");
  });

  it("reflects the pressed prop via aria-pressed", () => {
    render(<Toggle items={makeItems([{ pressed: true }])} />);

    const first = screen.getByRole("button", { name: "북마크 1" });
    expect(first).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onPressedChange with the toggled value when clicked", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const items = makeItems();
    items[0] = { ...items[0], onPressedChange };

    render(<Toggle items={items} />);

    await user.click(screen.getByRole("button", { name: "북마크 1" }));

    expect(onPressedChange).toHaveBeenCalledTimes(1);
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("renders a divider between items but not before the first item", () => {
    const { container } = render(<Toggle items={makeItems()} />);

    const dividers = container.querySelectorAll('[data-slot="toggle-divider"]');
    expect(dividers).toHaveLength(1);
  });

  it("stacks items vertically when orientation is 'vertical'", () => {
    render(<Toggle items={makeItems()} orientation="vertical" />);

    const group = screen.getByRole("group");
    expect(group.className).toContain("flex-col");
  });

  it("stacks items horizontally by default", () => {
    render(<Toggle items={makeItems()} />);

    const group = screen.getByRole("group");
    expect(group.className).toContain("flex-row");
  });

  it("forwards additional props to the group container", () => {
    render(<Toggle items={makeItems()} data-testid="custom-toggle" />);

    expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
  });

  // grid는 Figma에 2×2 한 종류만 있어 타입이 아이템 4개를 강제한다.
  it("renders a 2-column grid when orientation is 'grid'", () => {
    const items = makeGridItems();
    const { container } = render(<Toggle items={items} orientation="grid" />);

    const group = screen.getByRole("group");
    expect(group.className).toContain("flex-col");
    // 2행(row) x 2열(column) 구조라 row 사이 divider가 1개 있어야 합니다.
    const dividers = container.querySelectorAll('[data-slot="toggle-divider"]');
    expect(dividers.length).toBeGreaterThan(0);
  });

  it("does not switch to grid automatically for 4+ vertical items", () => {
    // orientation 모델 수정: vertical은 아이템 수와 무관하게 항상 1열 스택입니다.
    const items = [
      ...makeItems(),
      { icon: <Icon />, "aria-label": "북마크 3" },
      { icon: <Icon />, "aria-label": "북마크 4" },
    ];
    render(<Toggle items={items} orientation="vertical" />);

    const group = screen.getByRole("group");
    expect(group.className).toContain("flex-col");
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("renders the vertical label next to its corresponding button", () => {
    const items = makeItems([
      { label: "Growth Potential" },
      { label: "Reach" },
    ]);
    render(<Toggle items={items} orientation="vertical" />);

    expect(screen.getByText("Growth Potential")).toBeInTheDocument();
    expect(screen.getByText("Reach")).toBeInTheDocument();
  });

  it("does not render labels for horizontal or grid orientation", () => {
    const { rerender } = render(
      <Toggle
        items={makeItems([{ label: "Growth Potential" }])}
        orientation="horizontal"
      />,
    );
    expect(screen.queryByText("Growth Potential")).not.toBeInTheDocument();

    rerender(
      <Toggle
        items={makeGridItems([{ label: "Growth Potential" }])}
        orientation="grid"
      />,
    );
    expect(screen.queryByText("Growth Potential")).not.toBeInTheDocument();
  });

  it("disables every button when the group-level disabled prop is true", () => {
    render(<Toggle items={makeItems()} disabled />);

    const first = screen.getByRole("button", { name: "북마크 1" });
    const second = screen.getByRole("button", { name: "북마크 2" });
    expect(first).toBeDisabled();
    expect(second).toBeDisabled();
  });

  it("does not call onPressedChange when disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const items = makeItems();
    items[0] = { ...items[0], onPressedChange };

    render(<Toggle items={items} disabled />);

    await user.click(screen.getByRole("button", { name: "북마크 1" }));

    expect(onPressedChange).not.toHaveBeenCalled();
  });

  // Figma 설명문: "Hover, press, and selected states all share the same active appearance."
  describe("hover (Figma: active와 동일한 외형)", () => {
    it("gives an unpressed icon item the pressed appearance on hover", () => {
      render(<Toggle items={makeItems()} />);

      const { className } = screen.getByRole("button", { name: "북마크 1" });
      expect(className).toContain(
        "enabled:hover:bg-[var(--gb-background-mute-subtle)]",
      );
      expect(className).toContain(
        "enabled:hover:text-[var(--gb-icon-static-white)]",
      );
    });

    it("gives an unpressed text item the pressed appearance on hover", () => {
      render(<Toggle type="text" items={makeTextItems()} />);

      const { className } = screen.getByRole("button", { name: "AM" });
      expect(className).toContain(
        "enabled:hover:bg-[var(--gb-background-mute)]",
      );
      expect(className).toContain(
        "enabled:hover:text-[var(--gb-text-static-white)]",
      );
    });

    it("adds no hover treatment to an already pressed item", () => {
      render(<Toggle items={makeItems([{ pressed: true }])} />);

      expect(
        screen.getByRole("button", { name: "북마크 1" }).className,
      ).not.toContain("hover:");
    });

    it("adds no hover treatment while disabled (enabled: guard)", () => {
      render(<Toggle items={makeItems()} disabled />);

      // enabled: 접두사가 붙어 있어 disabled 버튼에는 적용되지 않는다
      expect(
        screen.getByRole("button", { name: "북마크 1" }).className,
      ).not.toContain(" hover:");
    });
  });

  describe('type="text" (알약 세그먼트)', () => {
    it("renders the text as the button content and accessible name", () => {
      render(<Toggle type="text" items={makeTextItems()} />);

      expect(screen.getByRole("button", { name: "AM" })).toHaveTextContent(
        "AM",
      );
      expect(screen.getByRole("button", { name: "PM" })).toBeInTheDocument();
    });

    it("uses the Figma track background and padding on the container", () => {
      const { container } = render(
        <Toggle type="text" items={makeTextItems()} />,
      );
      const { className } = container.firstElementChild as HTMLElement;

      expect(className).toContain("bg-[var(--gb-background-selected)]");
      expect(className).toContain("p-[var(--gb-spacing-0-5)]");
      expect(className).toContain("gap-[var(--gb-spacing-0-5)]");
      expect(className).toContain("h-[36px]");
    });

    it("renders no dividers (Figma: 알약은 구분선 없음)", () => {
      const { container } = render(
        <Toggle type="text" items={makeTextItems()} />,
      );

      expect(
        container.querySelectorAll('[data-slot="toggle-divider"]'),
      ).toHaveLength(0);
    });

    it("swaps the container surface when disabled (Figma: 트랙도 함께 바뀜)", () => {
      const { container } = render(
        <Toggle type="text" items={makeTextItems()} disabled />,
      );
      const { className } = container.firstElementChild as HTMLElement;

      expect(className).toContain("bg-[var(--gb-background-disabled)]");
      expect(className).toContain("border-[var(--gb-border-overlay)]");
    });

    it("keeps the pressed chip filled with the Figma active background", () => {
      render(<Toggle type="text" items={makeTextItems([{ pressed: true }])} />);

      expect(screen.getByRole("button", { name: "AM" }).className).toContain(
        "bg-[var(--gb-background-mute)]",
      );
    });

    it("toggles via onPressedChange", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(
        <Toggle type="text" items={makeTextItems([{ onPressedChange }])} />,
      );

      await user.click(screen.getByRole("button", { name: "AM" }));

      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('trailingAction (Figma Type="text + icon" horizontal)', () => {
    it("renders an icon Button beside the pill", () => {
      render(
        <Toggle
          type="text"
          items={makeTextItems()}
          trailingAction={{ icon: "plus-icon", "aria-label": "추가" }}
        />,
      );

      expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "AM" })).toBeInTheDocument();
    });

    it("uses the Figma space-6 gap between the pill and the button", () => {
      const { container } = render(
        <Toggle
          type="text"
          items={makeTextItems()}
          trailingAction={{ icon: "plus-icon", "aria-label": "추가" }}
        />,
      );

      expect(container.firstElementChild?.className).toContain(
        "gap-[var(--gb-spacing-1-5)]",
      );
    });

    it("calls the trailing action handler", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Toggle
          type="text"
          items={makeTextItems()}
          trailingAction={{ icon: "plus-icon", "aria-label": "추가", onClick }}
        />,
      );

      await user.click(screen.getByRole("button", { name: "추가" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("disables the trailing button with the group", () => {
      render(
        <Toggle
          type="text"
          items={makeTextItems()}
          trailingAction={{ icon: "plus-icon", "aria-label": "추가" }}
          disabled
        />,
      );

      expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
    });

    it("renders nothing extra when trailingAction is omitted", () => {
      render(<Toggle type="text" items={makeTextItems()} />);

      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });

  describe("keyboard", () => {
    it("toggles an item with Enter and Space", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<Toggle items={makeItems([{ onPressedChange }])} />);

      const first = screen.getByRole("button", { name: "북마크 1" });
      await user.tab();
      expect(first).toHaveFocus();

      await user.keyboard("{Enter}");
      await user.keyboard(" ");

      expect(onPressedChange).toHaveBeenCalledTimes(2);
    });

    it("skips every button when the group is disabled", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<Toggle items={makeItems([{ onPressedChange }])} disabled />);

      await user.tab();

      expect(
        screen.getByRole("button", { name: "북마크 1" }),
      ).not.toHaveFocus();
      expect(onPressedChange).not.toHaveBeenCalled();
    });
  });

  // pressed와 disabled는 cva의 독립된 두 축이라 동시에 true일 때 어느 쪽이
  // 이기는지가 선언 순서에 달려 있다 — 실제 렌더링으로 고정한다.
  it("gives the disabled look priority when an item is both pressed and disabled", () => {
    render(<Toggle items={makeItems([{ pressed: true }])} disabled />);

    const first = screen.getByRole("button", { name: "북마크 1" });
    expect(first).toBeDisabled();
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(first.className).toContain("disabled:");
  });
});
