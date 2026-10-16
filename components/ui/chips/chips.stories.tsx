import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chips, type ChipsProps } from "./chips";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3021-1615";

/** List matched 1:1 with the Figma `Status` axis values. */
type ChipsStatus = "default" | "active" | "disabled";

const STATUS_PROPS: Record<ChipsStatus, Partial<ChipsProps>> = {
  default: {},
  active: { selected: true },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ChipsProps, "selected" | "disabled"> & {
  status: ChipsStatus;
};

/** `selected` is a controlled prop, so the story must hold its own state for clicks to take effect. */
function ControlledChips({ selected, onClick, ...props }: ChipsProps) {
  const [isSelected, setIsSelected] = React.useState(selected ?? false);

  return (
    <Chips
      {...props}
      selected={isSelected}
      onClick={(event) => {
        setIsSelected((prev) => !prev);
        onClick?.(event);
      }}
    />
  );
}

const meta = {
  title: "UI/Chips",
  component: Chips,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the duplicate controls
    controls: { exclude: ["disabled", "selected"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "필터나 태그 선택을 위한 클릭 가능한 선택형 필(pill)로, 사용자가 하나 이상의 옵션을 켜고 끈다. Delete icon을 켜면 칩을 제거하는 X 배지가 추가되며, 칩이 disabled일 때는 조작할 수 없으므로 숨겨진다. 능동적 조작이 없는 수동적 라벨인 Badge와는 구분된다." },
      source: {
        transform: makeStatusSource("Chips", STATUS_PROPS, {
          childrenKey: "children",
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ControlledChips key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the pressed (selected) state, and the `disabled` coloring is a single look regardless of Type",
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost"],
      description: "Figma `Type` axis",
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
