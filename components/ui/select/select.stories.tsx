import type { Meta, StoryObj } from "@storybook/nextjs";

import { Select, type SelectProps } from "./select";

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

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type SelectStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<SelectStatus, Partial<SelectProps>> = {
  default: { value: undefined },
  filled: { value: OPTIONS[0].value },
  disabled: { disabled: true },
};

type StoryArgs = Omit<SelectProps, "value" | "disabled"> & {
  status: SelectStatus;
};

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  render: ({ status, ...args }) => (
    <Select key={status} {...args} {...STATUS_PROPS[status]} />
  ),
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

    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `hovered`·`pressed`는 CSS 상태라 캔버스에서 직접 올리거나 눌러 보면 된다. disabled는 Figma에 primary·icon에만 정의돼 있다",
    },
    options: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "primary",
    options: OPTIONS,
    placeholder: "Select...",
    status: "default",
  },
};
