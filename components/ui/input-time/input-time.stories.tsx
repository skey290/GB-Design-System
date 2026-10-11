import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputTime, type InputTimeProps } from "./input-time";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type InputTimeStatus = "default" | "filled" | "active" | "disabled";

const STATUS_PROPS: Record<InputTimeStatus, Partial<InputTimeProps>> = {
  default: { defaultValue: "" },
  filled: { defaultValue: "1100" },
  active: { className: "pseudo-hover pseudo-hover-all" },
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
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108",
    },
    docs: {
      source: {
        transform: makeStatusSource("InputTime", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
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
    showTitle: true,
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
    showTitle: { control: "boolean" },
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
