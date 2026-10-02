import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { InputLink } from "./input-link";

const meta = {
  title: "UI/InputLink",
  component: InputLink,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=5084-3716",
    },
  },
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: false },
  },
} satisfies Meta<typeof InputLink>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Status=default` (node-id 7219:10097) */
export const Default: Story = {};

/** Figma `Status=active` (node-id 7219:10102) — 실제로는 prop이 아니라
 * `:hover`/`:focus-within` CSS 상태입니다. */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.click(input);

    await expect(input).toHaveFocus();
  },
};

/** Figma `Status=filled` (node-id 7219:10107) — 실제 값이 입력되면 예시
 * placeholder 색(muted)이 아니라 기본 텍스트 색으로 표시됩니다. */
export const Filled: Story = {
  args: {
    defaultValue: "https://gabrielle.ai",
  },
};

export const TypingInteraction: Story = {
  name: "Typing / Interaction",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.type(input, "https://example.com");

    await expect(input).toHaveValue("https://example.com");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      "https://example.com",
    );
  },
};
