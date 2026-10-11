import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { DateSelect, type DateSelectProps } from "./date-select";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10905";

function ControlledDateSelect({
  value: initialValue,
  onValueChange,
  ...rest
}: DateSelectProps) {
  const [value, setValue] = React.useState<Date | undefined>(initialValue);
  React.useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <DateSelect
      {...rest}
      value={value}
      onValueChange={(date) => {
        setValue(date);
        onValueChange?.(date);
      }}
    />
  );
}

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type DateSelectStatus = "default" | "filled" | "hovered" | "disabled";

const STATUS_PROPS: Record<DateSelectStatus, Partial<DateSelectProps>> = {
  default: {},
  filled: { value: new Date(2026, 8, 1) },
  hovered: { className: "pseudo-hover pseudo-hover-all" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<DateSelectProps, "value" | "disabled"> & {
  status: DateSelectStatus;
};

const meta = {
  title: "UI/DateSelect",
  component: DateSelect,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "value"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      source: {
        transform: makeStatusSource("DateSelect", STATUS_PROPS, {
          cssOnly: ["hovered"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ControlledDateSelect key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
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
