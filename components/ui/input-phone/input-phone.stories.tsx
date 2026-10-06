import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputPhone } from "./input-phone";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3525-8236";

const COUNTRY_CODE_OPTIONS = [
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "cn", label: "China", code: "+86" },
];

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
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    value: { control: false },
    countryCode: { control: false },
  },
  args: {
    countryCodeOptions: COUNTRY_CODE_OPTIONS,
    defaultCountryCode: "cn",
    placeholder: "248-685-5641",
    disabled: false,
    onCountryCodeChange: fn(),
    onValueChange: fn(),
  },
} satisfies Meta<typeof InputPhone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
