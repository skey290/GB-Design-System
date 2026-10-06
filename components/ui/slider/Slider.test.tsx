import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders with the default value (30)", () => {
    render(<Slider aria-label="volume" />);

    const thumb = screen.getByRole("slider", { name: "volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders a custom defaultValue", () => {
    render(<Slider aria-label="volume" defaultValue={70} />);

    expect(screen.getByRole("slider", { name: "volume" })).toHaveAttribute(
      "aria-valuenow",
      "70",
    );
  });

  it("increases the value on ArrowRight and decreases on ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="volume" defaultValue={30} />);

    const thumb = screen.getByRole("slider", { name: "volume" });
    thumb.focus();

    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "32");

    await user.keyboard("{ArrowLeft}");
    expect(thumb).toHaveAttribute("aria-valuenow", "31");
  });

  it("jumps to min/max on Home/End", async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="volume" defaultValue={30} min={0} max={100} />);

    const thumb = screen.getByRole("slider", { name: "volume" });
    thumb.focus();

    await user.keyboard("{End}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");

    await user.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "0");
  });

  it("clamps the value to min/max and snaps to step", async () => {
    const user = userEvent.setup();
    render(
      <Slider
        aria-label="volume"
        defaultValue={95}
        min={0}
        max={100}
        step={10}
      />,
    );

    const thumb = screen.getByRole("slider", { name: "volume" });
    thumb.focus();

    await user.keyboard("{ArrowRight}");
    // 95 + 10 = 105 → clamp to 100
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  it("calls onValueChange with the next value on keyboard interaction", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="volume"
        defaultValue={30}
        onValueChange={onValueChange}
      />,
    );

    const thumb = screen.getByRole("slider", { name: "volume" });
    thumb.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(31);
  });

  it("respects value as a controlled prop and does not move on its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider aria-label="volume" value={30} onValueChange={onValueChange} />,
    );

    const thumb = screen.getByRole("slider", { name: "volume" });
    thumb.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(31);
    // controlled: aria-valuenow stays 30 because the `value` prop was not updated
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
  });

  it("seeks to the clicked position on the track", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="volume"
        defaultValue={0}
        onValueChange={onValueChange}
      />,
    );

    const thumb = screen.getByRole("slider", { name: "volume" });
    const track = thumb.parentElement as HTMLElement;
    // jsdom의 getBoundingClientRect는 전부 0이라, 실제 레이아웃이 있는 것처럼 mock
    vi.spyOn(track, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      height: 16,
      right: 200,
      bottom: 16,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    // jsdom에는 Pointer Capture API가 없음
    track.setPointerCapture = vi.fn();
    track.hasPointerCapture = vi.fn().mockReturnValue(false);
    track.releasePointerCapture = vi.fn();

    track.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        clientX: 100, // 트랙 중앙 → 값이 대략 50 근처로 이동
      }),
    );

    expect(onValueChange).toHaveBeenCalled();
    const [value] = onValueChange.mock.calls[0];
    expect(value).toBeGreaterThan(0);
  });
});
