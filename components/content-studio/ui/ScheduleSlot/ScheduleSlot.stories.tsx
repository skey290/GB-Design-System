import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { ScheduleSlot } from "./ScheduleSlot";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86799";

const meta = {
  title: "ContentStudio/UI/ScheduleSlot",
  component: ScheduleSlot,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["posted", "scheduled", "draft", "archive", "no content"],
    },
    status: {
      control: "radio",
      options: ["default", "active", "disabled"],
    },
    time: { control: "text" },
    deletedDate: { control: "text" },
    showAddPost: { control: "boolean" },
  },
  args: {
    // "draft" (rather than Figma's primary "posted" example) so the
    // hover-revealed delete (X) trigger is visible without touching Controls.
    type: "draft",
    status: "default",
    time: "11:00 AM",
    deletedDate: "Deleted at 08:12 AM",
    showAddPost: true,
    onAddPost: fn(),
    onDelete: fn(),
    onClick: fn(),
  },
} satisfies Meta<typeof ScheduleSlot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Add post" });

    await userEvent.click(button);

    expect(args.onAddPost).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Delete schedule slot" }),
    );

    expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};
