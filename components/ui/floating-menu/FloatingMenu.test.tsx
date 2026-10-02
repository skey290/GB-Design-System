import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "lucide-react";

import { FloatingMenu, type FloatingMenuItem } from "./FloatingMenu";

const items: FloatingMenuItem[] = [
  { id: "dashboard", icon: Home },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
];

describe("FloatingMenu", () => {
  it("renders a tablist with one tab per item", () => {
    render(<FloatingMenu items={items} activeId="assets" />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
  });

  it("marks the item matching activeId as selected", () => {
    render(<FloatingMenu items={items} activeId="compass" />);

    expect(screen.getByRole("tab", { name: "Compass" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("renders an icon-only tab when label is omitted", () => {
    render(<FloatingMenu items={items} activeId="dashboard" />);

    const dashboardTab = screen.getByRole("tab", { name: "dashboard" });
    expect(dashboardTab).toBeInTheDocument();
    expect(dashboardTab.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onActiveChange with the clicked item's id", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="assets"
        onActiveChange={onActiveChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Compass" }));

    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(onActiveChange).toHaveBeenCalledWith("compass");
  });

  it("does not change selection on its own (fully controlled)", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="assets"
        onActiveChange={onActiveChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Compass" }));

    expect(onActiveChange).toHaveBeenCalledWith("compass");
    // activeId prop was not updated by the test, so selection should be unchanged
    expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("only the selected tab is in the tab order (roving tabindex)", () => {
    render(<FloatingMenu items={items} activeId="compass" />);

    expect(screen.getByRole("tab", { name: "Compass" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("tab", { name: "Assets" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("moves to the next item with ArrowRight", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="assets"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "Assets" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(onActiveChange).toHaveBeenCalledWith("compass");
  });

  it("moves to the previous item with ArrowLeft", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="compass"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "Compass" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(onActiveChange).toHaveBeenCalledWith("assets");
  });

  it("wraps around with ArrowRight from the last item", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="contents-studio"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "Content Studio" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(onActiveChange).toHaveBeenCalledWith("dashboard");
  });

  it("wraps around with ArrowLeft from the first item", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="dashboard"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "dashboard" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(onActiveChange).toHaveBeenCalledWith("contents-studio");
  });

  it("jumps to the last item with End", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="compass"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "Compass" }).focus();
    await user.keyboard("{End}");

    expect(onActiveChange).toHaveBeenCalledWith("contents-studio");
  });

  it("jumps to the first item with Home", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="compass"
        onActiveChange={onActiveChange}
      />,
    );

    screen.getByRole("tab", { name: "Compass" }).focus();
    await user.keyboard("{Home}");

    expect(onActiveChange).toHaveBeenCalledWith("dashboard");
  });

  it("renders disabled buttons and suppresses active highlight when disabled", () => {
    render(<FloatingMenu items={items} activeId="assets" disabled />);

    const assetsTab = screen.getByRole("tab", { name: "Assets" });
    const compassTab = screen.getByRole("tab", { name: "Compass" });

    expect(assetsTab).toBeDisabled();
    expect(compassTab).toBeDisabled();
    // activeId is still reported for assistive tech even while disabled
    expect(assetsTab).toHaveAttribute("aria-selected", "true");
  });

  it("does not call onActiveChange when a disabled tab is clicked", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="assets"
        onActiveChange={onActiveChange}
        disabled
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Compass" }));

    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it("does not navigate with arrow keys when disabled", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <FloatingMenu
        items={items}
        activeId="assets"
        onActiveChange={onActiveChange}
        disabled
      />,
    );

    screen.getByRole("tab", { name: "Assets" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(onActiveChange).not.toHaveBeenCalled();
  });
});
