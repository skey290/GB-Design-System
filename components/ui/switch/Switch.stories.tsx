import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Switch, type SwitchProps } from "./switch";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type SwitchStatus = "default" | "disabled";

const STATUS_PROPS: Record<SwitchStatus, Partial<SwitchProps>> = {
  default: {},
  disabled: { disabled: true },
};

type StoryArgs = Omit<SwitchProps, "disabled"> & {
  status: SwitchStatus;
};

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10618",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A single on/off toggle rendered as a track-and-thumb slider, typically for a setting that takes effect immediately. Distinct from Toggle, which is a group of buttons where each one can be pressed on or off independently. Use Checkbox when the value is only committed on submit.",
      },
      source: {
        transform: makeStatusSource("Switch", STATUS_PROPS),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Switch {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
    status: "default",
    onCheckedChange: fn(),
  },
  argTypes: {
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description:
        "Which side of the track the label sits on (Figma `Type` variant)",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "Switch size (Figma `Size` variant)",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis — independent of `On`, `Type` (label position), and `Size`",
    },
    defaultChecked: { control: "boolean" },
    label: { control: "text" },
    showLabel: {
      control: "boolean",
      description:
        "Figma `label` property. When false the label becomes sr-only — invisible but still the accessible name",
    },
    checked: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
