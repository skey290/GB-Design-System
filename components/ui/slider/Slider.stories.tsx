import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Slider } from "./Slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-10513",
    },
  },
  args: {
    onValueChange: fn(),
    "aria-label": "slider",
  },
  argTypes: {
    value: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "var(--spacing-80)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma 예시 비율(약 31%)에 가장 가까운 기본값 */
export const Default: Story = {
  args: {
    defaultValue: 30,
  },
};

export const AtMin: Story = {
  name: "Value / Min (0)",
  args: {
    defaultValue: 0,
  },
};

export const AtMax: Story = {
  name: "Value / Max (100)",
  args: {
    defaultValue: 100,
  },
};

export const KeyboardInteraction: Story = {
  args: {
    defaultValue: 30,
    step: 1,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider", { name: "slider" });

    expect(thumb).toHaveAttribute("aria-valuenow", "30");

    await userEvent.click(thumb);
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "33");
    await expect(args.onValueChange).toHaveBeenCalledWith(33);

    await userEvent.keyboard("{ArrowLeft}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "32");

    await userEvent.keyboard("{Home}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");

    await userEvent.keyboard("{End}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
  },
};

export const ClickToSeekInteraction: Story = {
  name: "Click Track to Seek",
  args: {
    defaultValue: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider", { name: "slider" });
    const track = thumb.parentElement as HTMLElement;

    expect(thumb).toHaveAttribute("aria-valuenow", "0");

    const rect = track.getBoundingClientRect();
    await userEvent.pointer([
      {
        target: track,
        coords: {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        },
        keys: "[MouseLeft]",
      },
    ]);

    // 트랙 중앙 클릭 → 값이 대략 50 근처로 이동
    const valueNow = Number(thumb.getAttribute("aria-valuenow"));
    await expect(valueNow).toBeGreaterThan(0);
  },
};
