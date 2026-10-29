import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Tooltip } from "./tooltip";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=79-11350";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    // Verbatim text from the Figma component's description field
    docs: {
      description: {
        component:
          "A small floating hint that appears when its target is hovered or receives keyboard focus. It holds a short line of text and an arrow pointing at the target; Arrow position sets which side the arrow sits on. Use Popover when the content needs controls or more than a sentence.",
      },
    },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "reversed"],
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    variant: "default",
    side: "top",
    align: "center",
    title: "Title",
    description: "Tool tip text",
    // Starts open so Controls show it immediately, but left uncontrolled so hover and
    // close still work for real. The hover delay is pinned to 0 here.
    defaultOpen: true,
    delayDuration: 0,
    onClose: fn(),
    children: <button type="button">Hover me</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
