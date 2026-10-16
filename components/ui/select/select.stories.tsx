import type { Meta, StoryObj } from "@storybook/nextjs";

import { Select, type SelectProps } from "./select";
import { makeStatusSource } from "../../../.storybook/status-source";

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
type SelectStatus = "default" | "filled" | "hovered" | "disabled";

const STATUS_PROPS: Record<SelectStatus, Partial<SelectProps>> = {
  default: { value: undefined },
  filled: { value: OPTIONS[0].value },
  hovered: { className: "pseudo-hover pseudo-hover-all" },
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
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "value"] },
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "트리거와 그것이 여는 옵션 목록으로 구성된, 목록에서 단일 값을 고르는 드롭다운. 트리거는 선택된 값을, 아무것도 선택되지 않았을 땐 placeholder를 보여준다. 자유 텍스트 입력에는 Input을 사용한다." },
      source: {
        transform: makeStatusSource("Select", STATUS_PROPS, {
          cssOnly: ["hovered"],
          omit: ["options"],
        }),
      },
    },
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
