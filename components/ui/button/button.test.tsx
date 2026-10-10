import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "./button";

describe("Button", () => {
  it("renders children as text content", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("defaults to the primary variant", () => {
    render(<Button>Primary</Button>);

    const button = screen.getByText("Primary");
    expect(button.className).toContain("bg-primary");
  });

  it.each([
    ["primary", "bg-primary"],
    ["mute", "background-subtler"],
    ["outline", "border-border"],
    ["link", "border-b-[var(--gb-border-invert)]"],
    ["ghost", "rounded-[var(--gb-radius-scale-full)]"],
    ["google", "background-bolder"],
  ] as const)(
    "renders the %s variant with expected classes",
    (variant, expectedClass) => {
      render(<Button variant={variant}>{variant}</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain(expectedClass);
    },
  );

  it.each([
    ["icon", "rounded-[var(--gb-radius-scale-lg)]"],
    ["icon-ghost", "bg-transparent"],
    ["icon-rounded", "rounded-[var(--gb-radius-scale-full)]"],
  ] as const)(
    "renders the %s icon-only variant with expected classes",
    (variant, expectedClass) => {
      render(<Button variant={variant} icon="plus-icon" />);

      const button = screen.getByRole("button", { name: "plus-icon" });
      expect(button.className).toContain(expectedClass);
    },
  );

  // `icon-ghost`는 기본/disabled가 radius-full이고 active만 radius-lg다.
  describe("icon-ghost radius", () => {
    it("rests on a full radius but squares off on hover/active", () => {
      render(<Button variant="icon-ghost" icon="plus-icon" />);

      const { className } = screen.getByRole("button", { name: "plus-icon" });
      expect(className).toContain("rounded-[var(--gb-radius-scale-full)]");
      expect(className).toContain("hover:rounded-[var(--gb-radius-scale-lg)]");
      expect(className).toContain("active:rounded-[var(--gb-radius-scale-lg)]");
    });

    it("keeps icon-rounded circular in every state", () => {
      render(<Button variant="icon-rounded" icon="plus-icon" />);

      const { className } = screen.getByRole("button", { name: "plus-icon" });
      expect(className).toContain("rounded-[var(--gb-radius-scale-full)]");
      expect(className).not.toContain("rounded-[var(--gb-radius-scale-lg)]");
    });
  });

  it.each([
    ["icon", "--gb-icon-static-gray"],
    ["icon-ghost", "--gb-icon-static-gray"],
    ["icon-rounded", "--gb-icon-static-gray"],
  ] as const)(
    "applies the Figma disabled icon color on the %s variant",
    (variant, token) => {
      render(<Button variant={variant} icon="plus-icon" disabled />);

      const button = screen.getByRole("button", { name: "plus-icon" });
      expect(button.className).toContain(`disabled:text-[var(${token})]`);
    },
  );

  it("treats hover and active identically (Figma Status=active)", () => {
    render(<Button variant="primary">Primary</Button>);

    const { className } = screen.getByRole("button");
    expect(className).toContain("hover:bg-[var(--gb-background-mute)]");
    expect(className).toContain("active:bg-[var(--gb-background-mute)]");
  });

  it.each(["icon-ghost", "icon-rounded"] as const)(
    "keeps the %s variant transparent and borderless when disabled",
    (variant) => {
      render(<Button variant={variant} icon="plus-icon" disabled />);

      const { className } = screen.getByRole("button", { name: "plus-icon" });
      expect(className).toContain("disabled:bg-transparent");
      expect(className).not.toContain(
        "disabled:border-[var(--gb-border-overlay)]",
      );
    },
  );

  it("gives the icon-rounded variant a surface but no border", () => {
    render(<Button variant="icon-rounded" icon="plus-icon" />);

    const { className } = screen.getByRole("button", { name: "plus-icon" });
    expect(className).toContain("bg-background");
    expect(className).not.toContain("border-border");
  });

  it("renders a lucide-react icon for icon ids registered in LUCIDE_SPRITE_MAP", () => {
    render(<Button variant="icon" icon="search-icon" />);

    const button = screen.getByRole("button", { name: "search-icon" });

    expect(button.querySelector("use")).not.toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to the circle-dashed-icon placeholder (lucide) when no icon id is given", () => {
    render(<Button variant="icon-ghost" />);

    const button = screen.getByRole("button", { name: "circle-dashed-icon" });

    expect(button.querySelector("use")).not.toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to the /icons.svg sprite for app-specific icon ids outside LUCIDE_SPRITE_MAP", () => {
    render(<Button variant="icon" icon="google-icon" />);

    const button = screen.getByRole("button", { name: "google-icon" });
    const use = button.querySelector("use");

    expect(use).toHaveAttribute("href", "/icons.svg#google-icon");
  });

  it("disables the button when the disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("draws the link underline as a container bottom border, not text decoration", () => {
    render(<Button variant="link">Link</Button>);

    const { className } = screen.getByText("Link");
    expect(className).toContain("border-b-[var(--gb-border-invert)]");
    expect(className).toContain(
      "hover:border-b-[var(--gb-border-mute-subtle)]",
    );
    expect(className).toContain(
      "disabled:border-b-[var(--gb-border-static-gray)]",
    );
    expect(className).not.toContain("underline");
  });

  it("forwards additional props to the underlying button element", () => {
    render(<Button data-testid="custom-button">Custom</Button>);

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });

  it("forwards ref to the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it.each(["icon", "icon-ghost", "icon-rounded"] as const)(
    "renders the %s variant without visible text content",
    (variant) => {
      render(
        <Button variant={variant} icon="plus-icon">
          Ignored label
        </Button>,
      );

      const button = screen.getByRole("button", { name: "plus-icon" });
      expect(button).not.toHaveTextContent("Ignored label");
    },
  );

  it("disables the mute variant", () => {
    render(
      <Button variant="mute" disabled>
        Mute disabled
      </Button>,
    );

    expect(screen.getByText("Mute disabled")).toBeDisabled();
  });

  describe("google variant", () => {
    it("falls back to the default label when children are omitted", () => {
      render(<Button variant="google" />);

      expect(screen.getByRole("button")).toHaveTextContent(
        "Continue with Google",
      );
    });

    it("renders a custom label when children are given", () => {
      render(<Button variant="google">Google로 계속하기</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Google로 계속하기");
    });

    it("renders the google icon from the /icons.svg sprite", () => {
      render(<Button variant="google" />);

      const use = screen.getByRole("button").querySelector("use");
      expect(use).toHaveAttribute("href", "/icons.svg#google-icon");
    });

    it("uses the space-6 gap that Figma defines only for this variant", () => {
      render(<Button variant="google" />);

      expect(screen.getByRole("button").className).toContain(
        "gap-[var(--gb-spacing-1-5)]",
      );
    });

    it("disables the button when the disabled prop is true", () => {
      render(<Button variant="google" disabled />);

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("iconAfter", () => {
    it.each(["primary", "mute", "outline"] as const)(
      "renders a 16px trailing icon on the %s variant",
      (variant) => {
        render(
          <Button variant={variant} iconAfter="plus-icon">
            Next
          </Button>,
        );

        const svg = screen.getByRole("button").querySelector("svg");
        expect(svg?.getAttribute("class")).toContain("size-[16px]");
      },
    );

    it("renders a 12px trailing icon on the link variant", () => {
      render(
        <Button variant="link" iconAfter="plus-icon">
          Link
        </Button>,
      );

      const svg = screen.getByRole("button").querySelector("svg");
      expect(svg?.getAttribute("class")).toContain("size-[12px]");
    });

    it("renders nothing when iconAfter is omitted", () => {
      render(<Button variant="primary">Plain</Button>);

      expect(screen.getByRole("button").querySelector("svg")).toBeNull();
    });

    it.each(["ghost", "google"] as const)(
      "ignores iconAfter on the %s variant (no slot in Figma)",
      (variant) => {
        render(
          <Button variant={variant} iconAfter="plus-icon">
            Label
          </Button>,
        );

        const svgs = screen.getByRole("button").querySelectorAll("svg");
        // google은 선행 로고 1개만, ghost는 아이콘 자체가 없음
        expect(svgs).toHaveLength(variant === "google" ? 1 : 0);
      },
    );
  });
});
