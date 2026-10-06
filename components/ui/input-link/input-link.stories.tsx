import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputLink } from "./input-link";

const meta = {
  title: "UI/InputLink",
  component: InputLink,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=5084-3716",
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    value: { control: false },
  },
  args: {
    defaultValue: "https://gabrielle.ai",
    onValueChange: fn(),
  },
} satisfies Meta<typeof InputLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
