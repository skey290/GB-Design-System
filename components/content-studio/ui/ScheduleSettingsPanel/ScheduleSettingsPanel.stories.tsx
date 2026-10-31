import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { ScheduleSettingsPanel } from "./ScheduleSettingsPanel";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576";

const meta = {
  title: "ContentStudio/UI/ScheduleSettingsPanel",
  component: ScheduleSettingsPanel,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    repeatType: {
      control: "select",
      options: ["daily", "weekly", "monthly", "custom"],
    },
    selectedWeekdays: { control: false },
  },
  args: {
    defaultRepeatType: "daily",
    defaultTimeSlots: [{ time: "11:00", period: "AM" }],
    onRepeatTypeChange: fn(),
    onDateRangeChange: fn(),
    onBack: fn(),
    onSelectedWeekdaysChange: fn(),
    onDayOfMonthChange: fn(),
    onEveryCountChange: fn(),
    onEveryUnitChange: fn(),
    onTimeSlotsChange: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof ScheduleSettingsPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("tab", { name: "Weekly" }));
    expect(args.onRepeatTypeChange).toHaveBeenCalledWith("weekly");

    // The stepper's count drives the time-slot rows below it directly.
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase occurrences per day" }),
    );
    expect(args.onTimeSlotsChange).toHaveBeenLastCalledWith([
      { time: "11:00", period: "AM" },
      {},
    ]);
    expect(
      canvas.getByLabelText("When would you like to post? (slot 2)"),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Decrease occurrences per day" }),
    );
    expect(
      canvas.queryByLabelText("When would you like to post? (slot 2)"),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    expect(args.onSave).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Back to schedule panel" }),
    );
    expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};
