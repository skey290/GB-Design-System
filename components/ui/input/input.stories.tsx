import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Input } from "./input";

const MBTI_OPTIONS = [
  { value: "ISTJ", label: "ISTJ" },
  { value: "ISFJ", label: "ISFJ" },
  { value: "INTJ", label: "INTJ" },
  { value: "INFJ", label: "INFJ" },
  { value: "ISTP", label: "ISTP" },
  { value: "ISFP", label: "ISFP" },
];

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5084-3716",
    },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    showTextfield: { control: "boolean" },
    showUpload: { control: "boolean" },
    showSelect: { control: "boolean" },
    showLink: { control: "boolean" },
    textfieldPlaceholder: { control: "text" },
    uploadPlaceholder: { control: "text" },
    selectPlaceholder: { control: "text" },
    linkPlaceholder: { control: "text" },
    file: { control: false },
    selectOptions: { control: false },
  },
  args: {
    showTextfield: true,
    showUpload: true,
    showSelect: true,
    showLink: true,
    selectOptions: MBTI_OPTIONS,
    onFileChange: fn(),
    onTextfieldValueChange: fn(),
    onSelectValueChange: fn(),
    onLinkValueChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
