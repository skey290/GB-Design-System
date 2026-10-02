import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateSelect } from "./date-select";

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

describe("DateSelect", () => {
  it("renders the label and placeholder when no value is set", () => {
    render(<DateSelect label="Date to post" placeholder="MM.DD.YYYY" />);

    expect(screen.getByText("Date to post")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("MM.DD.YYYY");
  });

  it("formats the value as MM.DD.YYYY when a value is set", () => {
    render(<DateSelect value={new Date(2026, 8, 1)} />);

    expect(screen.getByRole("button")).toHaveTextContent("09.01.2026");
  });

  it("opens the calendar popover when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DateSelect value={new Date(2026, 8, 1)} />);

    await user.click(screen.getByRole("button"));

    expect(await within(document.body).findByText("Sep")).toBeInTheDocument();
  });

  it("calls onValueChange and closes the popover when a date is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateSelect value={new Date(2026, 8, 1)} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button"));
    const dayCell = await within(document.body).findByRole("button", {
      name: "15",
    });
    await user.click(dayCell);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(within(document.body).queryByText("Sep")).not.toBeInTheDocument();
  });

  it("does not open the popover when disabled", async () => {
    const user = userEvent.setup();
    render(<DateSelect value={new Date(2026, 8, 1)} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(within(document.body).queryByText("Sep")).not.toBeInTheDocument();
  });
});
