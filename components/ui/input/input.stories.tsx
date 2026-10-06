import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=520-3062",
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    trailingIcon: {
      control: "boolean",
      description: "Figma 기본값은 true지만, 기존 화면 영향을 피해 코드 기본값은 false(opt-in)",
    },
    value: { control: false },
  },
  args: {
    placeholder: "Email or Username",
    disabled: false,
    trailingIcon: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
