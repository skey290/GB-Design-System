import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputPhone, type InputPhoneProps } from "./input-phone";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3525-8236";

const COUNTRY_CODE_OPTIONS = [
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "cn", label: "China", code: "+86" },
];

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type InputPhoneStatus = "default" | "filled" | "disabled";

const STATUS_PROPS: Record<InputPhoneStatus, Partial<InputPhoneProps>> = {
  default: {},
  filled: { defaultValue: "248-685-5641", defaultCountryCode: "us" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<InputPhoneProps, "defaultValue" | "defaultCountryCode" | "disabled"> & {
  status: InputPhoneStatus;
};

const meta = {
  title: "UI/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  render: ({ status, ...args }) => (
    <InputPhone key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축",
    },
    value: { control: false },
    countryCode: { control: false },
  },
  args: {
    countryCodeOptions: COUNTRY_CODE_OPTIONS,
    placeholder: "248-685-5641",
    status: "default",
    onCountryCodeChange: fn(),
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
