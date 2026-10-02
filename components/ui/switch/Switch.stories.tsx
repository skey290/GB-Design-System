import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System---Atom?node-id=76-10618",
    },
  },
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "라벨이 트랙 기준 어느 쪽에 오는지 (Figma `Type` variant)",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "스위치 크기 (Figma `Size` variant)",
    },
    checked: { control: false },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `On=off, Type=default, Size=default` */
export const Off: Story = {
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
  },
};

/** Figma `On=on, Type=default, Size=default` */
export const On: Story = {
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: true,
  },
};

/** Figma `On=off, Type=reversed, Size=default` */
export const ReversedOff: Story = {
  name: "Reversed / Off",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "default",
    defaultChecked: false,
  },
};

/** Figma `On=on, Type=reversed, Size=default` */
export const ReversedOn: Story = {
  name: "Reversed / On",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "default",
    defaultChecked: true,
  },
};

/**
 * Figma `On=off, Type=disabled, Size=default`.
 * Figma의 disabled 예시는 라벨이 항상 왼쪽(reversed와 동일 순서)에 있지만,
 * `disabled`와 `labelPosition`은 독립 prop이라 `labelPosition="right"`와도
 * 자유롭게 조합할 수 있습니다.
 */
export const Disabled: Story = {
  args: {
    label: "switch",
    labelPosition: "left",
    size: "default",
    defaultChecked: false,
    disabled: true,
  },
};

/** Figma `On=on, Type=disabled, Size=default` */
export const DisabledChecked: Story = {
  name: "Disabled / Checked",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "default",
    defaultChecked: true,
    disabled: true,
  },
};

/** Figma `On=off, Type=default, Size=small` */
export const SmallOff: Story = {
  name: "Small / Off",
  args: {
    label: "switch",
    labelPosition: "right",
    size: "small",
    defaultChecked: false,
  },
};

/** Figma `On=on, Type=default, Size=small` */
export const SmallOn: Story = {
  name: "Small / On",
  args: {
    label: "switch",
    labelPosition: "right",
    size: "small",
    defaultChecked: true,
  },
};

/** Figma `On=off, Type=reversed, Size=small` */
export const SmallReversedOff: Story = {
  name: "Small / Reversed / Off",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "small",
    defaultChecked: false,
  },
};

/** Figma `On=on, Type=reversed, Size=small` */
export const SmallReversedOn: Story = {
  name: "Small / Reversed / On",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "small",
    defaultChecked: true,
  },
};

/** Figma `On=off, Type=disabled, Size=small` */
export const SmallDisabled: Story = {
  name: "Small / Disabled",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "small",
    defaultChecked: false,
    disabled: true,
  },
};

/** Figma `On=on, Type=disabled, Size=small` */
export const SmallDisabledChecked: Story = {
  name: "Small / Disabled / Checked",
  args: {
    label: "switch",
    labelPosition: "left",
    size: "small",
    defaultChecked: true,
    disabled: true,
  },
};

export const Interaction: Story = {
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "switch" });

    await expect(toggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/** `size="small"` 렌더링을 트랙 치수로 검증하는 play function */
export const SmallInteraction: Story = {
  name: "Small / Interaction",
  args: {
    label: "switch",
    labelPosition: "right",
    size: "small",
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "switch" });
    const track = toggle.querySelector('[data-slot="switch-track"]');

    await expect(track).toHaveClass("h-[calc(var(--scale-22)*1px)]");

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const DisabledInteraction: Story = {
  name: "Disabled / No Interaction",
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "switch" });

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
