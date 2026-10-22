import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputPhone, type InputPhoneProps } from "./input-phone";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3525-8236";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type InputPhoneStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<InputPhoneStatus, Partial<InputPhoneProps>> = {
  default: {},
  filled: { defaultValue: "248-685-5641", defaultCountryCode: "us" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<
  InputPhoneProps,
  "defaultValue" | "defaultCountryCode" | "disabled"
> & {
  status: InputPhoneStatus;
};

const meta = {
  title: "UI/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "defaultValue", "defaultCountryCode"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled phone-number field — a country-code dropdown on the left and the number input on the right. The dropdown is a Select, defaulting to the full country list from libphonenumber-js; the consumer can narrow it with countryCodeOptions.",
      },
      source: {
        transform: makeStatusSource("InputPhone", STATUS_PROPS),
      },
    },
  },
  render: ({ status, ...args }) => (
    <InputPhone key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 320px",
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder for the country search box",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description: "Figma `Status` axis",
    },
    value: { control: false },
    countryCode: { control: false },
    countryCodeOptions: { control: false },
  },
  args: {
    placeholder: "248-685-5641",
    status: "default",
    onCountryCodeChange: fn(),
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
