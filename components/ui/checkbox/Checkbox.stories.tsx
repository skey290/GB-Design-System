import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Checkbox } from "./checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617",
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
      options: ["default", "mute"],
      description: "Figma Type 축. default/part/checked 모두와 조합됩니다",
    },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: {
      control: "boolean",
      description:
        "Figma Status의 disabled / disabled-checked / disabled-part. 배색은 Type과 무관하게 하나이고, 체크·대시 표시는 그대로 유지됩니다",
    },
    label: { control: "text" },
    showLabel: {
      control: "boolean",
      description:
        "Figma label 프로퍼티. false면 라벨이 sr-only가 되어 화면에서 사라지고 접근성 이름으로만 남습니다",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
