import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { ProfilePrint } from "./profile-print";

const FIGMA_FILE =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom";

const PORTRAIT_SRC = "/images/personas/self-default.jpg";

const meta = {
  title: "UI/ProfilePrint",
  component: ProfilePrint,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: `${FIGMA_FILE}?node-id=7256-22281`,
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["process", "completed", "upload"],
    },
    timestamp: { control: "text" },
  },
  args: {
    type: "process",
    timestamp: "2026.03.24 19:24:06",
    portraitSrc: PORTRAIT_SRC,
    onFileSelect: fn(),
  },
} satisfies Meta<typeof ProfilePrint>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
