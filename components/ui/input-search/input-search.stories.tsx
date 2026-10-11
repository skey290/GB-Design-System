import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputSearch, type InputSearchProps } from "./input-search";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type InputSearchStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<InputSearchStatus, Partial<InputSearchProps>> = {
  default: {},
  filled: { defaultValue: "design system" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<InputSearchProps, "defaultValue" | "disabled"> & {
  status: InputSearchStatus;
};

const meta = {
  title: "UI/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3981-19811",
    },
  },
  render: ({ status, ...args }) => (
    <InputSearch key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 hover·focus CSS 상태라 캔버스에서 직접 올려 보면 된다",
    },
    value: { control: false },
  },
  args: {
    status: "default",
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
