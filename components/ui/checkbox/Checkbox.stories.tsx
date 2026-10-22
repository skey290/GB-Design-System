import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Checkbox, type CheckboxProps } from "./checkbox";
import { makeStatusSource } from "../../../.storybook/status-source";

/** A list matched 1:1 with the values of the Figma `Status` axis. */
type CheckboxStatus =
  | "default"
  | "part"
  | "checked"
  | "disabled"
  | "disabled-checked"
  | "disabled-part";

const STATUS_PROPS: Record<CheckboxStatus, Partial<CheckboxProps>> = {
  default: {},
  checked: { defaultChecked: true },
  part: { indeterminate: true },
  disabled: { disabled: true },
  "disabled-checked": { disabled: true, defaultChecked: true },
  "disabled-part": { disabled: true, indeterminate: true },
};

type StoryArgs = Omit<
  CheckboxProps,
  "defaultChecked" | "indeterminate" | "disabled"
> & {
  status: CheckboxStatus;
};

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: {
      exclude: ["disabled", "defaultChecked", "indeterminate", "checked"],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A single boolean choice, optionally with a text label beside the box. Status sets what the box shows — nothing, part (indeterminate, for a partially selected group), or a check — and carries the disabled variants of each, so a disabled checkbox still shows whether it was checked. Type sets the visual tone of the enabled states. Use for one standalone yes/no option — for choosing one out of many mutually exclusive options, use a radio group instead.",
      },
      source: {
        transform: makeStatusSource("Checkbox", STATUS_PROPS),
      },
    },
  },
  // status changes the uncontrolled initial value (defaultChecked), so remount via key.
  render: ({ status, ...args }) => (
    <Checkbox key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    status: "default",
    label: "Accept terms and conditions",
    showLabel: true,
    type: "default",
    onCheckedChange: fn(),
  },
  argTypes: {
    status: {
      control: "select",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Covers the check/dash marks and the disabled state together; the disabled palette is the same regardless of Type",
    },
    type: {
      control: "radio",
      options: ["default", "mute"],
      description:
        "Figma `Type` axis. Combines with default, part, and checked alike",
    },
    label: { control: "text" },
    showLabel: {
      control: "boolean",
      description:
        "Figma `label` property. When false the label becomes sr-only — invisible but still the accessible name",
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
