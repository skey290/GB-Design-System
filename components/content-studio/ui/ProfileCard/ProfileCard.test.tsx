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

  it("renders the avatar, select, and collapse toggle in the header when open", () => {
    render(<ProfileCard options={OPTIONS} defaultValue="data-scientist" />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Data Scientist");
    expect(
      screen.getByRole("button", { name: "Collapse profile card" }),
    ).toBeInTheDocument();
  });

  it("renders the Self-Goal, Content Goal, and Tone of Voice sections when open", () => {
    render(
      <ProfileCard
        options={OPTIONS}
        isSelfGoalComplete
        isContentGoalComplete
        isToneOfVoiceComplete
        knownForNowText="Now text"
        knownForNextText="Next text"
        contentGoalText="Content text"
        toneOfVoiceText="Tone text"
      />,
    );

    expect(screen.getByText("Self-Goal")).toBeInTheDocument();
    expect(screen.getByText("Content Goal")).toBeInTheDocument();
    expect(screen.getByText("Tone of Voice")).toBeInTheDocument();
    expect(screen.getByText("Now text")).toBeInTheDocument();
    expect(screen.getByText("Next text")).toBeInTheDocument();
    expect(screen.getByText("Content text")).toBeInTheDocument();
    expect(screen.getByText("Tone text")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Self-Goal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Content Goal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Tone of Voice" }),
    ).toBeInTheDocument();
  });

  it("shows a fill-in prompt instead of the passed text when a goal isn't complete", () => {
    render(
      <ProfileCard
        options={OPTIONS}
        knownForNowText="Now text"
        contentGoalText="Content text"
        toneOfVoiceText="Tone text"
      />,
    );

    expect(screen.getByText("Self-Goal isn't set yet.")).toBeInTheDocument();
    expect(screen.getByText("Content Goal isn't set yet.")).toBeInTheDocument();
    expect(
      screen.getByText("Tone of Voice isn't set yet."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Now text")).not.toBeInTheDocument();
    expect(screen.queryByText("Content text")).not.toBeInTheDocument();
    expect(screen.queryByText("Tone text")).not.toBeInTheDocument();
  });

  it("calls the matching onEdit* handler when a pencil button is clicked", async () => {
    const user = userEvent.setup();
    const onEditSelfGoal = vi.fn();
    const onEditContentGoal = vi.fn();
    const onEditToneOfVoice = vi.fn();
    render(
      <ProfileCard
        options={OPTIONS}
        onEditSelfGoal={onEditSelfGoal}
        onEditContentGoal={onEditContentGoal}
        onEditToneOfVoice={onEditToneOfVoice}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit Content Goal" }));

    expect(onEditContentGoal).toHaveBeenCalledTimes(1);
    expect(onEditSelfGoal).not.toHaveBeenCalled();
    expect(onEditToneOfVoice).not.toHaveBeenCalled();
  });

  it("renders the checklist badges and hint text when open=false", () => {
    render(
      <ProfileCard
        open={false}
        options={OPTIONS}
        defaultValue="data-scientist"
        isSelfGoalComplete
      />,
    );

    expect(screen.queryByText(/All three are required/)).toBeInTheDocument();
    expect(screen.getByText("Self-Goal")).toBeInTheDocument();
    expect(screen.getByText("Content Goal")).toBeInTheDocument();
    expect(screen.getByText("Tone")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Data Scientist");
    expect(
      screen.getByRole("button", { name: "Expand profile card" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Known for/)).not.toBeInTheDocument();
  });

  it("calls the matching onEdit* handler when a checklist chip is clicked", async () => {
    const user = userEvent.setup();
    const onEditContentGoal = vi.fn();
    render(
      <ProfileCard
        open={false}
        options={OPTIONS}
        isSelfGoalComplete
        onEditContentGoal={onEditContentGoal}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Content Goal/ }));

    expect(onEditContentGoal).toHaveBeenCalledTimes(1);
  });

  it("disables the select and toggle button when disabled", () => {
    render(<ProfileCard options={OPTIONS} disabled />);

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Collapse profile card" }),
    ).toBeDisabled();
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
});
