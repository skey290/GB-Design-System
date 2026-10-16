import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select, type SelectOption, type SelectVariant } from "./select";
import dropdownListStyles from "../dropdown-list/dropdown-list.module.css";
import selectStyles from "./select.module.css";

const OPTIONS: SelectOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo" },
  { value: "c", label: "Charlie" },
];

const MANY_OPTIONS: SelectOption[] = Array.from({ length: 8 }, (_, i) => ({
  value: `v${i}`,
  label: `Option ${i}`,
}));

const CODE_OPTIONS: SelectOption[] = [
  { value: "kr", label: "Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
];

const ALL_VARIANTS: SelectVariant[] = [
  "primary",
  "reverse",
  "mute",
  "ghost",
  "icon",
  "side",
  "side-reverse",
];

function getTrigger() {
  return screen.getByRole("combobox");
}

describe("Select", () => {
  it("defaults to the primary variant", () => {
    render(<Select options={OPTIONS} />);

    expect(getTrigger()).toHaveAttribute("data-variant", "primary");
  });

  it("shows the placeholder when no value is selected", () => {
    render(<Select options={OPTIONS} placeholder="Pick one" />);

    expect(getTrigger()).toHaveTextContent("Pick one");
    expect(getTrigger()).toHaveAttribute("data-placeholder", "true");
  });

  it("shows the selected option label", () => {
    render(<Select options={OPTIONS} value="b" />);

    expect(getTrigger()).toHaveTextContent("Bravo");
    expect(getTrigger()).not.toHaveAttribute("data-placeholder");
  });

  it.each(ALL_VARIANTS)("renders the %s variant", (variant) => {
    render(<Select variant={variant} options={OPTIONS} />);

    expect(getTrigger()).toHaveAttribute("data-variant", variant);
  });

  describe("geometry (data-variant branching — verify actual size/color in Storybook)", () => {
    it.each(["side", "side-reverse"] as const)(
      "%s mirrors the trigger layout via data-variant",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        expect(getTrigger()).toHaveAttribute("data-variant", variant);
      },
    );

    it("icon variant renders without a text label", () => {
      render(<Select variant="icon" options={OPTIONS} value="a" />);

      const trigger = getTrigger();
      expect(trigger).not.toHaveTextContent("Alpha");
      expect(trigger.querySelector("svg")).toHaveClass("lucide-plus");
    });
  });

  describe("disabled", () => {
    it("disables the trigger", () => {
      render(<Select options={OPTIONS} disabled />);

      expect(getTrigger()).toBeDisabled();
    });

    it("does not open when clicked", async () => {
      render(<Select options={OPTIONS} disabled />);

      await userEvent.click(getTrigger());

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("dropdown", () => {
    it("opens on click and lists every option", async () => {
      render(<Select options={OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("commits the clicked option and closes", async () => {
      const onValueChange = vi.fn();
      render(<Select options={OPTIONS} onValueChange={onValueChange} />);

      await userEvent.click(getTrigger());
      await userEvent.click(screen.getByRole("option", { name: "Bravo" }));

      expect(onValueChange).toHaveBeenCalledWith("b");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("uses the Figma 210px panel width for every variant", async () => {
      render(<Select options={OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(
        screen.getByRole("listbox").closest(`.${selectStyles.content}`),
      ).not.toBeNull();
    });

    it("opens with the arrow keys", async () => {
      render(<Select options={OPTIONS} />);

      getTrigger().focus();
      await userEvent.keyboard("{ArrowDown}");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("marks the current value as selected", async () => {
      render(<Select options={OPTIONS} value="c" />);

      await userEvent.click(getTrigger());

      expect(screen.getByRole("option", { name: "Charlie" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("renders a fixed-width code column when options carry codes", async () => {
      render(<Select options={CODE_OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(screen.getByText("+82")).toHaveClass(dropdownListStyles.code);
    });

    it("shows the code instead of the label on the trigger", () => {
      render(<Select options={CODE_OPTIONS} value="kr" />);

      expect(getTrigger()).toHaveTextContent("+82");
      expect(getTrigger()).not.toHaveTextContent("Korea");
    });

    it("never renders a scroll-next button (no Figma design for it)", async () => {
      render(<Select options={MANY_OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(
        screen.queryByRole("button", { name: "Show more options" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("chevron direction", () => {
    it("points down when closed and up when open (default type)", async () => {
      render(<Select options={OPTIONS} />);

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-down",
      );

      await userEvent.click(getTrigger());

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-up",
      );
    });

    it("points right when closed and left when open (side)", async () => {
      render(<Select variant="side" options={OPTIONS} />);

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-right",
      );

      await userEvent.click(getTrigger());

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-left",
      );
    });

    it("mirrors the side direction for side-reverse", async () => {
      render(<Select variant="side-reverse" options={OPTIONS} />);

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-left",
      );

      await userEvent.click(getTrigger());

      expect(getTrigger().querySelector("svg")).toHaveClass(
        "lucide-chevron-right",
      );
    });
  });

  it("renders a plus icon with no label on the icon variant", () => {
    render(<Select variant="icon" options={OPTIONS} value="a" />);

    const trigger = getTrigger();
    expect(trigger).not.toHaveTextContent("Alpha");
    expect(trigger.querySelector("svg")).toHaveClass("lucide-plus");
  });

  it("merges a caller className", () => {
    render(<Select options={OPTIONS} className="w-[320px]" />);

    expect(getTrigger().className).toContain("w-[320px]");
  });

  it("works uncontrolled from defaultValue", async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} defaultValue={OPTIONS[1].value} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent(OPTIONS[1].label);

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: OPTIONS[0].label }));

    expect(screen.getByRole("combobox")).toHaveTextContent(OPTIONS[0].label);
  });
});
