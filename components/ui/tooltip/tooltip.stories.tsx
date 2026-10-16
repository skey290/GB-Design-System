import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Tooltip } from "./tooltip";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=79-11350";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "대상에 hover하거나 키보드 포커스를 받았을 때 나타나는 작은 플로팅 힌트. 짧은 한 줄 텍스트와 대상을 가리키는 화살표로 구성되며, Arrow position이 화살표가 놓이는 쪽을 정한다. 컨트롤이 필요하거나 한 문장을 넘는 콘텐츠에는 Popover를 사용한다." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "reversed"],
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    variant: "default",
    side: "top",
    align: "center",
    title: "Title",
    description: "Tool tip text",
    // Controls로 바로 보이도록 열린 채 시작하되, 비제어로 둬서 hover·닫기가
    // 실제로 동작하게 한다. 실 서비스 hover 지연은 0으로 고정.
    defaultOpen: true,
    delayDuration: 0,
    onClose: fn(),
    children: <button type="button">Hover me</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
