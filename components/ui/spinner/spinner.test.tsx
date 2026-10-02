import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders the default label", () => {
    render(<Spinner />);

    expect(screen.getByText("Processing")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<Spinner label="Uploading" />);

    expect(screen.getByText("Uploading")).toBeInTheDocument();
  });

  it("defaults to the outline variant", () => {
    render(<Spinner />);

    const badge = screen.getByText("Processing");
    expect(badge.className).toContain("border-border");
  });

  it.each([
    ["outline", "border-border"],
    ["secondary", "bg-[var(--background-surface-secondary)]"],
    ["primary", "bg-primary"],
  ] as const)(
    "renders the %s variant with expected classes",
    (variant, expectedClass) => {
      render(<Spinner variant={variant} label={variant} />);

      const badge = screen.getByText(variant);
      expect(badge.className).toContain(expectedClass);
    },
  );

  it("renders a spinning loader icon", () => {
    const { container } = render(<Spinner />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.classList.contains("animate-spin")).toBe(true);
  });

  it("forwards additional props to the underlying span", () => {
    render(<Spinner data-testid="custom-spinner" />);

    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
  });
});
