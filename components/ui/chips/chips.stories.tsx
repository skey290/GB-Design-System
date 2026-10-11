import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chips, type ChipsProps } from "./chips";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3021-1615";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ChipsStatus = "default" | "active" | "disabled";

const STATUS_PROPS: Record<ChipsStatus, Partial<ChipsProps>> = {
  default: {},
  active: { selected: true },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ChipsProps, "selected" | "disabled"> & {
  status: ChipsStatus;
};

const meta = {
  title: "UI/Chips",
  component: Chips,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "selected"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      source: {
        transform: makeStatusSource("Chips", STATUS_PROPS, {
          childrenKey: "children",
        }),
      },
    },
  },
  render: ({ status, ...args }) => <Chips {...args} {...STATUS_PROPS[status]} />,
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 눌린(선택된) 상태이고, `disabled` 배색은 Type과 무관하게 하나다",
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost"],
      description: "Figma `Type` 축",
    },
    showDeleteIcon: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    status: "default",
    children: "Chip",
    variant: "primary",
    showDeleteIcon: false,
    onDelete: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
