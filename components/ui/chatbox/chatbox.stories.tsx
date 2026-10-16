import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox, type ChatboxProps } from "./chatbox";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418";

/** A list mapped 1:1 to the values of the Figma `Status` axis. */
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
    // `status` controls this instead, so hide the redundant controls
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: { component: "채팅 인터페이스를 위한 메시지 작성창 — 늘어나는 텍스트 영역과 파일 첨부 버튼, 전송 버튼으로 구성된다. 텍스트 입력 위쪽은 안에 들어오는 것(첨부 썸네일, 추천 칩, 옵션 행 등)에 맞춰 크기가 맞춰지는 빈 슬롯이다." },
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
        "Figma `Status` axis. `active` is a hover/focus-within CSS state, so just hover over it on the canvas to see it",
    },
    placeholder: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    showButton: { control: "boolean" },
    children: {
      control: false,
      description:
        "Slot above the text input area (Figma `-> Slot`). Grows with its content, with no height constraint.",
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
