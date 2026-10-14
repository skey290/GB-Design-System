import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox, type ChatboxProps } from "./chatbox";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ChatboxStatus = "default" | "filled" | "active" | "disabled";

const STATUS_PROPS: Record<ChatboxStatus, Partial<ChatboxProps>> = {
  default: {},
  filled: { defaultValue: "Please share your ideas." },
  active: { className: "pseudo-focus-within pseudo-focus-within-all pseudo-hover pseudo-hover-all" },
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
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "The message composer for a chat interface — a growing text area with a file-attach button and a send button. The area above the text input is an empty slot that hugs whatever is placed in it: attachment thumbnails, suggestion chips, or option rows." },
      source: {
        transform: makeStatusSource("Chatbox", STATUS_PROPS, {
          cssOnly: ["active"], omit: ["children"],
        }),
      },
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
    showButton: { control: "boolean" },
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
    showButton: true,
    onValueChange: fn(),
    onAttachFiles: fn(),
    onSend: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
