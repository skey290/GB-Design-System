import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Popover } from "./popover";

const baseProps = {
  type: "notification" as const,
  title: "Heading to 'Content Studio' to create your post?",
  description: "Exit this page and start creating a post in 'Content Studio'.",
};

describe("Popover", () => {
  it("does not render when open is false", () => {
    render(<Popover {...baseProps} open={false} onOpenChange={vi.fn()} />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders title and description when open", () => {
    render(<Popover {...baseProps} open onOpenChange={vi.fn()} />);

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it("applies default (non-warning) text color for notification title", () => {
    render(
      <Popover
        {...baseProps}
        type="notification"
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText(baseProps.title).className).toContain(
      "--gb-text-default",
    );
  });

  it("applies error text color for warning title", () => {
    render(
      <Popover {...baseProps} type="warning" open onOpenChange={vi.fn()} />,
    );

    expect(screen.getByText(baseProps.title).className).toContain(
      "--gb-text-error",
    );
  });

  it("calls onCancel and closes when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onCancel = vi.fn();
    render(
      <Popover
        {...baseProps}
        open
        onOpenChange={onOpenChange}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onConfirm and closes when Confirm is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(
      <Popover
        {...baseProps}
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uses custom cancel/confirm labels when provided", () => {
    render(
      <Popover
        {...baseProps}
        open
        onOpenChange={vi.fn()}
        cancelLabel="Not now"
        confirmLabel="Yes, continue"
      />,
    );

    expect(screen.getByRole("button", { name: "Not now" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Yes, continue" }),
    ).toBeInTheDocument();
  });

  it("does not render the checkbox row when checkbox prop is omitted", () => {
    render(<Popover {...baseProps} open onOpenChange={vi.fn()} />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders the 'Do not ask again' checkbox for notification when checkbox is provided", () => {
    render(
      <Popover
        {...baseProps}
        type="notification"
        checkbox={false}
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Do not ask again." }),
    ).toBeInTheDocument();
  });

  // Figma `Type=warning`에는 체크박스 레이어가 없다 — 타입이 조합을 막고,
  // 타입을 우회해 넘겨도 런타임에서 렌더링되지 않는다.
  it("never renders the checkbox row for warning, even if checkbox is forced in", () => {
    // 타입은 이 조합을 거부한다 — 캐스팅으로 우회해 런타임 방어까지 확인한다.
    const forced = {
      ...baseProps,
      type: "warning",
      checkbox: false,
      open: true,
      onOpenChange: vi.fn(),
    } as unknown as React.ComponentProps<typeof Popover>;

    render(<Popover {...forced} />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("toggles the checkbox and calls onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Popover
        {...baseProps}
        checkbox={false}
        onCheckedChange={onCheckedChange}
        open
        onOpenChange={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("checkbox", { name: "Do not ask again." }),
    );

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("closes on Escape key press", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Popover {...baseProps} open onOpenChange={onOpenChange} />);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
