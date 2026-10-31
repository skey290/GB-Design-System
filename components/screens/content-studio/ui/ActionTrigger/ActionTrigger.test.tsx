import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { ActionTrigger, type ActionTriggerItem } from "./ActionTrigger";

describe("ActionTrigger", () => {
  it("defaults to type=full and renders the Action Items card and the recommendation card", () => {
    render(<ActionTrigger />);

    expect(screen.getByText("Action Items")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText("Empty Slot on Jul 2")).toBeInTheDocument();
    expect(screen.getByText("Influential voice gap")).toBeInTheDocument();
    expect(screen.getByText("Niche leader signal weak")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getAllByText("Brand Goal")).toHaveLength(2);
    expect(
      screen.getByText("Updated daily · Prioritized by urgency"),
    ).toBeInTheDocument();

    expect(screen.getByText("Why don't you try this?")).toBeInTheDocument();
    expect(
      screen.getByText("Turn expertise into authority"),
    ).toBeInTheDocument();
    expect(screen.getByText("Try it out")).toBeInTheDocument();
  });

  it("renders the no-post placeholder when type=empty", () => {
    render(<ActionTrigger type="empty" />);

    expect(screen.getByText("No post yet")).toBeInTheDocument();
    expect(screen.getByText("Create posts")).toBeInTheDocument();
    expect(screen.queryByText("3 items")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Why don't you try this?"),
    ).not.toBeInTheDocument();
  });

  it("derives the item count from the items array length", () => {
    const items: ActionTriggerItem[] = [
      { label: "Row one", description: "d", badgeLabel: "Brand Goal" },
      { label: "Row two", description: "d", badgeLabel: "Brand Goal" },
    ];
    render(<ActionTrigger items={items} />);

    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  it("calls each item's onAction when its button is clicked", () => {
    const onAction = vi.fn();
    const items: ActionTriggerItem[] = [
      {
        label: "Row one",
        description: "d",
        badgeLabel: "Brand Goal",
        onAction,
      },
    ];
    render(<ActionTrigger items={items} />);

    fireEvent.click(screen.getByText("Create a post"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onTryItOut and onCreatePosts", () => {
    const onTryItOut = vi.fn();
    const onCreatePosts = vi.fn();
    render(<ActionTrigger onTryItOut={onTryItOut} />);
    fireEvent.click(screen.getByText("Try it out"));
    expect(onTryItOut).toHaveBeenCalledTimes(1);

    render(<ActionTrigger type="empty" onCreatePosts={onCreatePosts} />);
    fireEvent.click(screen.getByText("Create posts"));
    expect(onCreatePosts).toHaveBeenCalledTimes(1);
  });

  it("overrides recommendation copy and labels via props", () => {
    render(
      <ActionTrigger
        title="Custom title"
        recommendationTitle="Custom recommendation"
        recommendationHeadline="Custom headline"
        recommendationDescription="Custom description"
        recommendationActionLabel="Go"
        footerCaption="Custom caption"
      />,
    );

    expect(screen.getByText("Custom title")).toBeInTheDocument();
    expect(screen.getByText("Custom recommendation")).toBeInTheDocument();
    expect(screen.getByText("Custom headline")).toBeInTheDocument();
    expect(screen.getByText("Custom description")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.getByText("Custom caption")).toBeInTheDocument();
  });

  it("overrides empty-state copy via props", () => {
    render(
      <ActionTrigger
        type="empty"
        emptyTitle="Nothing yet"
        emptyDescription="Custom empty copy"
        emptyActionLabel="Start now"
      />,
    );

    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
    expect(screen.getByText("Custom empty copy")).toBeInTheDocument();
    expect(screen.getByText("Start now")).toBeInTheDocument();
  });
});
