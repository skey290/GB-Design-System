import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";
import styles from "./checkbox.module.css";

describe("Checkbox", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox label="Subscribe" />);

    expect(screen.getByRole("checkbox", { name: "Subscribe" })).not.toBeChecked();
  });

  it("renders checked when defaultChecked is true", () => {
    render(<Checkbox label="Subscribe" defaultChecked />);

    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toBeChecked();
  });

  it("is indeterminate regardless of checked", () => {
    render(<Checkbox label="Subscribe" indeterminate checked={false} />);

    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toBePartiallyChecked();
  });

  it("toggles on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("toggles when the label text is clicked (htmlFor association)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    await user.click(screen.getByText("Subscribe"));

    expect(checkbox).toBeChecked();
  });

  it("calls onCheckedChange with the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox", { name: "Subscribe" }));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("respects checked as a controlled value and does not toggle on its own", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Subscribe"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).not.toBeChecked();
  });

  it("toggles on Space (native checkbox behavior)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    checkbox.focus();

    await user.keyboard(" ");
    expect(checkbox).toBeChecked();
  });

  // Native `<input type="checkbox">` only responds to Space, not Enter — this
  // is standard browser behavior, not something the component implements.
  it("does not toggle on Enter", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    checkbox.focus();

    await user.keyboard("{Enter}");
    expect(checkbox).not.toBeChecked();
  });

  it("does not toggle or call onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Subscribe" disabled onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  it("associates the label with the checkbox via id/htmlFor", () => {
    render(<Checkbox label="Subscribe" id="subscribe-checkbox" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toHaveAttribute("id", "subscribe-checkbox");
  });

  it("toggles normally when variant is 'mute'", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Subscribe"
        variant="mute"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
  });

  it("does not toggle or call onCheckedChange when disabled, even with variant='mute'", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Subscribe"
        variant="mute"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  it("renders both the check and dash icon elements (CSS controls which one is visible — see Storybook)", () => {
    const { container } = render(<Checkbox label="Subscribe" checked />);

    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("keeps the accessible name when the label is visually hidden", () => {
    render(<Checkbox label="Select all" showLabel={false} />);

    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Select all")).toHaveClass(styles.srOnly);
  });

  it("exposes the checkbox input through ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox label="Subscribe" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("checkbox", { name: "Subscribe" }));
  });
});
