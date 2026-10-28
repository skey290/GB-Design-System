import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { CompassSelfCluster } from "./compass-self-cluster";

beforeAll(() => {
  // Radix Tooltip's Arrow (useSize) uses ResizeObserver for its positioning
  // calculation, which jsdom doesn't have — same polyfill pattern as
  // components/ui/tooltip/tooltip.test.tsx
  if (!("ResizeObserver" in window)) {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = vi
      .fn()
      .mockImplementation(function ResizeObserverMock() {
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      });
  }
});

const selfA = { image: "/a.jpg", imageAlt: "A" };
const selfB = { image: "/b.jpg", imageAlt: "B" };

/**
 * An undecorated self has CompassSelfAvatar not render the ring/connector/
 * badge at all, so "not visible" is checked by asserting the badge text is
 * entirely absent from the DOM.
 */
function isBadgeVisible(percentText: string): boolean {
  return screen.queryByText(percentText) !== null;
}

describe("CompassSelfCluster", () => {
  it("fills 8 empty slots when no selves are given", () => {
    const { container } = render(<CompassSelfCluster selves={[]} />);

    expect(container.querySelectorAll("img").length).toBe(0);
    expect(screen.getAllByText("No").length).toBe(8);
  });

  it("fills selves starting from north clockwise and leaves the rest empty", () => {
    const { container } = render(
      <CompassSelfCluster selves={[selfA, selfB]} />,
    );

    expect(container.querySelectorAll("img").length).toBe(2);
    expect(screen.getAllByText("No").length).toBe(6);
  });

  it("shows the reach-or-engagement label by default", () => {
    render(<CompassSelfCluster selves={[selfA]} />);

    expect(screen.getByText("Reach")).toBeInTheDocument();
  });

  it("accepts a custom label for reach-or-engagement", () => {
    render(<CompassSelfCluster selves={[selfA]} label="Engagement" />);

    expect(screen.getByText("Engagement")).toBeInTheDocument();
  });

  it("shows the fixed 'Growth Potential' label and ignores the label prop for growth sets", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[{ ...selfA, growth: 40 }]}
        label="Should be ignored"
      />,
    );

    expect(screen.getByText("Growth Potential")).toBeInTheDocument();
    expect(screen.queryByText("Should be ignored")).toBeNull();
  });

  it("decorates only the single self with growth potential when there is exactly one", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[{ ...selfA, growth: 40 }]}
      />,
    );

    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("decorates only the self with the highest growth when there are 2+", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[
          { ...selfA, growth: 20 },
          { ...selfB, growth: 70 },
        ]}
      />,
    );

    expect(isBadgeVisible("70%")).toBe(true);
    expect(isBadgeVisible("20%")).toBe(false);
  });

  it("keeps the focus self's growth decoration when that self is also active", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[
          { ...selfA, growth: 20 },
          { ...selfB, growth: 60 },
        ]}
        activeSelfIndex={1}
      />,
    );

    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("Go to")).toBeInTheDocument();
    expect(screen.getByText("Content Studio")).toBeInTheDocument();
  });

  it("keeps the focus self's growth decoration when an empty slot is active instead", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[{ ...selfA, growth: 60 }]}
        activeEmptyPosition={45}
      />,
    );

    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("Go to")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
  });

  it("moves the growth decoration to a non-focus self when it is hovered, and removes it from the default focus self", () => {
    const { container } = render(
      <CompassSelfCluster
        variant="potential"
        selves={[
          { ...selfA, growth: 20 },
          { ...selfB, growth: 60 },
        ]}
      />,
    );

    // Default: selfB (60%), which has the highest growth, is decorated
    expect(isBadgeVisible("60%")).toBe(true);
    expect(isBadgeVisible("20%")).toBe(false);

    // Hovering selfA (non-focus) moves the decoration to selfA and removes
    // selfB's decoration. The position wrapper (PositionedSatellite) always
    // stays the same DOM node regardless of decoration state, so we grab it
    // once before hovering and reuse it for both enter and leave.
    const selfAWrapper = container.querySelector(`img[alt="${selfA.imageAlt}"]`)
      ?.parentElement?.parentElement?.parentElement as HTMLElement;
    fireEvent.mouseEnter(selfAWrapper);

    expect(isBadgeVisible("20%")).toBe(true);
    expect(isBadgeVisible("60%")).toBe(false);

    // Once the hover ends, it reverts back to the default focus (selfB)
    fireEvent.mouseLeave(selfAWrapper);
    expect(isBadgeVisible("60%")).toBe(true);
    expect(isBadgeVisible("20%")).toBe(false);
  });

  it("hides all growth decoration while an empty slot is hovered", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[{ ...selfA, growth: 60 }]}
      />,
    );

    expect(isBadgeVisible("60%")).toBe(true);

    // The hover handler is attached to the position wrapper
    // (PositionedSatellite), not the empty avatar itself — the empty slot
    // itself never remounts, but we use the wrapper consistently anyway.
    const emptySlotWrapper = screen
      .getAllByText("No")[0]
      .closest("div[data-slot='compass-self-avatar-empty']")?.parentElement
      ?.parentElement as HTMLElement;
    fireEvent.mouseEnter(emptySlotWrapper);

    expect(isBadgeVisible("60%")).toBe(false);

    fireEvent.mouseLeave(emptySlotWrapper);
    expect(isBadgeVisible("60%")).toBe(true);
  });

  it("shows Estimate (red badge, no overlay text) only for the resting default focus self", () => {
    render(
      <CompassSelfCluster
        variant="potential-estimate"
        selves={[{ ...selfA, growth: 60, estimate: true }]}
      />,
    );

    expect(screen.getByText("60%")).toHaveAttribute("data-variant", "alarm");
    expect(screen.getByText("Estimate")).toBeInTheDocument();
    expect(screen.queryByText("Go to")).toBeNull();
  });

  it("never shows the Estimate overlay text on a hovered self, but the badge color still follows that self's own estimate flag", () => {
    const { container } = render(
      <CompassSelfCluster
        variant="potential-estimate"
        selves={[
          { ...selfA, growth: 60, estimate: false },
          { ...selfB, growth: 20, estimate: true },
        ]}
      />,
    );

    // Hovering selfB (estimate=true) immediately switches the indicator text
    // from Estimate to Content Studio, but the badge color still follows
    // selfB's own data state regardless of hover, so it stays red (alarm) —
    // the chip color must not change on hover.
    const selfBWrapper = container.querySelector(`img[alt="${selfB.imageAlt}"]`)
      ?.parentElement?.parentElement?.parentElement as HTMLElement;
    fireEvent.mouseEnter(selfBWrapper);

    expect(isBadgeVisible("20%")).toBe(true);
    expect(screen.getByText("20%")).toHaveAttribute("data-variant", "alarm");
    expect(screen.queryByText("Estimate")).toBeNull();
    expect(screen.getByText("Go to")).toBeInTheDocument();
    expect(screen.getByText("Content Studio")).toBeInTheDocument();
  });

  it("switches the focus badge to alarm styling for potential-estimate", () => {
    render(
      <CompassSelfCluster
        variant="potential-estimate"
        selves={[{ ...selfA, growth: 25 }]}
      />,
    );

    expect(screen.getByText("25%")).toHaveAttribute("data-variant", "alarm");
    expect(screen.getByText("Estimate")).toBeInTheDocument();
  });

  it("shows the global error state with plain avatars (no decoration) and a Retry button", () => {
    const onRetry = vi.fn();
    const { container } = render(
      <CompassSelfCluster
        variant="potential-error"
        selves={[{ ...selfA, growth: 90 }]}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("We couldn't fetch your data")).toBeInTheDocument();
    expect(container.querySelectorAll("img").length).toBe(1);
    expect(screen.getAllByText("No").length).toBe(7);
    expect(screen.queryByText("90%")).toBeNull();

    screen.getByText("Retry").click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("calls onSelfClick with the self index when a filled avatar is clicked", () => {
    const onSelfClick = vi.fn();
    const { container } = render(
      <CompassSelfCluster selves={[selfA]} onSelfClick={onSelfClick} />,
    );

    (container.querySelector("img")?.closest("div") as HTMLElement).click();
    expect(onSelfClick).toHaveBeenCalledWith(0);
  });

  it("calls onEmptySlotClick with the position when an empty slot is clicked", () => {
    const onEmptySlotClick = vi.fn();
    render(
      <CompassSelfCluster selves={[]} onEmptySlotClick={onEmptySlotClick} />,
    );

    screen
      .getAllByText("No")[0]
      .closest("div[data-slot='compass-self-avatar-empty']")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onEmptySlotClick).toHaveBeenCalled();
  });

  it("marks the empty slot at activeEmptyPosition as active ('Go to Assets')", () => {
    render(<CompassSelfCluster selves={[]} activeEmptyPosition={0} />);

    expect(screen.getByText("Go to")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
  });

  it("shows the coachmark tooltip on the resting default focus self's badge", () => {
    render(
      <CompassSelfCluster
        variant="potential"
        selves={[
          { ...selfA, growth: 20 },
          { ...selfB, growth: 60 },
        ]}
        coachmark={{
          title: "Growth Potential: 80%",
          description: "Start posting to turn this potential into real reach.",
        }}
      />,
    );

    // selfB (growth=60) is the default focus, so the coachmark only attaches to its badge.
    expect(screen.getByText("Growth Potential: 80%")).toBeInTheDocument();
  });

  it("hides the coachmark while a different self is hovered", () => {
    const { container } = render(
      <CompassSelfCluster
        variant="potential"
        selves={[
          { ...selfA, growth: 20 },
          { ...selfB, growth: 60 },
        ]}
        coachmark={{ title: "Growth Potential: 80%" }}
      />,
    );

    expect(screen.getByText("Growth Potential: 80%")).toBeInTheDocument();

    const selfAWrapper = container.querySelector(`img[alt="${selfA.imageAlt}"]`)
      ?.parentElement?.parentElement?.parentElement as HTMLElement;
    fireEvent.mouseEnter(selfAWrapper);

    expect(screen.queryByText("Growth Potential: 80%")).toBeNull();
  });

  it("ignores coachmark for the reach-or-engagement variant", () => {
    render(
      <CompassSelfCluster
        selves={[selfA]}
        coachmark={{ title: "Growth Potential: 80%" }}
      />,
    );

    expect(screen.queryByText("Growth Potential: 80%")).toBeNull();
  });
});
