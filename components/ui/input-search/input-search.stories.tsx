import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputSearch, type InputSearchProps } from "./input-search";
import { makeStatusSource } from "../../../.storybook/status-source";

/** List mapped 1:1 to the values of the Figma `Status` axis. */
type InputSearchStatus = "default" | "filled" | "active" | "disabled";

const STATUS_PROPS: Record<InputSearchStatus, Partial<InputSearchProps>> = {
  default: {},
  filled: { defaultValue: "design system" },
  active: {
    className:
      "pseudo-focus pseudo-focus-all pseudo-focus-within pseudo-focus-within-all",
  },
  disabled: { disabled: true },
};

type StoryArgs = Omit<InputSearchProps, "defaultValue" | "disabled"> & {
  status: InputSearchStatus;
};

const meta = {
  title: "UI/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the duplicate control
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3981-19811",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A single-line field for search queries, with a search icon inside the input box. Submitting is the consumer's concern — this component only owns the query text. Use the plain Input for ordinary text entry.",
      },
      source: {
        transform: makeStatusSource("InputSearch", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <InputSearch key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 344px",
    },
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is a hover/focus CSS state, so just hover or focus on the canvas directly",
    },
    value: { control: false },
  },
  args: {
    status: "default",
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
