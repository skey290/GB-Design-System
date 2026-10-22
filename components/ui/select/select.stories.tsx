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
      description: {
        component:
          "A dropdown for choosing a single value from a list of options, made of a trigger and the option list it opens. The trigger shows the selected value, or the placeholder while nothing is chosen. For free text entry, use Input instead.",
      },
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
    isSearchable: {
      control: "boolean",
      description:
        "Shows a search box above the list that filters options by label (Figma `phone number` Type only)",
    },
    searchPlaceholder: { control: "text" },
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
