import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System---Atom?node-id=3311-1341",
    },
  },
  args: {
    "aria-label": "progress",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "var(--spacing-80)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Percentage(%)=0` */
export const Percentage0: Story = {
  name: "Percentage / 0",
  args: { value: 0 },
};

/** Figma `Percentage(%)=10` */
export const Percentage10: Story = {
  name: "Percentage / 10",
  args: { value: 10 },
};

/** Figma `Percentage(%)=20` */
export const Percentage20: Story = {
  name: "Percentage / 20",
  args: { value: 20 },
};

/** Figma `Percentage(%)=30` */
export const Percentage30: Story = {
  name: "Percentage / 30",
  args: { value: 30 },
};

/** Figma `Percentage(%)=40` */
export const Percentage40: Story = {
  name: "Percentage / 40",
  args: { value: 40 },
};

/** Figma `Percentage(%)=50` */
export const Percentage50: Story = {
  name: "Percentage / 50",
  args: { value: 50 },
};

/** Figma `Percentage(%)=60` */
export const Percentage60: Story = {
  name: "Percentage / 60",
  args: { value: 60 },
};

/** Figma `Percentage(%)=70` */
export const Percentage70: Story = {
  name: "Percentage / 70",
  args: { value: 70 },
};

/** Figma `Percentage(%)=80` */
export const Percentage80: Story = {
  name: "Percentage / 80",
  args: { value: 80 },
};

/** Figma `Percentage(%)=90` */
export const Percentage90: Story = {
  name: "Percentage / 90",
  args: { value: 90 },
};

/** Figma `Percentage(%)=100` */
export const Percentage100: Story = {
  name: "Percentage / 100",
  args: { value: 100 },
};

export const ClampsOutOfRangeValues: Story = {
  name: "Clamps out-of-range values",
  args: { value: 250, min: 0, max: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("progressbar", { name: "progress" });

    await expect(bar).toHaveAttribute("aria-valuenow", "100");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");

    const indicator = bar.querySelector(
      '[data-slot="progress-bar-indicator"]',
    ) as HTMLElement;
    await expect(indicator.style.width).toBe("100%");
  },
};

export const ReflectsValueChanges: Story = {
  name: "Reflects value in aria-valuenow and width",
  args: { value: 30 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("progressbar", { name: "progress" });

    await expect(bar).toHaveAttribute("aria-valuenow", "30");

    const indicator = bar.querySelector(
      '[data-slot="progress-bar-indicator"]',
    ) as HTMLElement;
    await expect(indicator.style.width).toBe("30%");
  },
};
