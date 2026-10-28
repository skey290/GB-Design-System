import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NotiItem } from "./noti-item";

describe("NotiItem", () => {
  it("renders the label", () => {
    render(<NotiItem label="New comment" />);
    expect(screen.getByText("New comment")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<NotiItem label="New comment" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "New comment" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render an unread dot by default", () => {
    render(<NotiItem label="New comment" />);
    expect(
      document.querySelector('[data-slot="noti-item-unread-dot"]'),
    ).not.toBeInTheDocument();
  });

  it("renders an unread dot when unread=true", () => {
    const { container } = render(<NotiItem label="New comment" unread />);
    expect(
      container.querySelector('[data-slot="noti-item-unread-dot"]'),
    ).toBeInTheDocument();
  });
});
