import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { PartInput } from "./part-input";

const meta = {
  title: "UI/PartInput",
  component: PartInput,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062",
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    trailingIcon: {
      control: "boolean",
      description:
        "Figma 기본값은 true지만, 기존 화면 영향을 피해 코드 기본값은 false(opt-in)",
    },
    isError: {
      control: "boolean",
      description: "Figma `Status=error` — 보더만 경고색으로 바뀜",
    },
    value: { control: false },
  },
  args: {
    placeholder: "Email or Username",
    disabled: false,
    trailingIcon: false,
    isError: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof PartInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
