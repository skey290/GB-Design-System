import type { Meta, StoryObj } from "@storybook/nextjs";

import { Toggle, type ToggleItem } from "./toggle";
import { ICON_IDS } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7214-444";

/** Figma `Part/Toggle` 내부 아이콘 자리를 대체하는 북마크 모양 placeholder SVG */
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2a1 1 0 0 0-1 1v11l5-3 5 3V3a1 1 0 0 0-1-1H4Z" />
    </svg>
  );
}

const ICON_ITEMS: ToggleItem[] = [
  {
    icon: <BookmarkIcon />,
    "aria-label": "북마크 1",
    label: "Growth Potential",
  },
  { icon: <BookmarkIcon />, "aria-label": "북마크 2", label: "Reach" },
  { icon: <BookmarkIcon />, "aria-label": "북마크 3", label: "Engagement" },
  { icon: <BookmarkIcon />, "aria-label": "북마크 4", label: "Ranking" },
];

const TEXT_ITEMS: ToggleItem[] = [
  { text: "AM", pressed: true },
  { text: "PM" },
];

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["icon", "text"],
      description:
        "icon은 보더 박스 + 구분선, text는 트랙 배경 위 알약(세그먼트) 형태",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical", "grid"],
      description: "text 타입에서는 horizontal만 Figma에 정의되어 있습니다",
    },
    items: {
      control: "radio",
      options: ["아이콘 4개", "텍스트 2개 (AM/PM)"],
      mapping: { "아이콘 4개": ICON_ITEMS, "텍스트 2개 (AM/PM)": TEXT_ITEMS },
      description: "type에 맞는 아이템을 고르세요",
    },
    trailingAction: {
      control: "select",
      options: [undefined, ...ICON_IDS.slice(0, 12)],
      mapping: Object.fromEntries(
        ICON_IDS.slice(0, 12).map((id) => [id, { icon: id, "aria-label": id }]),
      ),
      description:
        'type="text" + horizontal 전용 — 알약 오른쪽에 떨어져 붙는 아이콘 버튼',
    },
    disabled: { control: "boolean" },
  },
  args: {
    items: ICON_ITEMS,
    type: "icon",
    orientation: "horizontal",
    disabled: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
