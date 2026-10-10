import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Slider } from "./slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10513",
    },
  },
  argTypes: {
    defaultValue: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    value: { control: false },
  },
  args: {
    defaultValue: 30,
    min: 0,
    max: 100,
    step: 1,
    onValueChange: fn(),
    "aria-label": "slider",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "var(--spacing-80)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
