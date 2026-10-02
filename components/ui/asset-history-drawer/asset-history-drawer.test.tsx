import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  AssetHistoryDrawer,
  type AssetHistoryDrawerItem,
} from "./asset-history-drawer";

describe("AssetHistoryDrawer", () => {
  it("renders the title and a close button", () => {
    render(<AssetHistoryDrawer title="Work History" items={[]} />);

    expect(screen.getByText("Work History")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <AssetHistoryDrawer title="Work History" items={[]} onClose={onClose} />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders Work History style rows (badge + label + timestamp) when badge/timestamp is present", () => {
    const items: AssetHistoryDrawerItem[] = [
      { label: "Edited", badge: "Data Scientist", timestamp: "Just now" },
    ];
    render(<AssetHistoryDrawer title="Work History" items={items} />);

    expect(screen.getByText("Data Scientist")).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });

  it("renders Self Archive style rows (label + restore + delete) when badge/timestamp is absent", () => {
    const items: AssetHistoryDrawerItem[] = [
      { label: "Morning Jogger", onRestore: vi.fn(), onDelete: vi.fn() },
    ];
    render(<AssetHistoryDrawer title="Self Archive" items={items} />);

    expect(screen.getByText("Morning Jogger")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onRestore/onDelete for the correct row", async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn();
    const onDelete = vi.fn();
    const items: AssetHistoryDrawerItem[] = [
      { label: "Morning Jogger", onRestore, onDelete },
    ];
    render(<AssetHistoryDrawer title="Self Archive" items={items} />);

    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(onRestore).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not render a delete button for Work History rows (no onDelete)", () => {
    const items: AssetHistoryDrawerItem[] = [
      { label: "Edited", badge: "Data Scientist", timestamp: "Just now" },
    ];
    render(<AssetHistoryDrawer title="Work History" items={items} />);

    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("renders an empty list without crashing when items is empty", () => {
    render(<AssetHistoryDrawer title="Work History" items={[]} />);
    expect(screen.getByText("Work History")).toBeInTheDocument();
  });
});
