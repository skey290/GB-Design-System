import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-10807",
    },
  },
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: false },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `State=default` */
export const Default: Story = {
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
  },
};

/** Figma `State=active` — 실제로는 prop이 아니라 `:focus-visible` CSS 상태입니다.
 * 스토리에서 포커스를 강제로 트리거해 시각적으로 확인합니다. */
export const Focused: Story = {
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText(
      "Tell me about your interests.",
    );

    await userEvent.click(textarea);

    await expect(textarea).toHaveFocus();
  },
};

/** Figma `State=filled` — 값이 이미 입력된 비포커스 상태. 네이티브 값 텍스트는
 * placeholder가 아니라 일반 텍스트라 `--foreground`(text-default) 색이 그대로
 * 적용되어 별도 분기 없이 Figma와 일치합니다. */
export const Filled: Story = {
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
    defaultValue: "Tell me about your interests.",
  },
};

/** Figma 예시 카피("1000 characters left")를 재현하는 동적 글자수 카운터 */
export const WithCounter: Story = {
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
    maxLength: 1000,
  },
};

export const CounterInteraction: Story = {
  name: "Counter / Interaction",
  args: {
    label: "Tell me about your interest.",
    placeholder: "Tell me about your interests.",
    maxLength: 20,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText(
      "Tell me about your interests.",
    );

    await expect(canvas.getByText("20 characters left")).toBeInTheDocument();

    await userEvent.type(textarea, "hello");

    await expect(canvas.getByText("15 characters left")).toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenCalledWith("hello");
  },
};
