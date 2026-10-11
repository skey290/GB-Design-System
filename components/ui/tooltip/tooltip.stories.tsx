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
    // Controls로 바로 보이도록 열린 채 시작하되, 비제어로 둬서 hover·닫기가
    // 실제로 동작하게 한다. 실 서비스 hover 지연은 0으로 고정.
    defaultOpen: true,
    delayDuration: 0,
    onClose: fn(),
    children: <button type="button">Hover me</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
