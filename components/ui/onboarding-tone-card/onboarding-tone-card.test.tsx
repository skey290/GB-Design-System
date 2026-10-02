import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OnboardingToneCard } from "./onboarding-tone-card";

describe("OnboardingToneCard", () => {
  it("renders title, description, spectrum sliders and keyword chips", () => {
    render(<OnboardingToneCard />);

    expect(screen.getByText("Tell us your brand tone")).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Minimal" })).toBeInTheDocument();
  });

  it("disables the submit button until at least one keyword is selected", async () => {
    const user = userEvent.setup();
    render(<OnboardingToneCard />);

    const submit = screen.getByRole("button", { name: "Next" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Elegant" }));

    expect(submit).not.toBeDisabled();
  });

  it("toggles a keyword on and off", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<OnboardingToneCard onValueChange={onValueChange} />);

    const chip = screen.getByRole("button", { name: "Warm" });
    await user.click(chip);
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ keywords: ["Warm"] }),
    );

    await user.click(chip);
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ keywords: [] }),
    );
  });

  it("disables unselected chips once maxKeywords is reached", async () => {
    const user = userEvent.setup();
    render(<OnboardingToneCard maxKeywords={2} />);

    await user.click(screen.getByRole("button", { name: "Minimal" }));
    await user.click(screen.getByRole("button", { name: "Elegant" }));

    expect(screen.getByRole("button", { name: "Warm" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Minimal" })).not.toBeDisabled();
  });

  it("calls onSubmit with the current value when the submit button is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OnboardingToneCard onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Modern" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        keywords: ["Modern"],
        minimalToDecorative: 50,
        calmToIntense: 50,
        reference: "",
      }),
    );
  });

  it("updates the reference textarea value", async () => {
    const user = userEvent.setup();
    render(<OnboardingToneCard />);

    const reference = screen.getByLabelText(
      "Any brand or person you'd like to reference? (optional)",
    );
    await user.type(reference, "Calm tone");

    expect(reference).toHaveValue("Calm tone");
  });

  it("supports controlled usage via the value prop", () => {
    const value = {
      minimalToDecorative: 20,
      calmToIntense: 80,
      keywords: ["Bold"],
      reference: "",
    };
    render(<OnboardingToneCard value={value} onValueChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
