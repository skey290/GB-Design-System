import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Calendar, type CalendarProps, type CalendarRangeValue } from "./calendar";

type SingleCalendarProps = Extract<CalendarProps, { mode: "single" }>;
type RangeCalendarProps = Extract<CalendarProps, { mode: "range" }>;

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7219-10699";

function ControlledSingle({
  onValueChange,
  ...rest
}: SingleCalendarProps) {
  const [value, setValue] = React.useState<Date | undefined>(rest.value);
  return (
    <Calendar
      {...rest}
      mode="single"
      value={value}
      onValueChange={(date) => {
        setValue(date);
        onValueChange?.(date);
      }}
    />
  );
}

function ControlledRange({
  onValueChange,
  ...rest
}: RangeCalendarProps) {
  const [value, setValue] = React.useState<CalendarRangeValue | undefined>(
    rest.value,
  );
  return (
    <Calendar
      {...rest}
      mode="range"
      value={value}
      onValueChange={(range) => {
        setValue(range);
        onValueChange?.(range);
      }}
    />
  );
}

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    mode: "single",
    value: new Date(2026, 8, 13),
    onValueChange: fn(),
  },
  render: (args) => <ControlledSingle {...(args as SingleCalendarProps)} />,
};

export const WithEvents: Story = {
  name: "Single (이벤트 마커)",
  args: {
    mode: "single",
    value: new Date(2026, 8, 13),
    events: {
      "2026-09-01": "published",
      "2026-09-09": "reserved",
      "2026-09-17": "draft",
    },
    onValueChange: fn(),
  },
  render: (args) => <ControlledSingle {...(args as SingleCalendarProps)} />,
};

export const WithMinMaxDisabled: Story = {
  name: "Single (min/max/disabledDates)",
  args: {
    mode: "single",
    value: new Date(2026, 8, 13),
    minDate: new Date(2026, 8, 5),
    maxDate: new Date(2026, 8, 25),
    disabledDates: [new Date(2026, 8, 10)],
    onValueChange: fn(),
  },
  render: (args) => <ControlledSingle {...(args as SingleCalendarProps)} />,
};

export const MonthYearNavigation: Story = {
  name: "Single (월/연 서브뷰 전환)",
  args: {
    mode: "single",
    value: new Date(2026, 8, 13),
    onValueChange: fn(),
  },
  render: (args) => <ControlledSingle {...(args as SingleCalendarProps)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("Sep"));
    await expect(canvas.getByText("Jan")).toBeInTheDocument();

    await userEvent.click(canvas.getByText("Jan"));
    await expect(canvas.getByText("Jan")).toBeInTheDocument();

    await userEvent.click(canvas.getByText("2026"));
    await expect(canvas.getByText("2019")).toBeInTheDocument();

    const [yearToggle] = canvas.getAllByText("2026");
    await userEvent.click(yearToggle);
    await expect(canvas.queryByText("2019")).not.toBeInTheDocument();
  },
};

export const Range: Story = {
  args: {
    mode: "range",
    value: { from: new Date(2026, 8, 5), to: new Date(2026, 8, 20) },
    onValueChange: fn(),
  },
  render: (args) => <ControlledRange {...(args as RangeCalendarProps)} />,
};

export const RangeSelectionInteraction: Story = {
  name: "Range (드래그 없이 두 번 클릭으로 범위 선택)",
  args: {
    mode: "range",
    onValueChange: fn(),
  },
  render: (args) => <ControlledRange {...(args as RangeCalendarProps)} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const [firstFive] = canvas.getAllByText("5");
    await userEvent.click(firstFive);
    await expect(args.onValueChange).toHaveBeenCalled();
  },
};
