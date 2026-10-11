import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { RangeSelect, type RangeSelectProps } from "./range-select";
import type { CalendarRangeValue } from "@/components/ui/calendar/calendar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10932";

function ControlledRangeSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: RangeSelectProps) {
  const [value, setValue] = React.useState<CalendarRangeValue | undefined>(
    initialValue,
  );
  React.useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <RangeSelect
      {...rest}
      value={value}
      onValueChange={(range) => {
        setValue(range);
        onValueChange?.(range);
      }}
    />
  );
}

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type RangeSelectStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<RangeSelectStatus, Partial<RangeSelectProps>> = {
  default: {},
  filled: { value: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) } },
  disabled: { disabled: true },
};

type StoryArgs = Omit<RangeSelectProps, "value" | "disabled"> & {
  status: RangeSelectStatus;
};

const meta = {
  title: "UI/RangeSelect",
  component: RangeSelect,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  render: ({ status, ...args }) => (
    <ControlledRangeSelect key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `hovered`·`pressed`는 CSS 상태라 캔버스에서 직접 올리거나 눌러 보면 된다",
    },
  },
  args: {
    status: "default",
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
