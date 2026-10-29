import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { ProfileCard, type SelectOption } from "./ProfileCard";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576";

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
    bio: { control: "text" },
    avatarSrc: { control: "text" },
    avatarAlt: { control: "text" },
    placeholder: { control: "text" },
    goalLabel: { control: "text" },
    toggleLabel: { control: "text" },
    options: { control: false },
    value: { control: false },
    children: { control: false },
  },
  args: {
    open: true,
    disabled: false,
    options: JOB_TITLE_OPTIONS,
    defaultValue: "data-scientist",
    onValueChange: fn(),
    onGoalClick: fn(),
    onToggleOpen: fn(),
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Goal" }));
    expect(args.onGoalClick).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Collapse profile card" }),
    );
    expect(args.onToggleOpen).toHaveBeenCalledTimes(1);
  },
};
