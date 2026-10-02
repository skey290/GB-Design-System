import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RangeSelect } from "./range-select";

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

describe("RangeSelect", () => {
  it("renders the placeholder when no value is set", () => {
    render(<RangeSelect placeholder="Select date range" />);

    expect(screen.getByRole("button")).toHaveTextContent("Select date range");
  });

  it("formats a complete range as MM/DD - MM/DD", () => {
    render(
      <RangeSelect
        value={{ from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) }}
      />,
    );

    expect(screen.getByRole("button")).toHaveTextContent("09/01 - 09/30");
  });

  it("opens the range calendar popover showing two adjacent months", async () => {
    const user = userEvent.setup();
    render(<RangeSelect value={{ from: new Date(2026, 8, 1) }} />);

    await user.click(screen.getByRole("button"));

    expect(await within(document.body).findByText("Sep")).toBeInTheDocument();
    expect(within(document.body).getByText("Oct")).toBeInTheDocument();
  });

  it("builds a range from two clicks and closes once both ends are set", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RangeSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button"));

    const [firstCell] = await within(document.body).findAllByRole("button", {
      name: "10",
    });
    await user.click(firstCell);

    expect(onValueChange).toHaveBeenLastCalledWith({
      from: expect.any(Date),
      to: undefined,
    });
  });

  it("does not open the popover when disabled", async () => {
    const user = userEvent.setup();
    render(<RangeSelect disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(within(document.body).queryByText("Sep")).not.toBeInTheDocument();
  });
});
