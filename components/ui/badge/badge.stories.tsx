import type { Meta, StoryObj } from "@storybook/nextjs";

import { Badge } from "./badge";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3479";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    // Verbatim text from the Figma component's description field
    docs: { description: { component: "개수, 상태, 짧은 변동값을 보여주는 작은 인라인 라벨. Style이 색상 역할을 정하고, Size(20/28)가 라벨과 leading icon을 함께 스케일한다. 순수하게 수동적인 표시 요소이며, 클릭/선택/삭제 가능한 필이 필요하면 Chips를 사용한다." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: [
        "default",
        "reverse",
        "outline",
        "alarm",
        "success",
        "destructive",
      ],
    },
    size: {
      control: "radio",
      options: ["20", "28"],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
    variant: "outline",
    size: "20",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
