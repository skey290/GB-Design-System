import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox } from "./chatbox";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7219-5418";

const meta = {
  title: "UI/Chatbox",
  component: Chatbox,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "image", "chip", "sentence-option"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    defaultImages: {
      control: "object",
      description: "variant 값과 무관하게 항상 표시됩니다.",
    },
    value: { control: false },
    images: { control: false },
  },
  args: {
    variant: "default",
    disabled: false,
    onValueChange: fn(),
    onAttach: fn(),
    onSend: fn(),
    onRemoveImage: fn(),
  },
} satisfies Meta<typeof Chatbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
