import type { Meta, StoryObj } from "@storybook/nextjs";
import { Search } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=520-3062",
    },
  },
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `State=default` */
export const Default: Story = {
  args: {
    placeholder: "Email or Username",
  },
};

/** Figma `State=active` — 실제로는 prop이 아니라 `:focus-visible` CSS 상태입니다.
 * 스토리에서 포커스를 강제로 트리거해 시각적으로 확인합니다. */
export const Focused: Story = {
  args: {
    placeholder: "Email or Username",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Email or Username");

    await userEvent.click(input);

    await expect(input).toHaveFocus();
  },
};

/** Figma `State=disabled` (node-id 4522:7021) */
export const Disabled: Story = {
  args: {
    placeholder: "Email or Username",
    disabled: true,
    defaultValue: "이미 입력된 값",
  },
};

/** Figma `trailingIcon=true` 컴포넌트 프로퍼티 — 코드 기본값은 false(opt-in)라
 * 명시적으로 켜야 보입니다. */
export const WithTrailingIcon: Story = {
  args: {
    placeholder: "Email or Username",
    trailingIcon: true,
  },
};

/** trailing 아이콘은 Figma Instance Swap 프로퍼티처럼 교체 가능합니다. */
export const WithCustomTrailingIcon: Story = {
  args: {
    placeholder: "Search...",
    trailingIcon: true,
    icon: Search,
  },
};

export const TypingInteraction: Story = {
  name: "Typing / Interaction",
  args: {
    placeholder: "Email or Username",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Email or Username");

    await userEvent.type(input, "hello@example.com");

    await expect(input).toHaveValue("hello@example.com");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      "hello@example.com",
    );
  },
};
