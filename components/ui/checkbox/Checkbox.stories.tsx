import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System---Atom?node-id=76-8617",
    },
  },
  args: {
    label: "Accept terms and conditions",
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Type=Defalut, Style=default` — 선택 안 됨 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * Figma `Type=Defalut, Style=muted` — 선택 안 된 상태의 톤 다운 스타일(외곽선만
 * 보이는 박스 + 흐린 라벨). Checked/Part/Disabled에는 이 스타일의 스와치가
 * Figma에 없습니다.
 */
export const Muted: Story = {
  args: {
    defaultChecked: false,
    variant: "muted",
  },
};

/** Figma `Type=Disabled, Style=default` */
export const Disabled: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
  },
};

/** Figma `Type=Checked, Style=default` */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/** Figma `Type=Part, Style=default` — 인디터미네이트(부분 선택) */
export const Indeterminate: Story = {
  name: "Part (indeterminate)",
  args: {
    indeterminate: true,
  },
};

export const DisabledChecked: Story = {
  name: "Disabled / Checked (Figma에 없는 조합)",
  args: {
    defaultChecked: true,
    disabled: true,
  },
};

export const ClickInteraction: Story = {
  name: "Toggles on box click",
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    });

    await expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.click(checkbox);

    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const LabelClickInteraction: Story = {
  name: "Toggles on label text click",
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    });
    const label = canvas.getByText("Accept terms and conditions");

    await expect(checkbox).toHaveAttribute("aria-checked", "false");

    // 네이티브 <label htmlFor>는 클릭 시 연결된 요소를 자동으로 클릭합니다.
    await userEvent.click(label);

    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const KeyboardInteraction: Story = {
  args: {
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    });

    checkbox.focus();
    await expect(checkbox).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.keyboard(" ");
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};

export const DisabledInteraction: Story = {
  name: "Disabled / No interaction",
  args: {
    defaultChecked: false,
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    });

    await expect(checkbox).toBeDisabled();

    await userEvent.click(checkbox);

    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
