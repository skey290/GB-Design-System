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
    docs: { description: { component: "An indeterminate loading indicator for an action whose duration is unknown. Use Skeleton instead when the shape of the content being loaded is already known, and a progress bar when real progress can be reported." } },
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
