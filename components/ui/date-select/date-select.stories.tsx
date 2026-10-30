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

/**
 * Four of the five values of the Figma `Status` axis. `pressed` is left out
 * because it is the open popover (`[data-state="open"]`), which the component
 * drives from internal state rather than a prop.
 */
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
          "A field that opens a calendar and returns a single date. The trigger shows the chosen date, or the placeholder while empty. For a start-and-end pair, use Range select instead.",
        story:
          "Canvas uses a demo-only local-state wrapper so picking a date works in isolation. The code below reflects the current Controls values as real props — see docs/components/date-select.md.",
      },
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
        "Figma `Status` axis. `hovered` is a CSS state — hover the canvas directly to see it. Figma's fifth value `pressed` is the open calendar, so click the trigger to see that one",
    },
    shouldFitContainer: {
      control: "boolean",
      description:
        "Fill the parent width instead of the fixed 192px. Default true",
    },
  },
  args: {
    status: "default",
    shouldFitContainer: true,
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
