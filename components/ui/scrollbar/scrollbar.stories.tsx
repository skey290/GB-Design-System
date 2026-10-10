import type { Meta, StoryObj } from "@storybook/nextjs";

import { Scrollbar } from "./scrollbar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7792-522";

const meta = {
  title: "UI/Scrollbar",
  component: Scrollbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  argTypes: {
    thickness: {
      control: "radio",
      options: ["thick", "thin"],
      description: "스크롤바 두께 — thick 10px / thin 5px",
    },
    children: { control: false },
  },
} satisfies Meta<typeof Scrollbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    thickness: "thick",
    className: "h-[469px] w-[320px] pr-[var(--gb-spacing-3)]",
    children: (
      <div className="flex flex-col gap-[var(--gb-spacing-3)]">
        {Array.from({ length: 24 }, (_, index) => (
          <p
            key={index}
            className="text-sm-medium text-[var(--gb-text-default)]"
          >
            {`Scrollable row ${index + 1}`}
          </p>
        ))}
      </div>
    ),
  },
};
