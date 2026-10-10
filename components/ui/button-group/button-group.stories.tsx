import type { Meta, StoryObj } from "@storybook/nextjs";

import { ButtonGroup } from "./button-group";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3466-29935";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "skippable",
        "back-or-forth",
        "save",
        "confirm",
        "error",
        "menu",
      ],
      description: "버튼 조합 종류 (menu만 플로팅 내비게이션 pill)",
    },
    disabled: {
      control: "boolean",
      description: "조합 내 모든 버튼을 비활성화",
    },
    shouldFitContainer: {
      control: "boolean",
      description: "고정 너비(344px) 대신 부모 너비를 채움 (menu 제외)",
    },
    secondaryLabel: {
      control: "text",
      description: "왼쪽 outline 버튼 라벨 (비우면 type별 기본값)",
    },
    primaryLabel: {
      control: "text",
      description: "오른쪽 primary 버튼 라벨 (비우면 type별 기본값)",
    },
    activeId: {
      control: "select",
      options: [undefined, "home", "assets", "compass", "contents-studio"],
      description: "menu에서 활성화된 항목 id",
    },
    items: { control: false },
    onSecondaryClick: { control: false },
    onPrimaryClick: { control: false },
    onActiveChange: { control: false },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: "skippable",
    disabled: false,
    shouldFitContainer: false,
    activeId: "compass",
  },
};
