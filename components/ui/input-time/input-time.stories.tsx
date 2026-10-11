import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputTime, type InputTimeProps } from "./input-time";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type InputTimeStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<InputTimeStatus, Partial<InputTimeProps>> = {
  default: { defaultValue: "" },
  filled: { defaultValue: "1100" },
  disabled: { defaultValue: "1100", disabled: true },
};

type StoryArgs = Omit<InputTimeProps, "defaultValue" | "disabled"> & {
  status: InputTimeStatus;
};

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
  render: ({ status, ...args }) => (
    <InputTime key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    label: "Time to post",
    status: "default",
    defaultPeriod: "AM",
    showDelete: false,
    onValueChange: fn(),
    onPeriodChange: fn(),
    onDelete: fn(),
  },
  argTypes: {
    label: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 포커스 CSS 상태, `error`는 범위 밖 값을 입력하면 나타난다",
    },
    showDelete: { control: "boolean" },
    defaultPeriod: {
      control: "radio",
      options: ["AM", "PM"],
    },
    value: { control: false },
    period: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
