import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Globe } from "lucide-react";

import { DropdownList, type DropdownListOption } from "./dropdown-list";

const OPTIONS: DropdownListOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
  { value: "c", label: "Charlie", disabled: true },
];

const MANY_OPTIONS: DropdownListOption[] = Array.from(
  { length: 8 },
  (_, i) => ({ value: `v${i}`, label: `Option ${i}` }),
);

const ICON_OPTIONS: DropdownListOption[] = [
  { value: "a", label: "Alpha", icon: Globe },
  { value: "b", label: "Bravo" },
];

const CODE_OPTIONS: DropdownListOption[] = [
  { value: "kr", label: "Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
];

function renderList(overrides: Partial<React.ComponentProps<typeof DropdownList>> = {}) {
  const defaultProps: React.ComponentProps<typeof DropdownList> = {
    options: OPTIONS,
    highlightedIndex: -1,
    onHighlightChange: vi.fn(),
    onCommit: vi.fn(),
    listboxId: "listbox",
    getOptionId: (value) => `option-${value}`,
  };
  return render(<DropdownList {...defaultProps} {...overrides} />);
}

describe("DropdownList", () => {
  it("renders every option as a listbox option", () => {
    renderList();

    expect(screen.getByRole("listbox")).toHaveAttribute("id", "listbox");
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("marks the current value as selected", () => {
    renderList({ value: "b" });

    expect(screen.getByRole("option", { name: "Bravo" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("calls onCommit when an enabled option is clicked", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    renderList({ onCommit });

    await user.click(screen.getByRole("option", { name: "Alpha" }));

    expect(onCommit).toHaveBeenCalledWith(OPTIONS[0]);
  });

  it("still calls onCommit for a disabled option (Select decides whether to honor it)", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    renderList({ onCommit });

    await user.click(screen.getByRole("option", { name: "Charlie" }));

    expect(onCommit).toHaveBeenCalledWith(OPTIONS[2]);
  });

  it("does not call onHighlightChange when hovering a disabled option", async () => {
    const user = userEvent.setup();
    const onHighlightChange = vi.fn();
    renderList({ onHighlightChange });

    await user.hover(screen.getByRole("option", { name: "Charlie" }));

    expect(onHighlightChange).not.toHaveBeenCalled();
  });

  it("calls onHighlightChange when hovering an enabled option", async () => {
    const user = userEvent.setup();
    const onHighlightChange = vi.fn();
    renderList({ onHighlightChange });

    await user.hover(screen.getByRole("option", { name: "Bravo" }));

    expect(onHighlightChange).toHaveBeenCalledWith(1);
  });

  it("renders a leading icon column only when at least one option has an icon", () => {
    renderList({ options: ICON_OPTIONS });

    const alpha = screen.getByRole("option", { name: "Alpha" });
    expect(alpha.querySelector("svg")).toBeInTheDocument();
  });

  it("renders a fixed-width code column when options carry codes", () => {
    renderList({ options: CODE_OPTIONS });

    expect(screen.getByText("+82").className).toContain("w-[50px]");
  });

  it("hides the scroll affordance at six options or fewer", () => {
    renderList();

    expect(
      screen.queryByRole("button", { name: "Show more options" }),
    ).not.toBeInTheDocument();
  });

  it("shows the scroll affordance above six options", () => {
    renderList({ options: MANY_OPTIONS });

    expect(
      screen.getByRole("button", { name: "Show more options" }),
    ).toBeInTheDocument();
  });
});
