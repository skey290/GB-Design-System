import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProgressBar } from "./progress-bar";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "The bare progress bar used to build the progress indicator, filling from 0 to 100%. It carries no label of its own. Not meant to be placed on its own — use Progress." } },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3311-1341",
    },
  },
  argTypes: {
    value: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
  },
  args: {
    value: 30,
    min: 0,
    max: 100,
    "aria-label": "progress",
  },
  decorators: [
    (Story) => (
      <div className="w-[226px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
