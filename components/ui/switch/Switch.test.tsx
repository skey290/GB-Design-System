import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders with the default label and off state", () => {
    render(<Switch />);

    const toggle = screen.getByRole("switch", { name: "switch" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("renders a custom label", () => {
    render(<Switch label="알림 받기" />);

    expect(
      screen.getByRole("switch", { name: "알림 받기" }),
    ).toBeInTheDocument();
  });

  it("toggles on/off state when clicked (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Switch label="switch" />);

    const toggle = screen.getByRole("switch", { name: "switch" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls onCheckedChange with the next value when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="switch" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "switch" }));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("respects checked as a controlled value and does not flip on its own", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="switch"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "switch" });
    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // controlled: aria-checked stays false because the `checked` prop was not updated
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle or call onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch label="switch" disabled onCheckedChange={onCheckedChange} />,
    );

    const toggle = screen.getByRole("switch", { name: "switch" });
    expect(toggle).toBeDisabled();

    await user.click(toggle);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("renders the default size track dimensions", () => {
    render(<Switch label="switch" />);

    const toggle = screen.getByRole("switch", { name: "switch" });
    const track = toggle.querySelector('[data-slot="switch-track"]');

    expect(track).toHaveClass("h-[24px]");
    expect(track).toHaveClass("w-[44px]");
  });

  it("renders the small size track dimensions when size='small'", () => {
    render(<Switch label="switch" size="small" />);

    const toggle = screen.getByRole("switch", { name: "switch" });
    const track = toggle.querySelector('[data-slot="switch-track"]');

    expect(track).toHaveClass("h-[22px]");
    expect(track).toHaveClass("w-[40px]");
  });

  it("places the label before the track when labelPosition is 'left'", () => {
    render(<Switch label="switch" labelPosition="left" />);

    const toggle = screen.getByRole("switch", { name: "switch" });
    const label = screen.getByText("switch");
    const track = toggle.querySelector('[data-slot="switch-track"]');

    expect(track).not.toBeNull();
    // label should come before the track in the DOM when reversed
    expect(
      label.compareDocumentPosition(track as Element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  // 시각 라벨을 비웠을 때 기본 aria-label은 "switch"지만, props가 뒤에 전개되므로
  // 소비처가 넘긴 aria-label이 그대로 이긴다.
  it("lets a consumer override the accessible name when the visible label is empty", () => {
    render(<Switch label="" aria-label="알림 받기" />);

    expect(screen.getByRole("switch", { name: "알림 받기" })).toBeInTheDocument();
    expect(screen.queryByRole("switch", { name: "switch" })).toBeNull();
  });

  it("toggles with Enter and Space", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="알림" onCheckedChange={onCheckedChange} />);

    const toggle = screen.getByRole("switch", { name: "알림" });
    await user.tab();
    expect(toggle).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("is not reachable by keyboard when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="알림" disabled onCheckedChange={onCheckedChange} />);

    await user.tab();

    expect(screen.getByRole("switch", { name: "알림" })).not.toHaveFocus();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
