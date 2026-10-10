import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select, type SelectOption, type SelectVariant } from "./select";

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

    expect(getTrigger().className).toContain(
      "bg-[var(--gb-background-default)]",
    );
  });

  it("shows the placeholder when no value is selected", () => {
    render(<Select options={OPTIONS} placeholder="Pick one" />);

    expect(getTrigger()).toHaveTextContent("Pick one");
  });

  it("shows the selected option label", () => {
    render(<Select options={OPTIONS} value="b" />);

    expect(getTrigger()).toHaveTextContent("Bravo");
  });

  it.each(ALL_VARIANTS)("renders the %s variant", (variant) => {
    render(<Select variant={variant} options={OPTIONS} />);

    expect(getTrigger()).toBeInTheDocument();
  });

  describe("Figma surface per variant", () => {
    it.each([
      ["primary", "bg-[var(--gb-background-default)]"],
      ["reverse", "bg-[var(--gb-background-bold)]"],
      ["mute", "bg-[var(--gb-background-surface-secondary)]"],
      ["ghost", "bg-transparent"],
      ["icon", "bg-[var(--gb-background-default)]"],
      ["side", "bg-transparent"],
      ["side-reverse", "bg-transparent"],
    ] as const)("%s uses the Figma background", (variant, expected) => {
      render(<Select variant={variant} options={OPTIONS} />);

      expect(getTrigger().className).toContain(expected);
    });

    it.each(["reverse", "mute", "ghost", "side", "side-reverse"] as const)(
      "%s has no visible border per Figma",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        expect(getTrigger().className).toContain("border-transparent");
      },
    );

    it.each(["primary", "icon"] as const)(
      "%s uses the Figma default border",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        expect(getTrigger().className).toContain(
          "border-[var(--gb-border-default)]",
        );
      },
    );
  });

  describe("geometry", () => {
    it.each(["primary", "reverse", "mute", "ghost"] as const)(
      "%s is 36px tall",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        expect(getTrigger().className).toContain("h-[36px]");
      },
    );

    it.each(["side", "side-reverse"] as const)(
      "%s is 24px tall with the xs type style",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        const { className } = getTrigger();
        expect(className).toContain("h-[24px]");
        expect(className).toContain("text-xs-medium");
      },
    );

    it("icon is a 36px square", () => {
      render(<Select variant="icon" options={OPTIONS} />);

      expect(getTrigger().className).toContain("size-[36px]");
    });

    it("side-reverse mirrors the trigger layout", () => {
      render(<Select variant="side-reverse" options={OPTIONS} />);

      const { className } = getTrigger();
      expect(className).toContain("flex-row-reverse");
      expect(className).toContain("text-right");
    });
  });

  describe("filled state (Figma: value 유무에서 파생)", () => {
    it("uses the subtle text color before a value is chosen", () => {
      render(<Select options={OPTIONS} />);

      expect(getTrigger().className).toContain("text-[var(--gb-text-subtle)]");
    });

    it("uses the default text color once a value is chosen", () => {
      render(<Select options={OPTIONS} value="a" />);

      expect(getTrigger().className).toContain("text-[var(--gb-text-default)]");
    });

    it("uses the selected/invert pair on the reverse variant", () => {
      const { unmount } = render(
        <Select variant="reverse" options={OPTIONS} />,
      );
      expect(getTrigger().className).toContain(
        "text-[var(--gb-text-selected)]",
      );
      unmount();

      render(<Select variant="reverse" options={OPTIONS} value="a" />);
      expect(getTrigger().className).toContain("text-[var(--gb-text-invert)]");
    });
  });

  describe("hover vs open (Figma: 값이 다름)", () => {
    it("fills the background on hover for the default-type variants", () => {
      render(<Select options={OPTIONS} />);

      const { className } = getTrigger();
      expect(className).toContain("hover:bg-[var(--gb-background-mute)]");
      expect(className).toContain("hover:text-[var(--gb-text-static-white)]");
    });

    it("only adds border and ring when open, never a background fill", () => {
      render(<Select options={OPTIONS} />);

      const { className } = getTrigger();
      expect(className).toContain(
        "data-[state=open]:border-[var(--gb-border-static-gray)]",
      );
      expect(className).toContain(
        "data-[state=open]:shadow-[var(--gb-shadow-focus-ring)]",
      );
      expect(className).not.toContain("data-[state=open]:bg-");
    });

    it.each(["side", "side-reverse"] as const)(
      "%s dims text on hover instead of filling the background",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        const { className } = getTrigger();
        expect(className).toContain("hover:text-[var(--gb-text-static-gray)]");
        expect(className).not.toContain("hover:bg-[var(--gb-background-mute)]");
      },
    );

    it.each(["side", "side-reverse"] as const)(
      "%s has no focus ring when open (Figma spread 0)",
      (variant) => {
        render(<Select variant={variant} options={OPTIONS} />);

        expect(getTrigger().className).not.toContain(
          "data-[state=open]:shadow-[var(--gb-shadow-focus-ring)]",
        );
      },
    );
  });

  describe("disabled", () => {
    it("replaces the surface with the single Figma disabled design", () => {
      render(<Select options={OPTIONS} disabled />);

      const { className } = getTrigger();
      expect(className).toContain("bg-[var(--gb-background-disabled)]");
      expect(className).toContain("border-[var(--gb-border-overlay)]");
      expect(className).toContain("text-[var(--gb-text-static-gray)]");
    });

    // Figma는 네 입력 계열(Part/Input·select·date-select·range-select) 모두
    // disabled에서도 Text-sm/Medium을 유지한다 — weight를 떨어뜨리지 않는다.
    it("keeps the medium weight (Figma)", () => {
      render(<Select options={OPTIONS} disabled />);

      expect(getTrigger().className).toContain("text-sm-medium");
      expect(getTrigger().className).not.toContain("text-sm-regular");
    });

    it("colors the chevron with the shared disabled icon token (Figma)", () => {
      render(<Select options={OPTIONS} disabled />);

      const svg = getTrigger().querySelector("svg");
      expect(svg?.getAttribute("class")).toContain(
        "text-[var(--gb-icon-static-gray)]",
      );
    });

    it("does not open when clicked", async () => {
      render(<Select options={OPTIONS} disabled />);

      await userEvent.click(getTrigger());

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("drops the hover treatment entirely", () => {
      render(<Select options={OPTIONS} disabled />);

      expect(getTrigger().className).not.toContain("hover:bg-");
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
        screen.getByRole("listbox").closest(".w-\\[210px\\]"),
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

      expect(screen.getByText("+82").className).toContain("w-[50px]");
    });

    it("shows the code instead of the label on the trigger", () => {
      render(<Select options={CODE_OPTIONS} value="kr" />);

      expect(getTrigger()).toHaveTextContent("+82");
      expect(getTrigger()).not.toHaveTextContent("Korea");
    });

    it("hides the scroll affordances at six options or fewer", async () => {
      render(<Select options={OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(
        screen.queryByRole("button", { name: "Show more options" }),
      ).not.toBeInTheDocument();
    });

    it("shows the scroll affordance above six options", async () => {
      render(<Select options={MANY_OPTIONS} />);

      await userEvent.click(getTrigger());

      expect(
        screen.getByRole("button", { name: "Show more options" }),
      ).toBeInTheDocument();
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
});
