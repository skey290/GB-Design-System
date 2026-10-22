import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputTime, type InputTimeProps } from "./input-time";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type InputTimeStatus = "default" | "filled" | "active" | "disabled";

const STATUS_PROPS: Record<InputTimeStatus, Partial<InputTimeProps>> = {
  default: { defaultValue: "" },
  filled: { defaultValue: "1100" },
  active: {
    className:
      "pseudo-focus pseudo-focus-all pseudo-focus-within pseudo-focus-within-all",
  },
  disabled: { defaultValue: "1100", disabled: true },
};

type StoryArgs = Omit<InputTimeProps, "defaultValue" | "disabled"> & {
  status: InputTimeStatus;
};

const meta = {
  title: "UI/InputTime",
  component: InputTime,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled time field — a masked hh:mm input plus an AM/PM toggle. Typing is constrained so only valid hours (1–12) and minutes (00–59) can be entered. Use Date select for a calendar date.",
      },
      source: {
        transform: makeStatusSource("InputTime", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <InputTime key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    label: "Time to post",
    status: "default",
    defaultPeriod: "AM",
    showDelete: false,
    showTitle: true,
    onValueChange: fn(),
    onPeriodChange: fn(),
    onDelete: fn(),
  },
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 320px",
    },
    label: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the focus CSS state; `error` appears when an out-of-range value is typed",
    },
    showDelete: { control: "boolean" },
    showTitle: { control: "boolean" },
    defaultPeriod: {
      control: "radio",
      options: ["AM", "PM"],
    },
    value: { control: false },
    period: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
