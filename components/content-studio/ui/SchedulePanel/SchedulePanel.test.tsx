import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SchedulePanel, type SchedulePanelGroup } from "./SchedulePanel";

const GROUPS: SchedulePanelGroup[] = [
  {
    date: "Today, Sep 01",
    slots: [
      { rowId: 1, type: "posted", time: "11:00 AM" },
      { rowId: 2, type: "draft", time: "02:25 PM" },
    ],
  },
];

describe("SchedulePanel", () => {
  it("defaults to type=default, status=default", () => {
    render(<SchedulePanel />);

    const root = screen.getByText("Schedule All Draft").closest("[data-type]");
    expect(root).toHaveAttribute("data-type", "default");
    expect(root).toHaveAttribute("data-status", "default");
  });

  it("renders the range select, settings button, and header CTA for type=default", () => {
    render(<SchedulePanel />);

    expect(
      screen.getByRole("button", { name: "Select date range" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open schedule settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    ).toBeInTheDocument();
  });

  it("renders date groups and their ScheduleSlot rows", () => {
    render(<SchedulePanel groups={GROUPS} />);

    expect(screen.getByText("Today, Sep 01")).toBeInTheDocument();
    expect(screen.getByText("11:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows the footer Create More Post button for type=default", () => {
    render(<SchedulePanel />);

    expect(
      screen.getByRole("button", { name: "Create More Post" }),
    ).toBeInTheDocument();
  });

  it("disables the header controls and footer when status=disabled", () => {
    render(<SchedulePanel status="disabled" />);

    expect(
      screen.getByRole("button", { name: "Select date range" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Open schedule settings" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Create More Post" }),
    ).toBeDisabled();
  });

  it("renders type=in process with a disabled header and no footer", () => {
    render(<SchedulePanel type="in process" />);

    expect(
      screen.getByRole("button", { name: "Select date range" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Open schedule settings" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Create More Post" }),
    ).not.toBeInTheDocument();
  });

  it("renders type=no content with an enabled CTA and the empty state, no groups/footer", () => {
    render(<SchedulePanel type="no content" groups={GROUPS} />);

    expect(
      screen.getByRole("button", { name: "Create Your Brand-fit Post" }),
    ).toBeEnabled();
    expect(screen.getByText("No Post Created")).toBeInTheDocument();
    expect(screen.queryByText("Today, Sep 01")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create More Post" }),
    ).not.toBeInTheDocument();
  });

  it("renders type=archived with no settings button/header CTA and a disabled footer", () => {
    render(
      <SchedulePanel
        type="archived"
        groups={[{ date: "Sep 01", slots: [{ rowId: 1, type: "archive" }] }]}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Open schedule settings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Schedule All Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select date range" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Create More Post" }),
    ).toBeDisabled();
  });

  it("calls onOpenSettings when the settings button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenSettings = vi.fn();
    render(<SchedulePanel onOpenSettings={onOpenSettings} />);

    await user.click(
      screen.getByRole("button", { name: "Open schedule settings" }),
    );

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onCreateMorePost when the footer button is clicked", async () => {
    const user = userEvent.setup();
    const onCreateMorePost = vi.fn();
    render(<SchedulePanel onCreateMorePost={onCreateMorePost} />);

    await user.click(screen.getByRole("button", { name: "Create More Post" }));

    expect(onCreateMorePost).toHaveBeenCalledTimes(1);
  });

  it("prepends an empty slot to the first group when uncontrolled (defaultGroups) and Create More Post is clicked", async () => {
    const user = userEvent.setup();
    const onCreateMorePost = vi.fn();
    render(
      <SchedulePanel
        defaultGroups={GROUPS}
        onCreateMorePost={onCreateMorePost}
      />,
    );

    expect(screen.queryByText("No content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create More Post" }));

    expect(screen.getByText("No content")).toBeInTheDocument();
    expect(onCreateMorePost).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the list when controlled (groups prop) and Create More Post is clicked", async () => {
    const user = userEvent.setup();
    render(<SchedulePanel groups={GROUPS} />);

    await user.click(screen.getByRole("button", { name: "Create More Post" }));

    expect(screen.queryByText("No content")).not.toBeInTheDocument();
  });

  it("calls onCreateBrandFitPost when the no-content CTA is clicked", async () => {
    const user = userEvent.setup();
    const onCreateBrandFitPost = vi.fn();
    render(
      <SchedulePanel
        type="no content"
        onCreateBrandFitPost={onCreateBrandFitPost}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Create Your Brand-fit Post" }),
    );

    expect(onCreateBrandFitPost).toHaveBeenCalledTimes(1);
  });
});
