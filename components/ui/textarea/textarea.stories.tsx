import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Textarea, type TextareaProps } from "./textarea";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type TextareaStatus = "default" | "active" | "filled";

const STATUS_PROPS: Record<TextareaStatus, Partial<TextareaProps>> = {
  default: {},
  active: { className: "pseudo-focus-visible pseudo-focus-visible-all" },
  filled: { defaultValue: "Tell me about your interests." },
};

type StoryArgs = Omit<TextareaProps, "defaultValue"> & {
  status: TextareaStatus;
};

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=623-3651",
    },
    docs: {
      source: {
        transform: makeStatusSource("Textarea", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Textarea key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    maxLength: { control: "number" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 포커스 CSS 상태라 캔버스에서 직접 클릭해 봐도 된다",
    },
    value: { control: false },
  },
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
    maxLength: 1000,
    status: "default",
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
