import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { Spinner } from "./spinner";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=1202-731";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  args: {
    label: "Processing",
    variant: "outline",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    variant: "outline",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("Processing");

    await expect(badge).toBeInTheDocument();
    await expect(badge.className).toContain("border-border");
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("Processing");

    await expect(badge.className).toContain(
      "bg-[var(--background-surface-secondary)]",
    );
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("Processing");

    await expect(badge.className).toContain("bg-primary");
  },
};
