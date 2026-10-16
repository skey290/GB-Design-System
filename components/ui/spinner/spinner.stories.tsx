import type { Meta, StoryObj } from "@storybook/nextjs";

import { Spinner } from "./spinner";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=1202-731";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "소요 시간을 알 수 없는 작업을 위한 비결정적(indeterminate) 로딩 표시기. 로딩될 콘텐츠의 형태를 이미 알고 있을 땐 Skeleton을, 실제 진행률을 보여줄 수 있을 땐 progress bar를 사용한다." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["outline", "reversed", "primary"],
    },
    label: { control: "text" },
  },
  args: {
    label: "Processing",
    variant: "outline",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
