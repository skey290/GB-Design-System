import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox } from "./chatbox";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418";

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
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    children: {
      control: false,
      description:
        "텍스트 입력 영역 위 슬롯(Figma `-> Slot`). 높이 제약 없이 내용에 따라 늘어납니다.",
    },
    value: { control: false },
  },
  args: {
    disabled: false,
    multiple: false,
    onValueChange: fn(),
    onAttachFiles: fn(),
    onSend: fn(),
  },
} satisfies Meta<typeof Chatbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
