import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Textarea, type TextareaProps } from "./textarea";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type TextareaStatus = "default" | "active" | "filled";

const STATUS_PROPS: Record<TextareaStatus, Partial<TextareaProps>> = {
  default: {},
  active: { className: "pseudo-focus-visible pseudo-focus-visible-all" },
  filled: { defaultValue: "Tell me about your interests." },
};

type StoryArgs = Omit<TextareaProps, "defaultValue"> & {
  status: TextareaStatus;
};

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=623-3651",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled multi-line text field that can show a character counter when a maximum length is set. Use Input for a single line, and Chatbox for a chat message composer.",
      },
      source: {
        transform: makeStatusSource("Textarea", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Textarea key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 725px",
    },
    title: { control: "text" },
    placeholder: { control: "text" },
    maxLength: { control: "number" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the focus CSS state — click the canvas directly to see it",
    },
    value: { control: false },
  },
  args: {
    title: "What are you into?",
    placeholder: "Tell me about your interests.",
    maxLength: 1000,
    status: "default",
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
