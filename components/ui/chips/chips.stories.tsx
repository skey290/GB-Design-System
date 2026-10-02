import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Chips } from "./chips";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/GB_Design-System--Atom?node-id=3021-1615";

const meta = {
  title: "UI/Chips",
  component: Chips,
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
      options: ["primary", "secondary", "outline", "ghost"],
    },
    selected: {
      control: "radio",
      options: [true, false],
    },
  },
  args: {
    children: "Chip",
    variant: "primary",
    selected: false,
    disabled: false,
    deletable: false,
  },
} satisfies Meta<typeof Chips>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole("button", { name: "Chip" });

    await expect(chip).toBeInTheDocument();
    await expect(chip).not.toBeDisabled();

    await userEvent.hover(chip);
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Selected: Story = {
  args: {
    variant: "primary",
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole("button", { name: "Chip" });

    await expect(chip).toHaveAttribute("aria-pressed", "true");
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole("button", { name: "Chip" });

    await expect(chip).toBeDisabled();
  },
};

export const Deletable: Story = {
  args: {
    variant: "secondary",
    deletable: true,
    onDelete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole("button", { name: "Chip" });
    const deleteBadge = canvas.getByRole("button", { name: "Remove" });

    await expect(deleteBadge).toBeInTheDocument();

    await userEvent.click(deleteBadge);
    await expect(args.onDelete).toHaveBeenCalledTimes(1);

    // 삭제 배지 클릭이 칩 자체의 선택 상태를 건드리지 않아야 함 (이벤트 전파 차단 확인)
    await expect(chip).toHaveAttribute("aria-pressed", "false");
  },
};
