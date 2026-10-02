import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

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
  args: {
    onFileChange: fn(),
  },
  argTypes: {
    file: { control: false },
  },
} satisfies Meta<typeof InputFileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Status=default` (node-id 3466:30269) */
export const Default: Story = {};

/** Figma `Status=active` (node-id 5153:2051) — 실제로는 prop이 아니라
 * `:hover`/`:focus` CSS 상태입니다. */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("File Upload");

    await userEvent.click(input);

    await expect(input).toHaveFocus();
  },
};

/** Figma `Status=filled` (node-id 4930:6507) — 파일이 선택되면 예시
 * placeholder 색(muted)이 아니라 기본 텍스트 색으로 파일명이 표시됩니다. */
export const Filled: Story = {
  render: (args) => {
    const file = new File(["dummy"], "File.pdf", { type: "application/pdf" });
    return <InputFileUpload {...args} file={file} />;
  },
};

export const WithoutDescription: Story = {
  args: {
    description: "",
  },
};

export const FileSelectionInteraction: Story = {
  name: "File Selection Interaction",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText<HTMLInputElement>("File Upload");
    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });

    await userEvent.upload(input, file);

    await expect(args.onFileChange).toHaveBeenLastCalledWith(file);
  },
};
