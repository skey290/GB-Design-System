import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-10807",
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    maxLength: { control: "number" },
    value: { control: false },
  },
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
    maxLength: 1000,
    onValueChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
