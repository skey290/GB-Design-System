import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { DateSelect, type DateSelectProps } from "./date-select";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7219-10905";

function ControlledDateSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: DateSelectProps) {
  const [value, setValue] = React.useState<Date | undefined>(initialValue);
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
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof DateSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ControlledDateSelect {...args} />,
};

export const Filled: Story = {
  args: {
    value: new Date(2026, 8, 1),
  },
  render: (args) => <ControlledDateSelect {...args} />,
};

export const Disabled: Story = {
  args: {
    value: new Date(2026, 8, 1),
    disabled: true,
  },
  render: (args) => <ControlledDateSelect {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(canvas.queryByText("Sep")).not.toBeInTheDocument();
  },
};

export const Interactive: Story = {
  render: (args) => <ControlledDateSelect {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await userEvent.click(trigger);
    const dayCell = await within(document.body).findByRole("button", {
      name: "15",
    });
    await userEvent.click(dayCell);

    await expect(args.onValueChange).toHaveBeenCalled();
  },
};
