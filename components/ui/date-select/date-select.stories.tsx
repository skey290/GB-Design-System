import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { DateSelect, type DateSelectProps } from "./date-select";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7219-10905";

function ControlledDateSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: DateSelectProps) {
  const [value, setValue] = React.useState<Date | undefined>(initialValue);
  React.useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <DateSelect
      {...rest}
      value={value}
      onValueChange={(date) => {
        setValue(date);
        onValueChange?.(date);
      }}
    />
  );
}

const meta = {
  title: "UI/DateSelect",
  component: DateSelect,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    value: new Date(2026, 8, 1),
    disabled: false,
    onValueChange: fn(),
  },
  render: (args) => <ControlledDateSelect {...args} />,
} satisfies Meta<typeof DateSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
