import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { InputSearch } from "./input-search";

const meta = {
  title: "UI/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3981-19811",
    },
  },
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: false },
  },
} satisfies Meta<typeof InputSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Property 1=Default` — 실제로는 미포커스 상태로 해석했습니다 */
export const Default: Story = {
  args: {},
};

/** Figma `Property 1=Variant2` — 실제로는 `:focus-within` CSS 상태로 해석했습니다 */
export const Focused: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search...");

    await userEvent.click(input);

    await expect(input).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const TypingInteraction: Story = {
  name: "Typing / Interaction",
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search...");

    await userEvent.type(input, "gabrielle");

    await expect(input).toHaveValue("gabrielle");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("gabrielle");
  },
};
