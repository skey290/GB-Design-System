import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { RangeSelect, type RangeSelectProps } from "./range-select";
import type { CalendarRangeValue } from "@/components/ui/calendar/calendar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10932";

function ControlledRangeSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: RangeSelectProps) {
  const [value, setValue] = React.useState<CalendarRangeValue | undefined>(
    initialValue,
  );
  React.useEffect(() => setValue(initialValue), [initialValue]);

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
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    value: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) },
    disabled: false,
    onValueChange: fn(),
  },
  render: (args) => <ControlledRangeSelect {...args} />,
} satisfies Meta<typeof RangeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
