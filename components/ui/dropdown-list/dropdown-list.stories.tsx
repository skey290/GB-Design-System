import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { DropdownList, type DropdownListOption } from "./dropdown-list";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8160-31364";

const OPTIONS: DropdownListOption[] = [
  { value: "strategist", label: "Strategist" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "storyteller", label: "Storyteller" },
  { value: "analyst", label: "Analyst", disabled: true },
  { value: "creator", label: "Creator" },
  { value: "curator", label: "Curator" },
  { value: "educator", label: "Educator" },
  { value: "researcher", label: "Researcher" },
];

function DropdownListPreview(
  props: Omit<
    React.ComponentProps<typeof DropdownList>,
    "highlightedIndex" | "onHighlightChange" | "onCommit" | "value"
  >,
) {
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <div className="w-[210px] overflow-hidden rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid bg-[var(--gb-background-surface)] text-[var(--gb-text-default)] shadow-[var(--gb-shadow-md)]">
      <DropdownList
        {...props}
        value={value}
        highlightedIndex={highlightedIndex}
        onHighlightChange={setHighlightedIndex}
        onCommit={(option) => {
          if (option.disabled) return;
          setValue(option.value);
        }}
      />
    </div>
  );
}

const meta = {
  title: "UI/DropdownList",
  component: DropdownListPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      description: {
        component:
          "Select 트리거 아래 드롭다운 패널에 들어가는 옵션 리스트. Select가 이 컴포넌트를 import해서 조합한다(Chatbox/ChatboxComposer와 동일한 관계).",
      },
    },
  },
  render: (args) => <DropdownListPreview {...args} />,
  argTypes: {
    options: { control: false },
    listboxId: { control: false },
    getOptionId: { control: false },
  },
} satisfies Meta<typeof DropdownListPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    options: OPTIONS,
    listboxId: "dropdown-list-playground",
    getOptionId: (value: string) => `dropdown-list-playground-option-${value}`,
  },
};
