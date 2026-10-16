import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "./button";
import { ButtonGroupContext } from "../button-group/context";

describe("Button", () => {
  it("renders children as text content", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("defaults to the primary variant", () => {
    render(<Button>Primary</Button>);

    expect(screen.getByText("Primary")).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it.each(["primary", "mute", "outline", "link", "ghost"] as const)(
    "sets data-variant to %s",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it.each(["icon", "icon-ghost", "icon-rounded"] as const)(
    "sets data-variant to %s",
    (variant) => {
      render(
        <Button
          variant={variant}
          icon={<svg data-testid="icon" />}
          aria-label="Action"
        />,
      );

      expect(screen.getByRole("button")).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it("sets data-variant to google", () => {
    render(<Button variant="google" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "google",
    );
  });

  it.each(["icon", "icon-ghost", "icon-rounded"] as const)(
    "renders the %s icon-only variant with the given icon and no text content",
    (variant) => {
      render(
        <Button
          variant={variant}
          icon={<svg data-testid="my-icon" />}
          aria-label="Action"
        />,
      );

      const button = screen.getByRole("button", { name: "Action" });
      expect(button.querySelector('[data-testid="my-icon"]')).toBeInTheDocument();
    },
  );

  it("disables the button when the disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("disables the mute variant", () => {
    render(
      <Button variant="mute" disabled>
        Mute disabled
      </Button>,
    );

    expect(screen.getByText("Mute disabled")).toBeDisabled();
  });

  it("draws the link underline as data-variant=link (bottom border, not text-decoration — see Storybook)", () => {
    render(<Button variant="link">Link</Button>);

    expect(screen.getByText("Link")).toHaveAttribute("data-variant", "link");
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

  describe("ButtonGroupContext", () => {
    it("falls back to the group's disabled state when it has no disabled prop of its own", () => {
      render(
        <ButtonGroupContext.Provider value={{ disabled: true }}>
          <Button>Inherits</Button>
        </ButtonGroupContext.Provider>,
      );

      expect(screen.getByText("Inherits")).toBeDisabled();
    });

    it("lets its own disabled prop override the group's", () => {
      render(
        <ButtonGroupContext.Provider value={{ disabled: true }}>
          <Button disabled={false}>Overrides</Button>
        </ButtonGroupContext.Provider>,
      );

      expect(screen.getByText("Overrides")).not.toBeDisabled();
    });
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

    it("disables the button when the disabled prop is true", () => {
      render(<Button variant="google" disabled />);

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("icon slot on text variants", () => {
    it.each(["primary", "mute", "outline"] as const)(
      "renders the given icon after the label on the %s variant",
      (variant) => {
        render(
          <Button variant={variant} icon={<svg data-testid="trailing-icon" />}>
            Next
          </Button>,
        );

        expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
      },
    );

    it("renders the given icon after the label on the link variant", () => {
      render(
        <Button variant="link" icon={<svg data-testid="trailing-icon" />}>
          Link
        </Button>,
      );

      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });

    it("renders nothing when icon is omitted", () => {
      render(<Button variant="primary">Plain</Button>);

      expect(screen.getByRole("button").querySelector("svg")).toBeNull();
    });
  });
});
