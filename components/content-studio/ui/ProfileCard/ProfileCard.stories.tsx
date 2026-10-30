import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { ProfileCard, type SelectOption } from "./ProfileCard";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-92033";

const JOB_TITLE_OPTIONS: SelectOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "ux-designer", label: "UX Designer" },
];

const meta = {
  title: "ContentStudio/UI/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
    avatarSrc: { control: "text" },
    avatarAlt: { control: "text" },
    placeholder: { control: "text" },
    toggleLabel: { control: "text" },
    isSelfGoalComplete: { control: "boolean" },
    isContentGoalComplete: { control: "boolean" },
    isToneOfVoiceComplete: { control: "boolean" },
    knownForNowText: { control: "text" },
    knownForNextText: { control: "text" },
    contentGoalText: { control: "text" },
    toneOfVoiceText: { control: "text" },
    options: { control: false },
    value: { control: false },
  },
  args: {
    open: true,
    disabled: false,
    options: JOB_TITLE_OPTIONS,
    defaultValue: "data-scientist",
    isSelfGoalComplete: true,
    isContentGoalComplete: false,
    isToneOfVoiceComplete: false,
    onValueChange: fn(),
    onToggleOpen: fn(),
    onEditSelfGoal: fn(),
    onEditContentGoal: fn(),
    onEditToneOfVoice: fn(),
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Edit Self-Goal" }),
    );
    expect(args.onEditSelfGoal).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Collapse profile card" }),
    );
    expect(args.onToggleOpen).toHaveBeenCalledTimes(1);
  },
};
