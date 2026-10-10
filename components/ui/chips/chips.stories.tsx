import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chips } from "./chips";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3021-1615";

const meta = {
  title: "UI/Chips",
  component: Chips,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost"],
    },
    selected: {
      control: "boolean",
    },
    disabled: { control: "boolean" },
    deletable: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Chip",
    variant: "primary",
    selected: false,
    disabled: false,
    deletable: false,
    onDelete: fn(),
  },
} satisfies Meta<typeof Chips>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
