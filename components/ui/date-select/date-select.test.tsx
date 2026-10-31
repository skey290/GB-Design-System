import * as React from "react";
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

  it("calls onValueChange and keeps the popover open when a date is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateSelect value={new Date(2026, 8, 1)} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button"));
    const dayCell = await within(document.body).findByRole("button", {
      name: "15",
    });
    await user.click(dayCell);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    // Stays open so the user can review or change the pick — closing is their own action.
    expect(within(document.body).getByText("Sep")).toBeInTheDocument();
  });

  it("does not open the popover when disabled", async () => {
    const user = userEvent.setup();
    render(<DateSelect value={new Date(2026, 8, 1)} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(within(document.body).queryByText("Sep")).not.toBeInTheDocument();
  });

  it("adds the dark class to the popover by default", async () => {
    const user = userEvent.setup();
    render(<DateSelect value={new Date(2026, 8, 1)} />);

    await user.click(screen.getByRole("button"));
    await within(document.body).findByText("Sep");

    expect(document.querySelector(".dark")).toBeInTheDocument();
  });

  it("omits the dark class from the popover when shouldForceDark is false", async () => {
    const user = userEvent.setup();
    render(<DateSelect value={new Date(2026, 8, 1)} shouldForceDark={false} />);

    await user.click(screen.getByRole("button"));
    await within(document.body).findByText("Sep");

    expect(document.querySelector(".dark")).not.toBeInTheDocument();
  });

  it("forwards ref to the trigger button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<DateSelect ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("fills the container by default", () => {
    const { container } = render(<DateSelect />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).toHaveAttribute(
      "data-fit-container",
      "true",
    );
  });

  it("keeps the fixed width when shouldFitContainer is false", () => {
    const { container } = render(<DateSelect shouldFitContainer={false} />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).not.toHaveAttribute(
      "data-fit-container",
    );
  });
});
