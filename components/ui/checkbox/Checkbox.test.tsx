import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("renders checked when defaultChecked is true", () => {
    render(<Checkbox label="Subscribe" defaultChecked />);

    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("exposes aria-checked='mixed' when indeterminate, regardless of checked", () => {
    render(<Checkbox label="Subscribe" indeterminate checked={false} />);

    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("toggles on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("toggles when the label text is clicked (htmlFor association)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    await user.click(screen.getByText("Subscribe"));

    expect(checkbox).toHaveAttribute("aria-checked", "true");
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
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("supports keyboard activation via Enter and Space", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    checkbox.focus();

    await user.keyboard("{Enter}");
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
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
    expect(checkbox).toHaveAttribute("aria-checked", "false");
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
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
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
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  // Figma Type=disabled는 세 Status 모두에 존재한다 — disabled여도 체크/대시 표시를 유지해야
  // "선택됨, 지금은 수정 불가"가 구분된다.
  it("keeps showing the check icon when both checked and disabled", () => {
    const { container } = render(
      <Checkbox label="Subscribe" checked disabled />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("keeps showing the dash icon when both indeterminate and disabled", () => {
    const { container } = render(
      <Checkbox label="Subscribe" indeterminate disabled />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
