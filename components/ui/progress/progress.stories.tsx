import type { Meta, StoryObj } from "@storybook/react";

import { Progress } from "./progress";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3539-7160";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    label: {
      control: "text",
      description: "진행 중일 때 바 위에 표시할 문구",
    },
    completedLabel: {
      control: "text",
      description: "value가 max에 도달하면 이 문구로 바뀝니다",
    },
  },
  args: {
    value: 10,
    label: "Loading image..",
    completedLabel: "Completed",
  },
  decorators: [
    (Story) => (
      <div className="w-[226px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
