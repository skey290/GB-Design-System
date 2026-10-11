import type { Meta, StoryObj } from "@storybook/nextjs";

import { Skeleton } from "./skeleton";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3017-2922";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "A placeholder shape shown while real content is loading, with a shimmer sweep across it. One segment stands in for one piece of content — a text line, a circle, or a block — so several are usually combined to match the shape of the layout underneath. Use Spinner when there is no layout to preview." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    shape: {
      control: "radio",
      options: ["rectangle", "text", "circle"],
      description:
        "Figma Type — rectangle 226×157 / text 226×27 / circle 27×27",
    },
  },
  args: {
    shape: "rectangle",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
