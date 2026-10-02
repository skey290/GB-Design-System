import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { RangeSelect, type RangeSelectProps } from "./range-select";
import type { CalendarRangeValue } from "@/components/ui/calendar/calendar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7219-10932";

function ControlledRangeSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: RangeSelectProps) {
  const [value, setValue] = React.useState<CalendarRangeValue | undefined>(
    initialValue,
  );
  return (
    <RangeSelect
      {...rest}
      value={value}
      onValueChange={(range) => {
        setValue(range);
        onValueChange?.(range);
      }}
    />
  );
}

const meta = {
  title: "UI/RangeSelect",
  component: RangeSelect,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof RangeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ControlledRangeSelect {...args} />,
};

export const Filled: Story = {
  args: {
    value: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) },
  },
  render: (args) => <ControlledRangeSelect {...args} />,
};

export const Disabled: Story = {
  args: {
    value: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) },
    disabled: true,
  },
  render: (args) => <ControlledRangeSelect {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(canvas.queryByText("Sep")).not.toBeInTheDocument();
  },
};

export const Interactive: Story = {
  render: (args) => <ControlledRangeSelect {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await userEvent.click(trigger);

    const [fromCell] = await within(document.body).findAllByRole("button", {
      name: "15",
    });
    await userEvent.click(fromCell);

    await expect(args.onValueChange).toHaveBeenCalledWith({
      from: expect.any(Date),
      to: undefined,
    });
  },
};
