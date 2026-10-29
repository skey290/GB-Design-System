import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScheduleSettingsPanel } from "./ScheduleSettingsPanel";

describe("ScheduleSettingsPanel", () => {
  it("defaults to the Daily tab with no secondary recurrence field", () => {
    render(<ScheduleSettingsPanel />);

    expect(screen.getByRole("tab", { name: "Daily" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.queryByText("On Every")).not.toBeInTheDocument();
    expect(screen.queryByText("On this date")).not.toBeInTheDocument();
    expect(screen.queryByText("Every")).not.toBeInTheDocument();
  });

  it("renders the shared On Each Day section and Save button", () => {
    render(<ScheduleSettingsPanel />);

    expect(screen.getByText("On Each Day")).toBeInTheDocument();
    expect(
      screen.getByText("How often would you like to post?"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("When would you like to post?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("switches tabs and shows the Weekly weekday picker", async () => {
    const user = userEvent.setup();
    render(<ScheduleSettingsPanel />);

    await user.click(screen.getByRole("tab", { name: "Weekly" }));

    expect(screen.getByText("On Every")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "mon" })).toBeInTheDocument();
  });

  it("toggles a weekday pill's selected state", async () => {
    const user = userEvent.setup();
    const onSelectedWeekdaysChange = vi.fn();
    render(
      <ScheduleSettingsPanel
        defaultRepeatType="weekly"
        onSelectedWeekdaysChange={onSelectedWeekdaysChange}
      />,
    );

    const monday = screen.getByRole("button", { name: "mon" });
    expect(monday).toHaveAttribute("aria-pressed", "false");

    await user.click(monday);

    expect(monday).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedWeekdaysChange).toHaveBeenCalledWith(["mon"]);
  });

  it("shows the Monthly day-of-month field", async () => {
    const user = userEvent.setup();
    render(<ScheduleSettingsPanel />);

    await user.click(screen.getByRole("tab", { name: "Monthly" }));

    expect(screen.getByText("On this date")).toBeInTheDocument();
    expect(screen.getByLabelText("Day of every month")).toBeInTheDocument();
  });

  it("shows the Custom interval count and unit select", async () => {
    const user = userEvent.setup();
    render(<ScheduleSettingsPanel />);

    await user.click(screen.getByRole("tab", { name: "Custom" }));

    expect(screen.getByLabelText("Repeat interval")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("increments and decrements the occurrences-per-day stepper", async () => {
    const user = userEvent.setup();
    const onOccurrencesPerDayChange = vi.fn();
    render(
      <ScheduleSettingsPanel
        defaultOccurrencesPerDay="1"
        onOccurrencesPerDayChange={onOccurrencesPerDayChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Increase occurrences per day" }),
    );
    expect(onOccurrencesPerDayChange).toHaveBeenLastCalledWith("2");

    await user.click(
      screen.getByRole("button", { name: "Decrease occurrences per day" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Decrease occurrences per day" }),
    );
    expect(onOccurrencesPerDayChange).toHaveBeenLastCalledWith("0");
  });

  it("calls onBack when the back button is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<ScheduleSettingsPanel onBack={onBack} />);

    await user.click(
      screen.getByRole("button", { name: "Back to schedule panel" }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSave when the Save button is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ScheduleSettingsPanel onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onDeleteTime when the time row's delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDeleteTime = vi.fn();
    render(<ScheduleSettingsPanel onDeleteTime={onDeleteTime} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDeleteTime).toHaveBeenCalledTimes(1);
  });

  it("supports a controlled repeatType", async () => {
    const user = userEvent.setup();
    const onRepeatTypeChange = vi.fn();
    render(
      <ScheduleSettingsPanel
        repeatType="daily"
        onRepeatTypeChange={onRepeatTypeChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Custom" }));

    expect(onRepeatTypeChange).toHaveBeenCalledWith("custom");
    // Controlled: stays on Daily until the parent passes repeatType="custom".
    expect(screen.getByRole("tab", { name: "Daily" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
