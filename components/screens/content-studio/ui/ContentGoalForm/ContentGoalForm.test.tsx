import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContentGoalForm } from "./ContentGoalForm";

function renderForm(
  props: Partial<React.ComponentProps<typeof ContentGoalForm>> = {},
) {
  return render(<ContentGoalForm {...props} />);
}

describe("ContentGoalForm", () => {
  it("renders the Content Goal, Content Strategy fields, and Save button", () => {
    renderForm();

    expect(screen.getByText("Content goal")).toBeInTheDocument();
    expect(screen.getByText("Content strategy")).toBeInTheDocument();
    expect(screen.getByText("Content pillars")).toBeInTheDocument();
    expect(screen.getByText("Content ratio")).toBeInTheDocument();
    expect(screen.getByText("Posting frequency")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("toggles a content pillar on and off", async () => {
    const user = userEvent.setup();
    const onPillarsChange = vi.fn();
    renderForm({ onPillarsChange });

    await user.click(screen.getByRole("button", { name: "Case Study" }));
    expect(onPillarsChange).toHaveBeenLastCalledWith(["Case Study"]);

    await user.click(screen.getByRole("button", { name: "Case Study" }));
    expect(onPillarsChange).toHaveBeenLastCalledWith([]);
  });

  it("has no content ratio selected by default, matching Figma's empty state", () => {
    renderForm();

    expect(screen.getByRole("button", { name: "Text-heavy" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Balanced" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Image-heavy" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("selects a single content ratio", async () => {
    const user = userEvent.setup();
    const onRatioChange = vi.fn();
    renderForm({ onRatioChange });

    await user.click(screen.getByRole("button", { name: "Image-heavy" }));
    expect(onRatioChange).toHaveBeenCalledWith("Image-heavy");
  });

  it("increments/decrements the posting frequency count with a floor of 1", async () => {
    const user = userEvent.setup();
    const onPostingCountChange = vi.fn();
    renderForm({ postingCount: 1, onPostingCountChange });

    await user.click(screen.getByRole("button", { name: "감소" }));
    expect(onPostingCountChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: "증가" }));
    expect(onPostingCountChange).toHaveBeenCalledWith(2);
  });

  it("selects a posting frequency unit", async () => {
    const user = userEvent.setup();
    const onPostingFrequencyUnitChange = vi.fn();
    renderForm({ onPostingFrequencyUnitChange });

    await user.click(screen.getByRole("radio", { name: "a Month" }));
    expect(onPostingFrequencyUnitChange).toHaveBeenCalledWith("Month");
  });

  it("disables Save until the content goal, a pillar, and a ratio are all set", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.type(
      screen.getByLabelText("Content goal"),
      "Grow trusted-advisor reputation.",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Case Study" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Image-heavy" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("calls onSave when the Save button is clicked with all fields filled", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderForm({
      defaultContentGoal: "Grow trusted-advisor reputation.",
      defaultPillars: ["Case Study"],
      defaultRatio: "Balanced",
      onSave,
    });

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderForm({ onClose });

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
