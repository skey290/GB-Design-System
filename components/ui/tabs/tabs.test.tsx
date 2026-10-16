import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs } from "./tabs";
import styles from "./tabs.module.css";

const ITEMS = [{ label: "전체" }, { label: "진행중" }];

describe("Tabs", () => {
  it("renders all items", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} />);

    expect(screen.getByRole("tab", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "진행중" })).toBeInTheDocument();
  });

  it("exposes a tablist role for the container", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("applies the bottom border classes", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} />);

    expect(screen.getByRole("tablist")).toHaveClass(styles.list);
  });

  it("forwards additional props to the underlying container", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} data-testid="custom-tabs" />);

    expect(screen.getByTestId("custom-tabs")).toBeInTheDocument();
  });

  it("marks the tab at selectedIndex as selected", () => {
    render(<Tabs items={ITEMS} selectedIndex={1} />);

    expect(screen.getByRole("tab", { name: "전체" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "진행중" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("does not render a badge when count is omitted", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} />);

    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("renders an outline badge with the count when unselected", () => {
    render(<Tabs items={[{ label: "전체", count: 3 }]} selectedIndex={-1} />);

    expect(screen.getByText("3")).toHaveAttribute("data-variant", "outline");
  });

  it("renders a filled badge with the count when selected", () => {
    render(<Tabs items={[{ label: "전체", count: 5 }]} selectedIndex={0} />);

    expect(screen.getByText("5")).toHaveAttribute("data-variant", "default");
  });

  it("disables the tab button and applies the disabled color when disabled", () => {
    render(
      <Tabs
        items={[{ label: "전체" }, { label: "진행중", disabled: true }]}
        selectedIndex={0}
      />,
    );

    const disabledTab = screen.getByRole("tab", { name: "진행중" });
    expect(disabledTab).toBeDisabled();
    expect(disabledTab).toHaveClass(styles.tab);
  });

  it("does not render a badge for a disabled tab even when count is set", () => {
    render(
      <Tabs
        items={[{ label: "진행중", count: 4, disabled: true }]}
        selectedIndex={-1}
      />,
    );

    expect(screen.queryByText("4")).not.toBeInTheDocument();
  });

  it("does not call onSelectedIndexChange when a disabled tab is clicked", async () => {
    const user = userEvent.setup();
    let clickedIndex: number | null = null;

    render(
      <Tabs
        items={[{ label: "전체" }, { label: "진행중", disabled: true }]}
        selectedIndex={0}
        onSelectedIndexChange={(index) => {
          clickedIndex = index;
        }}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "진행중" }));

    expect(clickedIndex).toBeNull();
  });

  it("calls onSelectedIndexChange with the clicked tab index", async () => {
    const user = userEvent.setup();
    let clickedIndex: number | null = null;

    render(
      <Tabs
        items={ITEMS}
        selectedIndex={0}
        onSelectedIndexChange={(index) => {
          clickedIndex = index;
        }}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "진행중" }));

    expect(clickedIndex).toBe(1);
  });

  it("hugs its tabs instead of filling the parent width (width: fit-content in tabs.module.css)", () => {
    render(<Tabs items={ITEMS} selectedIndex={0} />);

    expect(screen.getByRole("tablist")).toHaveClass(styles.list);
  });
});
