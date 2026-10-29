import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Input, type InputProps } from "./input";
import { makeStatusSource } from "../../../.storybook/status-source";

/** List matched 1:1 with the Figma `Status` axis values. */
type InputStatus = "default" | "filled" | "active" | "error" | "disabled";

const STATUS_PROPS: Record<InputStatus, Partial<InputProps>> = {
  default: {},
  filled: { defaultValue: "hello@example.com" },
  active: {
    className:
      "pseudo-focus pseudo-focus-all pseudo-focus-within pseudo-focus-within-all",
  },
  error: { isError: true },
  disabled: { disabled: true },
};

type StoryArgs = Omit<InputProps, "defaultValue" | "isError" | "disabled"> & {
  status: InputStatus;
};

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the duplicate controls
    controls: { exclude: ["disabled", "defaultValue", "isError"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062",
    },
    docs: {
      // Verbatim text from Figma's description field
      description: {
        component:
          "The bare single-line input box: border, padding, placeholder, and the trailing icon implied by its Type. Has no label, helper text, or error message — those are composed by the higher-level fields (Input form, Input search, Input time, Input phone) that wrap this as their base. Use one of those rather than placing this on its own.",
      },
      source: {
        transform: makeStatusSource("Input", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Input key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` isn't a prop — it's a hover/focus CSS state, so hover or click into the field on the canvas to see it",
    },
    type: {
      control: "radio",
      options: ["textfield", "upload", "link", "social-connect"],
      description:
        "Figma `Type` axis. Decides the trailing icon — textfield none / upload `Plus` / link `Globe` — or, for `social-connect`, replaces the field entirely with a fixed Linkedin connect button (`status` above doesn't apply to it; use `isConnected`/`isError`/`disabled` directly)",
    },
    inputType: {
      control: "text",
      description:
        "Native `<input type>` forwarded to the DOM (`tel`, `url`, …). Ignored by `upload` and `social-connect`",
    },
    isConnected: {
      control: "boolean",
      description: '`type="social-connect"` only — shows the connected label',
    },
    value: { control: false },
  },
  args: {
    placeholder: "Email or Username",
    status: "default",
    type: "textfield",
    onValueChange: fn(),
    onConnectClick: fn(),
  },
  // Inside a parent field (Input, etc.) this is FILL with no width of its own — wrap it in the parent's inner width from Figma.
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
