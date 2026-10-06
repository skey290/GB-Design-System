import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

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
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
    disabled: false,
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
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    label: { control: "text" },
    checked: { control: false },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
