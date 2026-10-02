import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { Popover, type PopoverProps } from "./popover";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7269-451";

/**
 * Figma에 트리거가 없는 완전 제어형 컴포넌트라, 스토리에서 열기용 버튼과 로컬 state를
 * 얹은 데모 래퍼로 감싸 실제 사용 흐름(트리거 클릭 → 다이얼로그 오픈 → Cancel/Confirm)을
 * play function으로 검증할 수 있게 합니다.
 */
function PopoverDemo({ open: openProp, onOpenChange, ...rest }: PopoverProps) {
  const [open, setOpen] = React.useState(openProp);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
  };

  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Popover {...rest} open={open} onOpenChange={handleOpenChange} />
    </div>
  );
}

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  args: {
    type: "notification",
    title: "Heading to 'Content Studio' to create your post?",
    description:
      "Exit this page and start creating a post in 'Content Studio'.",
    open: false,
    onOpenChange: fn(),
    onCancel: fn(),
    onConfirm: fn(),
  },
  render: (args) => <PopoverDemo {...args} />,
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Notification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    const dialog = await within(document.body).findByRole("alertdialog");
    await expect(dialog).toBeInTheDocument();
    await expect(
      within(dialog).getByText(/Content Studio/),
    ).toBeInTheDocument();
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    const dialog = await within(document.body).findByRole("alertdialog");
    const title = within(dialog).getByText(/Content Studio/);
    // Figma 확정값: warning은 제목 색이 --text-error로 바뀜(notification은 --text-default)
    await expect(title.className).toContain("--text-error");
  },
};

export const WithCheckbox: Story = {
  name: "Notification with 'Do not ask again' checkbox",
  args: {
    checkbox: false,
    checkboxLabel: "Do not ask again.",
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    const dialog = await within(document.body).findByRole("alertdialog");
    const checkbox = within(dialog).getByRole("checkbox", {
      name: "Do not ask again.",
    });
    await expect(checkbox).toBeInTheDocument();

    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const ConfirmClosesDialog: Story = {
  name: "Confirm closes the dialog and fires onConfirm",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    const body = within(document.body);
    const confirmButton = await body.findByRole("button", {
      name: "Confirm",
    });
    await userEvent.click(confirmButton);

    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    await expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
  },
};

export const CancelClosesDialog: Story = {
  name: "Cancel closes the dialog and fires onCancel",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));

    const body = within(document.body);
    const cancelButton = await body.findByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);

    await expect(args.onCancel).toHaveBeenCalledTimes(1);
    await expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
  },
};
