import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

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
  args: {
    type: "process",
    timestamp: "2026.03.24 19:24:06",
    portraitSrc: PORTRAIT_SRC,
    onFileSelect: fn(),
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["process", "completed", "upload"],
    },
  },
} satisfies Meta<typeof ProfilePrint>;

export default meta;

type Story = StoryObj<typeof meta>;

// --- type=process (7256:22341) ---

export const Process: Story = {
  args: {
    type: "process",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE}?node-id=7256-22341` },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Processing")).toBeInTheDocument();
    await expect(canvas.getByText("2026.03.24 19:24:06")).toBeInTheDocument();
  },
};

// --- type=completed (7256:22328) ---

export const Completed: Story = {
  args: {
    type: "completed",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE}?node-id=7256-22328` },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("img")).toBeInTheDocument();
    await expect(canvas.getByText("2026.03.24 19:24:06")).toBeInTheDocument();
    await expect(canvas.queryByText("Processing")).not.toBeInTheDocument();
  },
};

// --- type=upload (7256:22331) ---

export const Upload: Story = {
  args: {
    type: "upload",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE}?node-id=7256-22331` },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText("Let's create your brand image!"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Open your folder" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Gabrielle.ai")).toBeInTheDocument();
  },
};

// --- 인터랙션: "Open your folder" 클릭 → 숨겨진 파일 인풋 트리거 ---

export const UploadOpenFolderInteraction: Story = {
  args: {
    type: "upload",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Open your folder" });
    const fileInput = canvasElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const clickSpy = fn();
    fileInput.addEventListener("click", clickSpy);

    await userEvent.click(button);

    await expect(clickSpy).toHaveBeenCalledTimes(1);
    await expect(args.onFileSelect).not.toHaveBeenCalled();
  },
};
