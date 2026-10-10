import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Scrollbar } from "./scrollbar";

describe("Scrollbar", () => {
  it("renders its children", () => {
    render(
      <Scrollbar>
        <p>Scrollable content</p>
      </Scrollbar>,
    );

    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("defaults to the thick thickness", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);

    expect(container.firstElementChild?.className).toContain(
      "[&::-webkit-scrollbar]:w-[10px]",
    );
  });

  it.each([
    ["thick", "[&::-webkit-scrollbar]:w-[10px]"],
    ["thin", "[&::-webkit-scrollbar]:w-[5px]"],
  ] as const)(
    "renders the %s thickness at the Figma width",
    (thickness, expectedClass) => {
      const { container } = render(
        <Scrollbar thickness={thickness}>content</Scrollbar>,
      );

      expect(container.firstElementChild?.className).toContain(expectedClass);
    },
  );

  it("applies the Figma track and thumb color tokens", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);
    const { className } = container.firstElementChild as HTMLElement;

    expect(className).toContain(
      "[&::-webkit-scrollbar-track]:bg-[var(--gb-background-subtler)]",
    );
    expect(className).toContain(
      "[&::-webkit-scrollbar-thumb]:bg-[var(--gb-background-subtle)]",
    );
  });

  it("uses the pill radius on both track and thumb", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);
    const { className } = container.firstElementChild as HTMLElement;

    expect(className).toContain(
      "[&::-webkit-scrollbar-track]:rounded-[var(--gb-radius-scale-full)]",
    );
    expect(className).toContain(
      "[&::-webkit-scrollbar-thumb]:rounded-[var(--gb-radius-scale-full)]",
    );
  });

  it("sets the firefox scrollbar-color fallback", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);

    expect(container.firstElementChild?.className).toContain(
      "[scrollbar-color:var(--gb-background-subtle)_var(--gb-background-subtler)]",
    );
  });

  it.each([
    ["thick", "[scrollbar-width:auto]"],
    ["thin", "[scrollbar-width:thin]"],
  ] as const)(
    "maps the %s thickness onto the firefox scrollbar-width keyword",
    (thickness, expectedClass) => {
      const { container } = render(
        <Scrollbar thickness={thickness}>content</Scrollbar>,
      );

      expect(container.firstElementChild?.className).toContain(expectedClass);
    },
  );

  it("scrolls vertically only", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);
    const { className } = container.firstElementChild as HTMLElement;

    expect(className).toContain("overflow-y-auto");
    expect(className).toContain("overflow-x-hidden");
  });

  it("does not define hover or active states (Figma has none)", () => {
    const { container } = render(<Scrollbar>content</Scrollbar>);
    const { className } = container.firstElementChild as HTMLElement;

    expect(className).not.toContain("hover:");
    expect(className).not.toContain("active:");
  });

  it("merges a caller className", () => {
    const { container } = render(
      <Scrollbar className="h-[200px]">content</Scrollbar>,
    );

    expect(container.firstElementChild?.className).toContain("h-[200px]");
  });

  it("forwards additional props to the scroll container", () => {
    render(<Scrollbar data-testid="scroll-area">content</Scrollbar>);

    expect(screen.getByTestId("scroll-area")).toBeInTheDocument();
  });

  it("forwards ref to the scroll container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Scrollbar ref={ref}>content</Scrollbar>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
