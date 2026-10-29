import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileCard, type SelectOption } from "./ProfileCard";

const OPTIONS: SelectOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
];

describe("ProfileCard", () => {
  it("defaults to open=true, disabled=false", () => {
    render(<ProfileCard options={OPTIONS} />);

    const root = screen.getByRole("combobox").closest("[data-open]");
    expect(root).toHaveAttribute("data-open", "true");
    expect(root).not.toHaveAttribute("data-disabled");
  });

  it("renders the portrait slot, bio, select, goal button, and collapse toggle when open", () => {
    render(<ProfileCard options={OPTIONS} defaultValue="data-scientist" />);

    expect(
      screen.getByText(/forecasting Finance teams trust/),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Data Scientist");
    expect(screen.getByRole("button", { name: "Goal" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Collapse profile card" }),
    ).toBeInTheDocument();
  });

  it("renders a placeholder portrait when no children are passed", () => {
    render(<ProfileCard options={OPTIONS} avatarAlt="Jane's portrait" />);

    expect(
      screen.getByRole("img", { name: "Jane's portrait" }),
    ).toBeInTheDocument();
  });

  it("renders custom children in the portrait slot instead of the placeholder", () => {
    render(
      <ProfileCard options={OPTIONS} avatarAlt="Jane's portrait">
        <img src="/portrait.jpg" alt="Jane" />
      </ProfileCard>,
    );

    expect(screen.getByRole("img", { name: "Jane" })).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Jane's portrait" }),
    ).not.toBeInTheDocument();
  });

  it("renders the collapsed row with an avatar, select, goal button, and expand toggle when open=false", () => {
    render(
      <ProfileCard
        open={false}
        options={OPTIONS}
        defaultValue="data-scientist"
      />,
    );

    expect(
      screen.queryByText(/forecasting Finance teams trust/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Data Scientist");
    expect(screen.getByRole("button", { name: "Goal" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Expand profile card" }),
    ).toBeInTheDocument();
  });

  it("disables the select, goal button, and toggle button when disabled", () => {
    render(<ProfileCard options={OPTIONS} disabled />);

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Goal" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Collapse profile card" }),
    ).toBeDisabled();
  });

  it("calls onGoalClick when the goal button is clicked", async () => {
    const user = userEvent.setup();
    const onGoalClick = vi.fn();
    render(<ProfileCard options={OPTIONS} onGoalClick={onGoalClick} />);

    await user.click(screen.getByRole("button", { name: "Goal" }));

    expect(onGoalClick).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleOpen when the shrink/expand button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleOpen = vi.fn();
    render(<ProfileCard options={OPTIONS} onToggleOpen={onToggleOpen} />);

    await user.click(
      screen.getByRole("button", { name: "Collapse profile card" }),
    );

    expect(onToggleOpen).toHaveBeenCalledTimes(1);
  });

  it("calls onValueChange when a different job title is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ProfileCard
        options={OPTIONS}
        defaultValue="data-scientist"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Product Manager" }));

    expect(onValueChange).toHaveBeenCalledWith("product-manager");
  });

  it("renders custom bio text", () => {
    render(<ProfileCard options={OPTIONS} bio="Custom bio text" />);

    expect(screen.getByText("Custom bio text")).toBeInTheDocument();
  });
});
