import type { Meta, StoryObj } from "@storybook/nextjs";

import { Select } from "./select";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=614-2466";

const OPTIONS = [
  { value: "strategist", label: "Strategist" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "storyteller", label: "Storyteller" },
  { value: "analyst", label: "Analyst" },
  { value: "creator", label: "Creator" },
  { value: "curator", label: "Curator" },
  { value: "educator", label: "Educator" },
  { value: "researcher", label: "Researcher" },
];

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "reverse",
        "mute",
        "ghost",
        "icon",
        "side",
        "side-reverse",
      ],
      description:
        "트리거 형태 — side 계열은 드롭다운이 아래가 아니라 옆으로 열립니다",
    },
    value: {
      control: "select",
      options: [undefined, ...OPTIONS.map((option) => option.value)],
      description: "선택된 값 (비우면 placeholder 표시 = Figma default 상태)",
    },
    placeholder: { control: "text" },
    disabled: {
      control: "boolean",
      description: "Figma에는 primary/icon에만 정의되어 있습니다",
    },
    options: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "primary",
    options: OPTIONS,
    placeholder: "Select...",
    disabled: false,
  },
};
