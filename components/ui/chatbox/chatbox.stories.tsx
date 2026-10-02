import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Chatbox } from "./chatbox";

const FIGMA_FILE_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom";

const sampleImages = [
  {
    src: "/images/personas/novelist.jpg",
    alt: "portrait 1",
  },
  {
    src: "/images/personas/entrepreneur.jpg",
    alt: "portrait 2",
  },
  {
    src: "/images/personas/team-leader.jpg",
    alt: "portrait 3",
  },
];

const meta = {
  title: "UI/Chatbox",
  component: Chatbox,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: `${FIGMA_FILE_URL}?node-id=7219-5418`,
    },
  },
  args: {
    onValueChange: fn(),
    onAttach: fn(),
    onSend: fn(),
    onRemoveImage: fn(),
    onChipChange: fn(),
    onSentenceOptionChange: fn(),
  },
  argTypes: {
    value: { control: false },
  },
} satisfies Meta<typeof Chatbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Style=default` / `Status=default` (node 7219:5419) */
export const Default: Story = {
  args: {
    variant: "default",
  },
};

/** Figma `Style=default` / `Status=filled` (node 7219:5424) — 실제 입력값이
 * 있으면 텍스트 색이 `--text-subtle`(placeholder)에서 `--text-default`(입력값)로
 * 자연히 바뀝니다. 별도 prop이 아니라 `defaultValue`로 재현합니다. */
export const Filled: Story = {
  args: {
    variant: "default",
    defaultValue: "I want to create a summer campaign visual.",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5424` },
  },
};

/** Figma `Style=default` / `Status=active` (node 7219:5434) — prop이 아니라
 * 내부 textarea 포커스에 대한 `focus-within` CSS 상태입니다. */
export const Active: Story = {
  args: {
    variant: "default",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5434` },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Please share your ideas.");

    await userEvent.click(textarea);

    await expect(textarea).toHaveFocus();
  },
};

/** Figma `Style=default` / `Status=disabled` (node 7219:5429) */
export const Disabled: Story = {
  args: {
    variant: "default",
    disabled: true,
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5429` },
  },
};

/** Figma `Style=image` / `Status=default` (node 7219:5439) */
export const WithImages: Story = {
  args: {
    variant: "image",
    images: sampleImages,
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5439` },
  },
};

/** Figma `Style=image` / `Status=disabled` (node 7219:5511) */
export const WithImagesDisabled: Story = {
  args: {
    variant: "image",
    images: sampleImages,
    disabled: true,
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5511` },
  },
};

/** Figma `Style=chip` / `Status=default` (node 7219:5471) — 필터 pill 3개
 * (All/Image/Text), 클릭으로 선택 전환되는 내부 상태 */
export const ChipFilter: Story = {
  args: {
    variant: "chip",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5471` },
  },
};

/** Figma `Style=chip` / `Status=disabled` (node 7219:5527) */
export const ChipFilterDisabled: Story = {
  args: {
    variant: "chip",
    disabled: true,
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5527` },
  },
};

/** Figma `Style=sentence option` / `Status=default` (node 7219:5481) — 문장
 * 선택 리스트 3행, 클릭으로 선택 전환되는 내부 상태 */
export const SentenceOption: Story = {
  args: {
    variant: "sentence-option",
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5481` },
  },
};

/** Figma `Style=sentence option` / `Status=active` (node 7219:5573) — 두
 * 번째 행이 미리 선택된 상태 */
export const SentenceOptionSelected: Story = {
  args: {
    variant: "sentence-option",
    defaultSelectedSentenceOption: 1,
  },
  parameters: {
    design: { type: "figma", url: `${FIGMA_FILE_URL}?node-id=7219-5573` },
  },
};

export const Interaction: Story = {
  args: {
    variant: "default",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText(
      "Please share your ideas.",
    ) as HTMLTextAreaElement;

    await userEvent.type(textarea, "hello");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("hello");

    const sendButton = canvas.getByRole("button", { name: "전송" });
    await userEvent.click(sendButton);
    await expect(args.onSend).toHaveBeenCalledTimes(1);
    // 전송 후 입력창이 실제로 비워지는지 확인
    await expect(textarea).toHaveValue("");
  },
};

/** uncontrolled(`defaultImages`) 사용 시 X 버튼 클릭만으로 실제 DOM에서
 * 썸네일이 사라지는지 확인 (controlled 사용 시 부모가 `images`를 갱신해야 함) */
export const RemoveImageInteraction: Story = {
  args: {
    variant: "image",
    defaultImages: sampleImages,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByRole("img")).toHaveLength(3);

    const removeButtons = canvas.getAllByRole("button", {
      name: "이미지 제거",
    });
    await userEvent.click(removeButtons[0]);

    await expect(args.onRemoveImage).toHaveBeenCalledWith(0);
    await expect(canvas.getAllByRole("img")).toHaveLength(2);
  },
};

/** 첨부 버튼 클릭 → 숨겨진 파일 input에 파일 선택 → 썸네일이 실제로 추가됨 */
export const AttachFileInteraction: Story = {
  args: {
    variant: "default",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryAllByRole("img")).toHaveLength(0);

    const fileInput = canvasElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });

    await userEvent.click(canvas.getByRole("button", { name: "첨부" }));
    await expect(args.onAttach).toHaveBeenCalledTimes(1);

    await userEvent.upload(fileInput, file);

    await expect(canvas.getAllByRole("img")).toHaveLength(1);
  },
};

/** chip pill 클릭 시 선택이 전환되고 `onChipChange`가 호출되는지 확인 */
export const ChipSelectInteraction: Story = {
  args: {
    variant: "chip",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const imageChip = canvas.getByRole("button", { name: "Image" });
    await userEvent.click(imageChip);

    await expect(args.onChipChange).toHaveBeenCalledWith(1);
    await expect(imageChip).toHaveAttribute("aria-pressed", "true");
  },
};

/** sentence option 행 클릭 시 선택이 전환되고 `onSentenceOptionChange`가
 * 호출되는지 확인 */
export const SentenceOptionSelectInteraction: Story = {
  args: {
    variant: "sentence-option",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const longTextRow = canvas.getByRole("button", {
      name: "I would like to change Long Text (Description)",
    });
    await userEvent.click(longTextRow);

    await expect(args.onSentenceOptionChange).toHaveBeenCalledWith(2);
    await expect(longTextRow).toHaveAttribute("aria-pressed", "true");
  },
};
