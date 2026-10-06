import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { OnboardingToneCard } from "./onboarding-tone-card";

const meta = {
  title: "UI/OnboardingToneCard",
  component: OnboardingToneCard,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    submitLabel: { control: "text" },
    maxKeywords: { control: "number" },
  },
  args: {
    maxKeywords: 3,
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

export const Playground: Story = {};
