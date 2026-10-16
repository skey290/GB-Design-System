import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Slider } from "./slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "연속된 범위에서 값을 고르기 위해 사용자가 드래그하는 트랙. 최소값/최대값/step은 사용하는 쪽에서 정한다. 사용자가 정확한 값을 직접 입력해야 할 땐 Input을 사용한다." } },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10513",
    },
  },
  argTypes: {
    defaultValue: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    value: { control: false },
  },
  args: {
    defaultValue: 30,
    min: 0,
    max: 100,
    step: 1,
    onValueChange: fn(),
    "aria-label": "slider",
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
