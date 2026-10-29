import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  MostHooked,
  type MostHookedItem,
  type SelectOption,
} from "./MostHooked";

const OPTIONS: SelectOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
];

const ITEMS: MostHookedItem[] = [
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 74,
    comments: 51,
  },
  {
    handle: "@janedoe",
    description: "Discover the latest insights and updates here.",
    likes: 61,
    comments: 10,
  },
];

describe("MostHooked", () => {
  it("renders the embedded ProfileCard's bio, select, and goal button", () => {
    render(<MostHooked options={OPTIONS} bio="Custom bio text" />);

    expect(screen.getByText("Custom bio text")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Goal" })).toBeInTheDocument();
  });

  it("renders the header in both the empty and full states", () => {
    const { rerender } = render(<MostHooked options={OPTIONS} />);
    expect(screen.getByText("Top Performers")).toBeInTheDocument();
    expect(screen.getByText("Sorted by Engagement")).toBeInTheDocument();

    rerender(<MostHooked options={OPTIONS} items={ITEMS} />);
    expect(screen.getByText("Top Performers")).toBeInTheDocument();
    expect(screen.getByText("Sorted by Engagement")).toBeInTheDocument();
  });

  it("renders the no-data state when items is omitted", () => {
    render(<MostHooked options={OPTIONS} />);

    expect(screen.getByText("No posts tracked yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Publish content to discover which posts drive the most engagement and retention.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the no-data state when items is an empty array", () => {
    render(<MostHooked options={OPTIONS} items={[]} />);

    expect(screen.getByText("No posts tracked yet")).toBeInTheDocument();
  });

  it("renders a ranked row per item with its handle, description, likes, and comments", () => {
    render(<MostHooked options={OPTIONS} items={ITEMS} />);

    expect(screen.getAllByText("@cloedatascientist")).toHaveLength(1);
    expect(screen.getByText("@janedoe")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("74")).toBeInTheDocument();
    expect(screen.getByText("51")).toBeInTheDocument();
    expect(screen.getByText("61")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("marks only the first row as highlighted", () => {
    render(<MostHooked options={OPTIONS} items={ITEMS} />);

    const highlighted = screen.getByText("#1").closest("[data-highlighted]");
    const regular = screen.getByText("#2").closest("[data-highlighted]");

    expect(highlighted).toHaveAttribute("data-highlighted", "true");
    expect(regular).toBeNull();
  });

  it("calls onGoalClick when the goal button is clicked", async () => {
    const user = userEvent.setup();
    const onGoalClick = vi.fn();
    render(
      <MostHooked options={OPTIONS} items={ITEMS} onGoalClick={onGoalClick} />,
    );

    await user.click(screen.getByRole("button", { name: "Goal" }));

    expect(onGoalClick).toHaveBeenCalledTimes(1);
  });

  it("calls onValueChange when a different job title is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MostHooked
        options={OPTIONS}
        defaultValue="data-scientist"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Product Manager" }));

    expect(onValueChange).toHaveBeenCalledWith("product-manager");
  });

  it("disables the embedded ProfileCard's select and goal button when disabled", () => {
    render(<MostHooked options={OPTIONS} disabled />);

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Goal" })).toBeDisabled();
  });
});
