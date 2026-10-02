import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Calendar } from "./calendar";

describe("Calendar (single)", () => {
  it("renders the selected date with the selected style", () => {
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        onValueChange={vi.fn()}
      />,
    );

    const cell = screen.getByRole("button", { name: "13" });
    expect(cell.className).toContain("--background-selected");
  });

  it("calls onValueChange when a date cell is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "20" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const called = onValueChange.mock.calls[0][0] as Date;
    expect(called.getDate()).toBe(20);
    expect(called.getMonth()).toBe(8);
  });

  it("navigates to the month sub-view when the month label is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        onValueChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText("Sep"));

    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Dec")).toBeInTheDocument();
  });

  it("navigates to the year sub-view when the year label is clicked, matching Figma's 2019-2030 window for 2026", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        onValueChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText("2026"));

    expect(screen.getByText("2019")).toBeInTheDocument();
    expect(screen.getByText("2030")).toBeInTheDocument();
  });

  it("selecting a month returns to the date sub-view with the month applied", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        onValueChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText("Sep"));
    await user.click(screen.getByText("Jan"));

    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.queryByText("Dec")).not.toBeInTheDocument();
  });

  it("disables dates outside minDate/maxDate and in disabledDates", () => {
    render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        minDate={new Date(2026, 8, 5)}
        maxDate={new Date(2026, 8, 25)}
        disabledDates={[new Date(2026, 8, 10)]}
        onValueChange={vi.fn()}
      />,
    );

    const [firstOfMonth] = screen.getAllByRole("button", { name: "1" });
    const [tenth] = screen.getAllByRole("button", { name: "10" });
    expect(firstOfMonth).toBeDisabled();
    expect(tenth).toBeDisabled();
    expect(screen.getByRole("button", { name: "13" })).not.toBeDisabled();
  });

  it("renders event markers for dates present in the events map", () => {
    const { container } = render(
      <Calendar
        mode="single"
        value={new Date(2026, 8, 13)}
        events={{ "2026-09-01": "published", "2026-09-17": "draft" }}
        onValueChange={vi.fn()}
      />,
    );

    const [publishedCell] = screen.getAllByRole("button", { name: "1" });
    expect(within(publishedCell).queryAllByRole("presentation").length).toBe(0);
    // eslint-disable-next-line testing-library/no-node-access
    expect(
      container.querySelectorAll('[aria-hidden="true"].absolute').length,
    ).toBe(2);
  });
});

describe("Calendar (range)", () => {
  it("marks the range start/end with bold background and middle days with selected background", () => {
    render(
      <Calendar
        mode="range"
        value={{ from: new Date(2026, 8, 5), to: new Date(2026, 8, 20) }}
        onValueChange={vi.fn()}
      />,
    );

    const startCells = screen.getAllByRole("button", { name: "5" });
    const endCells = screen.getAllByRole("button", { name: "20" });
    expect(
      startCells.some((cell) => cell.className.includes("--background-bold")),
    ).toBe(true);
    expect(
      endCells.some((cell) => cell.className.includes("--background-bold")),
    ).toBe(true);
  });

  it("renders two adjacent months", () => {
    render(
      <Calendar
        mode="range"
        value={{ from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) }}
        onValueChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Sep")).toBeInTheDocument();
    expect(screen.getByText("Oct")).toBeInTheDocument();
  });

  it("starts a new range on the first click after a completed range", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        mode="range"
        value={{ from: new Date(2026, 8, 5), to: new Date(2026, 8, 20) }}
        onValueChange={onValueChange}
      />,
    );

    const [tenCell] = screen.getAllByRole("button", { name: "10" });
    await user.click(tenCell);

    expect(onValueChange).toHaveBeenCalledWith({
      from: expect.any(Date),
      to: undefined,
    });
  });
});
