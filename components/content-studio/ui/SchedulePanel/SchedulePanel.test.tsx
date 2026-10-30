import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SchedulePanel, type SchedulePanelGroup } from "./SchedulePanel";

beforeAll(() => {
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

  it("makes every row clickable (including type=archive) and calls onSlotClick with the full slot", async () => {
    const user = userEvent.setup();
    const onSlotClick = vi.fn();
    const groupsWithArchive: SchedulePanelGroup[] = [
      ...GROUPS,
      { date: "Sep 03", slots: [{ rowId: 3, type: "archive" }] },
    ];
    render(
      <SchedulePanel groups={groupsWithArchive} onSlotClick={onSlotClick} />,
    );

    await user.click(screen.getByText("11:00 AM"));
    await user.click(screen.getByText("Deleted at 08:12 AM"));

    expect(onSlotClick).toHaveBeenCalledTimes(2);
    expect(onSlotClick).toHaveBeenNthCalledWith(1, {
      rowId: 1,
      type: "posted",
      time: "11:00 AM",
    });
    expect(onSlotClick).toHaveBeenNthCalledWith(2, {
      rowId: 3,
      type: "archive",
    });
  });

  it("highlights the clicked row as active when uncontrolled (defaultSelectedRowId)", async () => {
    const user = userEvent.setup();
    render(<SchedulePanel defaultGroups={GROUPS} />);

    const draftRow = screen.getByText("Draft").closest("[data-type]");
    expect(draftRow).toHaveAttribute("data-status", "default");

    await user.click(screen.getByText("02:25 PM"));

    expect(draftRow).toHaveAttribute("data-status", "active");
  });

  it("does not change selection on click when controlled (selectedRowId)", async () => {
    const user = userEvent.setup();
    render(<SchedulePanel groups={GROUPS} selectedRowId={1} />);

    const draftRow = screen.getByText("Draft").closest("[data-type]");
    await user.click(screen.getByText("02:25 PM"));

    expect(draftRow).toHaveAttribute("data-status", "default");
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

  it("calls onScheduleAllDraft when the header CTA is clicked", async () => {
    const user = userEvent.setup();
    const onScheduleAllDraft = vi.fn();
    render(<SchedulePanel onScheduleAllDraft={onScheduleAllDraft} />);

    await user.click(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    );

    expect(onScheduleAllDraft).toHaveBeenCalledTimes(1);
  });

  it("turns every draft slot into scheduled when uncontrolled (defaultGroups) and Schedule All Draft is clicked", async () => {
    const user = userEvent.setup();
    const multiDraftGroups: SchedulePanelGroup[] = [
      {
        date: "Today, Sep 01",
        slots: [
          { rowId: 1, type: "posted", time: "11:00 AM" },
          { rowId: 2, type: "draft", time: "02:25 PM" },
        ],
      },
      {
        date: "Tomorrow, Sep 02",
        slots: [{ rowId: 3, type: "draft", time: "09:00 AM" }],
      },
    ];
    render(<SchedulePanel defaultGroups={multiDraftGroups} />);

    expect(screen.getAllByText("Draft")).toHaveLength(2);
    expect(screen.queryByText("Scheduled")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    );

    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
    expect(screen.getAllByText("Scheduled")).toHaveLength(2);
    expect(screen.getByText("Posted")).toBeInTheDocument();
  });

  it("does not mutate the list when controlled (groups prop) and Schedule All Draft is clicked", async () => {
    const user = userEvent.setup();
    render(<SchedulePanel groups={GROUPS} />);

    await user.click(
      screen.getByRole("button", { name: "Schedule All Draft" }),
    );

    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.queryByText("Scheduled")).not.toBeInTheDocument();
  });

  it("calls onCreateMorePost when the footer button is clicked", async () => {
    const user = userEvent.setup();
    const onCreateMorePost = vi.fn();
    render(<SchedulePanel onCreateMorePost={onCreateMorePost} />);

    await user.click(screen.getByRole("button", { name: "Create More Post" }));

    expect(onCreateMorePost).toHaveBeenCalledTimes(1);
  });

  it("appends extendDays new date groups with occurrencesPerDay empty slots, spread 6h apart from startTime, when uncontrolled and Create More Post is clicked", async () => {
    const user = userEvent.setup();
    const onCreateMorePost = vi.fn();
    render(
      <SchedulePanel
        defaultGroups={GROUPS}
        defaultDateRange={{ to: new Date(2026, 8, 3) }}
        onCreateMorePost={onCreateMorePost}
      />,
    );

    expect(screen.queryByText("No content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create More Post" }));

    expect(screen.getByText("Friday, Sep 04")).toBeInTheDocument();
    expect(screen.getByText("Saturday, Sep 05")).toBeInTheDocument();
    expect(screen.getByText("Sunday, Sep 06")).toBeInTheDocument();
    expect(screen.getAllByText("No content")).toHaveLength(9);
    expect(screen.getAllByText("09:00 AM")).toHaveLength(3);
    expect(screen.getAllByText("03:00 PM")).toHaveLength(3);
    expect(screen.getAllByText("09:00 PM")).toHaveLength(3);
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
