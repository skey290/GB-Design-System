import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputSearch } from "./input-search";

const meta = {
  title: "UI/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3981-19811",
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    value: { control: false },
  },
  args: {
    disabled: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof InputSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
