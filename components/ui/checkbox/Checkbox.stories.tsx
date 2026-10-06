import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

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
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    variant: "default",
    onCheckedChange: fn(),
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "muted"],
      description:
        "Figma Style=muted는 미체크 상태에만 존재 — 체크/인디터미네이트/disabled와 조합되면 무시됩니다",
    },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
