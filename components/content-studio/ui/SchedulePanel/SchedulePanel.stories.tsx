import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { SchedulePanel, type SchedulePanelGroup } from "./SchedulePanel";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86849";

const DEFAULT_GROUPS: SchedulePanelGroup[] = [
  {
    date: "Today, Sep 01",
    slots: [
      { rowId: 1, type: "posted", time: "11:00 AM" },
      { rowId: 2, type: "posted", time: "02:25 PM" },
      { rowId: 3, type: "posted", time: "10:00 PM" },
    ],
  },
  {
    date: "Tomorrow, Sep 02",
    slots: [
      { rowId: 4, type: "draft", time: "11:00 AM" },
      { rowId: 5, type: "scheduled", time: "02:25 PM" },
    ],
  },
  {
    date: "Thursday, Sep 03",
    slots: [
      { rowId: 6, type: "draft", time: "11:00 AM" },
      { rowId: 7, type: "draft", time: "02:25 PM" },
      { rowId: 8, type: "draft", time: "10:00 PM" },
    ],
  },
];

const meta = {
  title: "ContentStudio/UI/SchedulePanel",
  component: SchedulePanel,
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
      options: ["default", "in process", "no content", "archived"],
    },
    status: {
      control: "radio",
      options: ["default", "disabled"],
    },
    defaultGroups: { control: false },
    extendDays: { control: "number" },
    occurrencesPerDay: { control: "number" },
    startTime: { control: "text" },
  },
  args: {
    type: "default",
    status: "default",
    defaultGroups: DEFAULT_GROUPS,
    extendDays: 3,
    occurrencesPerDay: 3,
    startTime: "09:00 AM",
    onDateRangeChange: fn(),
    onOpenSettings: fn(),
    onScheduleAllDraft: fn(),
    onCreateBrandFitPost: fn(),
    onCreateMorePost: fn(),
  },
} satisfies Meta<typeof SchedulePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const settingsButton = canvas.getByRole("button", {
      name: "Open schedule settings",
    });

    await userEvent.click(settingsButton);

    expect(args.onOpenSettings).toHaveBeenCalledTimes(1);
  },
};
