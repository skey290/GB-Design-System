import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputFileUpload } from "./input-file-upload";

const meta = {
  title: "UI/InputFileUpload",
  component: InputFileUpload,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=5084-3716",
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    file: { control: false },
  },
  args: {
    onFileChange: fn(),
  },
} satisfies Meta<typeof InputFileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
