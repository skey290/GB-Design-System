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
    ["reversed", "bg-[var(--gb-background-surface-secondary)]"],
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

  // 아이콘은 aria-hidden이라 라벨 텍스트만이 접근성 정보다 — 라이브 리전으로
  // 노출해야 스크린리더가 "지금 로딩 중"을 전달받는다.
  it("announces its label as a live region", () => {
    render(<Spinner label="Processing" />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Processing");
  });
});
