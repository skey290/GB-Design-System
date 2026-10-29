import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Chatbox, type ChatboxProps } from "./chatbox";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418";

/** A list mapped 1:1 to the values of the Figma `Status` axis. */
type ChatboxStatus = "default" | "filled" | "active" | "disabled";

const STATUS_PROPS: Record<ChatboxStatus, Partial<ChatboxProps>> = {
  default: {},
  filled: { defaultValue: "Please share your ideas." },
  active: { className: "pseudo-focus-within pseudo-focus-within-all" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ChatboxProps, "defaultValue" | "disabled"> & {
  status: ChatboxStatus;
};

const meta = {
  title: "UI/Chatbox",
  component: Chatbox,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the redundant controls
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "The message composer for a chat interface — a growing text area with a file-attach button and a send button. The area above the text input is an empty slot that hugs whatever is placed in it: attachment thumbnails, suggestion chips, or option rows.",
      },
      source: {
        transform: makeStatusSource("Chatbox", STATUS_PROPS, {
          cssOnly: ["active"],
          omit: ["children"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Chatbox key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is a focus-within CSS state, so click into the text area on the canvas to see it",
    },
    placeholder: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    showAiButton: { control: "boolean" },
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 700px",
    },
    children: {
      control: false,
      description:
        "Slot above the text input area (Figma `-> Slot`). Grows with its content, with no height constraint.",
    },
    value: { control: false },
  },
  args: {
    status: "default",
    multiple: false,
    showAiButton: true,
    onValueChange: fn(),
    onAttachFiles: fn(),
    onSend: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
