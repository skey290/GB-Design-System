import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "./button";
import { ICON_IDS } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681";

const meta = {
  title: "UI/Button",
  component: Button,
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
      options: [
        "primary",
        "mute",
        "outline",
        "link",
        "ghost",
        "icon",
        "icon-ghost",
        "icon-rounded",
        "google",
      ],
    },
    icon: {
      control: "select",
      options: ICON_IDS,
      description: "icon/icon-ghost/icon-rounded variant에서만 렌더링됩니다.",
    },
    iconAfter: {
      control: "select",
      options: ICON_IDS,
      description:
        "라벨 뒤 아이콘. primary/mute/outline/link에서만 렌더링됩니다 (link는 12px, 나머지는 16px).",
    },
    disabled: {
      control: "boolean",
    },
    children: {
      control: "text",
      description:
        '아이콘 전용 variant에서는 렌더링되지 않습니다. google variant는 비워두면 "Continue with Google"이 들어갑니다.',
    },
  },
  args: {
    variant: "primary",
    children: "Button",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
