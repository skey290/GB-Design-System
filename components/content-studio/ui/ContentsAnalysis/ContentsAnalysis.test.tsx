import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  ContentsAnalysis,
  type ContentsAnalysisGoal,
} from "./ContentsAnalysis";

describe("ContentsAnalysis", () => {
  it("defaults to variant=empty and shows the no-data state", () => {
    render(<ContentsAnalysis />);

    expect(screen.getByText("Posts This Month")).toBeInTheDocument();
    expect(screen.getByText("No uploads in June")).toBeInTheDocument();
    expect(
      screen.getByText(/Connect your calendar or drafts/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
  });

  it("renders a custom empty-state title and description", () => {
    render(
      <ContentsAnalysis
        emptyTitle="No posts yet"
        emptyDescription="Start creating content to see your analysis."
      />,
    );

    expect(screen.getByText("No posts yet")).toBeInTheDocument();
    expect(
      screen.getByText("Start creating content to see your analysis."),
    ).toBeInTheDocument();
  });

  it("renders the total, delta badge, and default goal rows for variant=expanded", () => {
    render(<ContentsAnalysis variant="expanded" />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    // "15" also appears as a calendar day cell, so scope to the <p> total value.
    expect(
      screen.getByText(
        (content, element) => element?.tagName === "P" && content === "15",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("+5")).toBeInTheDocument();
    expect(screen.getByText("from last month")).toBeInTheDocument();
    expect(screen.getByText("Weekly Goal Progress")).toBeInTheDocument();
    expect(screen.getByText("Posting Frequency")).toBeInTheDocument();
    expect(screen.getByText("Tone consistency")).toBeInTheDocument();
  });

  it("formats goal values as percent or fraction based on `format`", () => {
    const goals: ContentsAnalysisGoal[] = [
      { label: "Percent goal", current: 3, target: 4, format: "percent" },
      { label: "Fraction goal", current: 3, target: 4, format: "fraction" },
    ];
    render(<ContentsAnalysis variant="expanded" goals={goals} />);

    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("3/4")).toBeInTheDocument();
  });

  it("renders the embedded calendar and Published/Reserved/Draft legend for variant=expanded", () => {
    render(<ContentsAnalysis variant="expanded" />);

    expect(screen.getByText("Su")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Reserved")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("forwards calendarEvents to the embedded calendar as extra event dots", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");

    const { container: withoutEvents } = render(
      <ContentsAnalysis variant="expanded" calendarEvents={{}} />,
    );
    const baselineDots = withoutEvents.querySelectorAll(
      '[data-event="draft"][aria-hidden="true"]',
    ).length;

    const { container: withEvents } = render(
      <ContentsAnalysis
        variant="expanded"
        calendarEvents={{ [`${y}-${m}-01`]: "draft" }}
      />,
    );
    const dotsWithEvent = withEvents.querySelectorAll(
      '[data-event="draft"][aria-hidden="true"]',
    ).length;

    expect(dotsWithEvent).toBe(baselineDots + 1);
  });
});
