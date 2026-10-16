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

/** List mapped 1:1 to the values of the Figma `Status` axis. */
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
    // `status` controls this instead, so hide the duplicate control
    controls: { exclude: ["disabled", "value"] },
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      // Verbatim text from the Figma component's description field
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
        "Trigger shape — the side variants open the dropdown to the side instead of below",
    },

    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `hovered`/`pressed` are CSS states, so just hover or press on the canvas directly. disabled is only defined in Figma for primary/icon",
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
