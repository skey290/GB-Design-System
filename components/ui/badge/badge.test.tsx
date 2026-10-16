import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children as text content", () => {
    render(<Badge>3</Badge>);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("defaults to the outline variant and size 20", () => {
    render(<Badge>Outline</Badge>);

    const badge = screen.getByText("Outline");
    expect(badge).toHaveAttribute("data-variant", "outline");
    expect(badge).toHaveAttribute("data-size", "20");
  });

  it.each([
    "default",
    "reverse",
    "outline",
    "alarm",
    "success",
    "destructive",
  ] as const)("sets data-variant to %s", (variant) => {
    render(<Badge variant={variant}>{variant}</Badge>);

    expect(screen.getByText(variant)).toHaveAttribute(
      "data-variant",
      variant,
    );
  });

  it.each(["20", "28"] as const)("sets data-size to %s", (size) => {
    render(
      <Badge size={size} variant="default">
        Sized
      </Badge>,
    );

    expect(screen.getAllByText("Sized")[0]).toHaveAttribute(
      "data-size",
      size,
    );
  });

  it("renders the icon slot when provided", () => {
    render(
      <Badge icon={<svg data-testid="badge-icon" />} variant="default">
        With icon
      </Badge>,
    );

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });

  it("does not render an icon wrapper when icon is omitted", () => {
    const { container } = render(<Badge variant="default">No icon</Badge>);

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("renders the icon alone when children are omitted", () => {
    const { container } = render(
      <Badge icon={<svg data-testid="leading-icon" />} />,
    );

    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    expect(container.firstElementChild?.textContent).toBe("");
  });

  it("forwards additional props to the underlying span", () => {
    render(<Badge data-testid="custom-badge">Custom</Badge>);

    expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
  });
});
