import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Spinner } from "./spinner";
import styles from "./spinner.module.css";

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

    expect(screen.getByText("Processing")).toHaveClass(styles.outline);
  });

  it.each(["outline", "reversed", "primary"] as const)(
    "renders the %s variant with its own class",
    (variant) => {
      render(<Spinner variant={variant} label={variant} />);

      expect(screen.getByText(variant)).toHaveClass(styles[variant]);
    },
  );

  it("renders a spinning loader icon", () => {
    const { container } = render(<Spinner />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon).toHaveClass(styles.icon);
  });

  it("forwards additional props to the underlying span", () => {
    render(<Spinner data-testid="custom-spinner" />);

    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
  });

  // The icon is aria-hidden, so the label text is the only accessibility info — it must be
  // exposed as a live region for screen readers to announce "currently loading".
  it("announces its label as a live region", () => {
    render(<Spinner label="Processing" />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Processing");
  });
});
