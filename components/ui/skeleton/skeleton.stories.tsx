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
    docs: { description: { component: "실제 콘텐츠가 로딩되는 동안 보여주는 placeholder 도형으로, 위로 shimmer가 스쳐 지나간다. 한 segment가 텍스트 한 줄, 원, 블록 등 콘텐츠 한 조각을 대신하므로, 보통 여러 개를 조합해 아래에 올 레이아웃의 형태를 맞춘다. 미리 보여줄 레이아웃이 없을 땐 Spinner를 사용한다." } },
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
