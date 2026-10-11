import type { Meta, StoryObj } from "@storybook/nextjs";

import { Avatar } from "./avatar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3073-4051";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "A user or entity picture shown at a fixed size. Type selects what fills it — an image, text initials, or a fallback icon — and Style sets the frame shape (rounded, rectangle, or circle). Purely a display element with no interactive state." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["icon", "initial", "image"],
    },
    shape: {
      control: "select",
      options: ["circle", "rounded", "rectangle"],
    },
    src: { control: "text" },
    alt: { control: "text" },
    initials: { control: "text" },
  },
  args: {
    variant: "image",
    shape: "rounded",
    src: "/images/personas/self-default.jpg",
    alt: "사용자 프로필 사진",
    initials: "S",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
