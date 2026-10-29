import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScheduleSlot } from "./ScheduleSlot";

describe("ScheduleSlot", () => {
  it("defaults to type=posted, status=default with the default time label", () => {
    render(<ScheduleSlot />);

    const root = screen.getByText("11:00 AM").closest("[data-type]");
    expect(root).toHaveAttribute("data-type", "posted");
    expect(root).toHaveAttribute("data-status", "default");
    expect(screen.getByText("Posted")).toBeInTheDocument();
  });

  it.each([
    ["draft", "Draft"],
    ["scheduled", "Scheduled"],
    ["no content", "No content"],
    ["posted", "Posted"],
  ] as const)("renders the %s label for type=%s", (type, label) => {
    render(<ScheduleSlot type={type} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each([
    ["draft", "reverse"],
    ["scheduled", "default"],
    ["no content", "alarm"],
    ["posted", "outline"],
  ] as const)("uses Badge variant=%s for type=%s", (type, variant) => {
    render(<ScheduleSlot type={type} />);

    const label =
      type === "no content"
        ? "No content"
        : type === "draft"
          ? "Draft"
          : type === "posted"
            ? "Posted"
            : "Scheduled";
    expect(screen.getByText(label)).toHaveAttribute("data-variant", variant);
  });

  it("renders deletedDate instead of time/badge when type=archive", () => {
    render(<ScheduleSlot type="archive" deletedDate="Deleted at 09:00 AM" />);

    expect(screen.getByText("Deleted at 09:00 AM")).toBeInTheDocument();
    expect(screen.queryByText("11:00 AM")).not.toBeInTheDocument();
    expect(screen.queryByText("Posted")).not.toBeInTheDocument();
  });

  it("sets data-status=active on the root for the active row highlight", () => {
    render(<ScheduleSlot status="active" />);

    expect(
      screen.getByText("11:00 AM").closest("[data-status]"),
    ).toHaveAttribute("data-status", "active");
  });

  it("mutes the time text for type=posted regardless of status", () => {
    render(<ScheduleSlot type="posted" status="active" />);

    expect(screen.getByText("11:00 AM")).toHaveAttribute("data-muted", "true");
  });

  it("mutes the time text only for no content + disabled, not no content + default/active", () => {
    const { rerender } = render(
      <ScheduleSlot type="no content" status="disabled" />,
    );
    expect(screen.getByText("11:00 AM")).toHaveAttribute("data-muted", "true");

    rerender(<ScheduleSlot type="no content" status="default" />);
    expect(screen.getByText("11:00 AM")).not.toHaveAttribute("data-muted");

    rerender(<ScheduleSlot type="no content" status="active" />);
    expect(screen.getByText("11:00 AM")).not.toHaveAttribute("data-muted");
  });

  it.each(["scheduled", "draft", "archive"] as const)(
    "status=disabled renders like status=default for type=%s (no Figma design for this combo)",
    (type) => {
      const { container: defaultContainer } = render(
        <ScheduleSlot type={type} status="default" />,
      );
      const { container: disabledContainer } = render(
        <ScheduleSlot type={type} status="disabled" />,
      );

      expect(disabledContainer.querySelector("[data-status]")).toHaveAttribute(
        "data-status",
        "disabled",
      );
      expect(
        defaultContainer.innerHTML.replace(/status="default"/, ""),
      ).toEqual(disabledContainer.innerHTML.replace(/status="disabled"/, ""));
    },
  );

  it("shows the add-post trigger only when showAddPost is true", () => {
    const { rerender } = render(<ScheduleSlot showAddPost={false} />);
    expect(
      screen.queryByRole("button", { name: "Add post" }),
    ).not.toBeInTheDocument();

    rerender(<ScheduleSlot showAddPost />);
    expect(
      screen.getByRole("button", { name: "Add post" }),
    ).toBeInTheDocument();
  });

  it("never shows the add-post trigger for type=archive even when showAddPost is true", () => {
    render(<ScheduleSlot type="archive" showAddPost />);

    expect(
      screen.queryByRole("button", { name: "Add post" }),
    ).not.toBeInTheDocument();
  });

  it("calls onAddPost when the add-post trigger is clicked", async () => {
    const user = userEvent.setup();
    const onAddPost = vi.fn();
    render(<ScheduleSlot showAddPost onAddPost={onAddPost} />);

    await user.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost).toHaveBeenCalledTimes(1);
  });

  it("is not keyboard/role-interactive when onClick is not provided", () => {
    render(<ScheduleSlot />);

    expect(
      screen.queryByRole("button", { name: "11:00 AM" }),
    ).not.toBeInTheDocument();
  });

  it("calls onClick when the row is clicked or activated via keyboard, once onClick is provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ScheduleSlot onClick={onClick} />);

    const row = screen
      .getByText("11:00 AM")
      .closest<HTMLElement>("[data-clickable]")!;
    expect(row).toHaveAttribute("role", "button");
    expect(row).toHaveAttribute("tabIndex", "0");

    await user.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);

    row.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not bubble the add-post trigger's click into the row onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onAddPost = vi.fn();
    render(
      <ScheduleSlot showAddPost onAddPost={onAddPost} onClick={onClick} />,
    );

    await user.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
