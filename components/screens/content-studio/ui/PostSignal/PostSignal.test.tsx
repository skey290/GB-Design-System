import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { PostSignal, type PostSignalTrait } from "./PostSignal";

describe("PostSignal", () => {
  it("defaults to type=full and renders both cards with mock data", () => {
    render(<PostSignal />);

    expect(screen.getByText("How people see you")).toBeInTheDocument();
    expect(screen.getByText("Perception Alignment")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Expert & authoritative")).toBeInTheDocument();
    expect(screen.getByText("Community builder")).toBeInTheDocument();

    expect(screen.getByText("What people say")).toBeInTheDocument();
    expect(
      screen.getByText("Top perceived traits (from comments)"),
    ).toBeInTheDocument();
    expect(screen.getByText("#Relatable")).toBeInTheDocument();
    expect(screen.getByText("Empathy")).toBeInTheDocument();
    expect(screen.getByText("43 comments")).toBeInTheDocument();
    expect(
      screen.getByText('"I went through the same thing..."'),
    ).toBeInTheDocument();
  });

  it("renders the no-data placeholder for both cards when type=empty", () => {
    render(<PostSignal type="empty" />);

    expect(screen.getByText("No audience signals yet")).toBeInTheDocument();
    expect(screen.getByText("No feedback insights yet")).toBeInTheDocument();
    expect(screen.queryByText("Perception Alignment")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Top perceived traits (from comments)"),
    ).not.toBeInTheDocument();
  });

  it("renders custom empty-state copy", () => {
    render(
      <PostSignal
        type="empty"
        perceptionEmptyTitle="Nothing yet"
        perceptionEmptyDescription="Custom perception copy"
        feedbackEmptyTitle="Still waiting"
        feedbackEmptyDescription="Custom feedback copy"
      />,
    );

    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
    expect(screen.getByText("Custom perception copy")).toBeInTheDocument();
    expect(screen.getByText("Still waiting")).toBeInTheDocument();
    expect(screen.getByText("Custom feedback copy")).toBeInTheDocument();
  });

  it("derives the badge variant and label from each trait's status", () => {
    const traits: PostSignalTrait[] = [
      { label: "Matched trait", status: "matched", description: "d" },
      { label: "Weak trait", status: "weak-signal", description: "d" },
      { label: "Missing trait", status: "not-detected", description: "d" },
    ];
    render(<PostSignal traits={traits} />);

    expect(screen.getByText("Matched")).toBeInTheDocument();
    expect(screen.getByText("Weak signal")).toBeInTheDocument();
    expect(screen.getByText("Not detected")).toBeInTheDocument();
  });

  it("overrides the default badge label with `badgeLabel`", () => {
    const traits: PostSignalTrait[] = [
      {
        label: "Custom trait",
        status: "matched",
        description: "d",
        badgeLabel: "Strong fit",
      },
    ];
    render(<PostSignal traits={traits} />);

    expect(screen.getByText("Strong fit")).toBeInTheDocument();
    expect(screen.queryByText("Matched")).not.toBeInTheDocument();
  });

  it("renders a custom perceivedTraits list as hashtags", () => {
    render(<PostSignal perceivedTraits={["Bold", "Curious"]} />);

    expect(screen.getByText("#Bold")).toBeInTheDocument();
    expect(screen.getByText("#Curious")).toBeInTheDocument();
    expect(screen.queryByText("#Relatable")).not.toBeInTheDocument();
  });

  it("renders a custom perceptionLabel and perceptionPercent", () => {
    render(<PostSignal perceptionLabel="Brand Fit" perceptionPercent={42} />);

    expect(screen.getByText("Brand Fit")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });
});
