import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { OnboardingToneCard } from "./onboarding-tone-card";

const meta = {
  title: "UI/OnboardingToneCard",
  component: OnboardingToneCard,
  tags: ["autodocs"],
  args: {
    onValueChange: fn(),
    onSubmit: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "var(--spacing-96)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardingToneCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SubmitDisabledUntilKeywordSelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Next" });

    await expect(submit).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Minimal" }));

    await expect(submit).not.toBeDisabled();
  },
};

export const KeywordLimitReached: Story = {
  name: "Keyword Limit (max 3)",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Minimal" }));
    await userEvent.click(canvas.getByRole("button", { name: "Elegant" }));
    await userEvent.click(canvas.getByRole("button", { name: "Warm" }));

    const unselected = canvas.getByRole("button", { name: "Professional" });
    await expect(unselected).toBeDisabled();

    // A selected keyword can still be tapped again to deselect it
    const minimal = canvas.getByRole("button", { name: "Minimal" });
    await expect(minimal).not.toBeDisabled();
    await userEvent.click(minimal);
    await expect(unselected).not.toBeDisabled();
  },
};

export const SubmitInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Modern" }));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ keywords: ["Modern"] }),
    );
  },
};

export const FilledWithReference: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const reference = canvas.getByLabelText(
      "Any brand or person you'd like to reference? (optional)",
    );

    await userEvent.type(reference, "Understated, like MUJI");

    await expect(reference).toHaveValue("Understated, like MUJI");
  },
};
