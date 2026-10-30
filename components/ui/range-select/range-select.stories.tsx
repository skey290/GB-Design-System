import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { RangeSelect, type RangeSelectProps } from "./range-select";
import { makeStatusSource } from "../../../.storybook/status-source";
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

/** Matched 1:1 with the values of the Figma `Status` axis. */
type RangeSelectStatus = "default" | "filled" | "hovered" | "disabled";

const STATUS_PROPS: Record<RangeSelectStatus, Partial<RangeSelectProps>> = {
  default: {},
  filled: { value: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) } },
  hovered: { className: "pseudo-hover pseudo-hover-all" },
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
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "value"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A field that opens a calendar and returns a start and end date. The trigger shows both endpoints, or the placeholder while empty. For a single date, use Date select instead.",
        story:
          "Canvas uses a demo-only local-state wrapper so picking a range works in isolation. The code below reflects the current Controls values as real props — see docs/components/range-select.md.",
      },
      source: {
        transform: makeStatusSource("RangeSelect", STATUS_PROPS, {
          cssOnly: ["hovered"],
        }),
      },
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
        "Figma `Status` axis. `hovered` and `pressed` are CSS states — hover or press the canvas directly to see them",
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
