import type { Meta, StoryObj } from "@storybook/nextjs";

import { Avatar } from "./avatar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3073-4051";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    // Verbatim text from the Figma component's description field
    docs: { description: { component: "고정 크기로 표시되는 사용자/엔티티 사진. Type이 안을 채우는 내용을 정한다 — 이미지, 텍스트 이니셜, 또는 fallback 아이콘 — Style이 프레임 모양(rounded, rectangle, circle)을 정한다. 순수 표시 요소로 인터랙티브 상태는 없다." } },
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
