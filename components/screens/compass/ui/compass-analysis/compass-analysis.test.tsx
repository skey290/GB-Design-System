import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { CompassAnalysis, type CompassAnalysisSelf } from "./compass-analysis";

beforeAll(() => {
  // Radix Tooltip's Arrow (useSize) uses ResizeObserver for positioning calculations,
  // which jsdom doesn't have — same polyfill pattern as components/ui/tooltip/tooltip.test.tsx
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

const selfA: CompassAnalysisSelf = {
  id: "a",
  image: "/a.jpg",
  imageAlt: "A",
  qualifiedReach: 8340,
  engagementIntensity: 14.3,
  growth: 20,
};
const selfB: CompassAnalysisSelf = {
  id: "b",
  image: "/b.jpg",
  imageAlt: "B",
  qualifiedReach: 6453,
  engagementIntensity: 1.8,
  growth: 60,
};

describe("CompassAnalysis", () => {
  it("renders both the dial ranking labels and the self avatars by default", () => {
    const { container } = render(
      <CompassAnalysis selves={[selfA, selfB]} label="Reach" />,
    );

    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(container.querySelectorAll("img").length).toBe(2);
  });

  it("hides the dial entirely when type='potential'", () => {
    const { container } = render(
      <CompassAnalysis type="potential" selves={[selfA, selfB]} />,
    );

    expect(screen.queryByText("1st")).toBeNull();
    expect(container.querySelectorAll("img").length).toBe(2);
  });

  it.each([
    ["reach", "Reach"],
    ["engagement", "Engagement"],
    ["reach-and-engagement", "Ranking"],
  ] as const)(
    "defaults the center label to match type=%s when label is not given",
    (type, expectedLabel) => {
      render(<CompassAnalysis type={type} selves={[selfA]} />);

      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    },
  );

  it("lets an explicit label override the type-based default", () => {
    render(
      <CompassAnalysis type="engagement" label="Custom" selves={[selfA]} />,
    );

    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.queryByText("Engagement")).toBeNull();
  });

  it("defaults potentialVariant to 'potential' and decorates the focus self", () => {
    render(<CompassAnalysis type="potential" selves={[selfA, selfB]} />);

    // Only selfB (60%), which has the largest growth, is the decorated target, so its badge exists,
    // while the rest don't have CompassSelfAvatar render the ring/badge at all.
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.queryByText("20%")).toBeNull();
  });

  it("forwards onSelfClick with the clicked self's index", () => {
    const onSelfClick = vi.fn();
    const { container } = render(
      <CompassAnalysis
        type="potential"
        selves={[selfA]}
        onSelfClick={onSelfClick}
      />,
    );

    (container.querySelector("img")?.closest("div") as HTMLElement).click();
    expect(onSelfClick).toHaveBeenCalledWith(0);
  });

  it("forwards onRetry for potentialVariant='potential-error'", () => {
    const onRetry = vi.fn();
    render(
      <CompassAnalysis
        type="potential"
        potentialVariant="potential-error"
        selves={[selfA]}
        onRetry={onRetry}
      />,
    );

    screen.getByText("Retry").click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("forwards coachmark to CompassDial's north badge when type is reach/engagement/reach-and-engagement", () => {
    render(
      <CompassAnalysis
        type="reach"
        selves={[selfA, selfB]}
        coachmark={{ title: "Most Reached: 8,340" }}
      />,
    );

    expect(screen.getByText("Most Reached: 8,340")).toBeInTheDocument();
  });

  it("forwards coachmark to the potential focus self's badge when type='potential'", () => {
    render(
      <CompassAnalysis
        type="potential"
        selves={[selfA, selfB]}
        coachmark={{ title: "Growth Potential: 80%" }}
      />,
    );

    expect(screen.getByText("Growth Potential: 80%")).toBeInTheDocument();
  });
});
