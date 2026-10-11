import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox, type ChatboxProps } from "./chatbox";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ChatboxStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<ChatboxStatus, Partial<ChatboxProps>> = {
  default: {},
  filled: { defaultValue: "Please share your ideas." },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ChatboxProps, "defaultValue" | "disabled"> & {
  status: ChatboxStatus;
};

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
  render: ({ status, ...args }) => (
    <Chatbox key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 hover·focus-within CSS 상태라 캔버스에서 직접 올려 보면 된다",
    },
    placeholder: { control: "text" },
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
    status: "default",
    multiple: false,
    onValueChange: fn(),
    onAttachFiles: fn(),
    onSend: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
