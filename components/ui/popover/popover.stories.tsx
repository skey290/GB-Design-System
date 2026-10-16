import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Popover, type PopoverProps } from "./popover";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7269-451";

// Figma에 트리거가 없는 완전 제어형 컴포넌트라, 열기용 버튼 + 로컬 state를 얹은
// 데모 래퍼로 감싸 Controls에서 바로 열어볼 수 있게 한다.
function PopoverDemo({ open: openProp, onOpenChange, ...rest }: PopoverProps) {
  const [open, setOpen] = React.useState(openProp);

  React.useEffect(() => setOpen(openProp), [openProp]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
  };

  // `checkbox`는 제어 prop이라 데모에서도 state를 쥐어 줘야 실제로 토글된다.
  const checkboxProp = rest.type === "notification" ? rest.checkbox : undefined;
  const [checked, setChecked] = React.useState(checkboxProp);

  React.useEffect(() => setChecked(checkboxProp), [checkboxProp]);

  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      {rest.type === "notification" ? (
        <Popover
          {...rest}
          open={open}
          onOpenChange={handleOpenChange}
          checkbox={checked}
          onCheckedChange={(next) => {
            setChecked(next);
            rest.onCheckedChange?.(next);
          }}
        />
      ) : (
        <Popover {...rest} open={open} onOpenChange={handleOpenChange} />
      )}
    </div>
  );
}

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    // Figma 컴포넌트 description 필드 원문
    docs: { description: { component: "알림이나 경고로 사용자를 멈추게 하고 응답을 기다리는 중앙 정렬 모달 패널. Type이 둘 중 어느 쪽인지를 정한다. 자체 트리거가 없고 어디에도 고정(anchor)되지 않으며, 언제 열릴지는 부모가 결정한다. 트리거에 붙는 짧은 힌트에는 Tooltip을 사용한다." } },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["notification", "warning"],
    },
    title: { control: "text" },
    description: { control: "text" },
    checkboxLabel: { control: "text" },
    showButtons: { control: "boolean" },
    cancelLabel: { control: "text" },
    confirmLabel: { control: "text" },
  },
  args: {
    type: "notification",
    title: "Heading to 'Content Studio' to create your post?",
    description:
      "Exit this page and start creating a post in 'Content Studio'.",
    checkbox: false,
    checkboxLabel: "Do not ask again.",
    showButtons: true,
    open: true,
    onOpenChange: fn(),
    onCancel: fn(),
    onConfirm: fn(),
    onCheckedChange: fn(),
  },
  render: (args) => <PopoverDemo {...args} />,
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
