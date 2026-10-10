import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputTime } from "./input-time";

const meta = {
  title: "UI/InputTime",
  component: InputTime,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108",
    },
  },
  args: {
    label: "Time to post",
    defaultValue: "1100",
    defaultPeriod: "AM",
    disabled: false,
    showDelete: false,
    onValueChange: fn(),
    onPeriodChange: fn(),
    onDelete: fn(),
  },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    showDelete: { control: "boolean" },
    defaultValue: { control: "text" },
    defaultPeriod: {
      control: "radio",
      options: ["AM", "PM"],
    },
    value: { control: false },
    period: { control: false },
  },
} satisfies Meta<typeof InputTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
