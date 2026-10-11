import type { Meta, StoryObj } from "@storybook/nextjs";

import { Toggle, type ToggleItem, type ToggleProps } from "./toggle";
import { makeStatusSource } from "../../../.storybook/status-source";
import { CircleDashed } from "lucide-react";

import { ICON_IDS } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7214-444";

/** Figma `Part/Toggle`의 아이콘 슬롯 기본값과 같은 플레이스홀더. */
function PlaceholderIcon() {
  return <CircleDashed className="size-full" aria-hidden="true" />;
}

const ICON_ITEMS: ToggleItem[] = [
  {
    icon: <PlaceholderIcon />,
    "aria-label": "Growth Potential",
    label: "Growth Potential",
  },
  { icon: <PlaceholderIcon />, "aria-label": "Reach", label: "Reach" },
  {
    icon: <PlaceholderIcon />,
    "aria-label": "Engagement",
    label: "Engagement",
  },
  { icon: <PlaceholderIcon />, "aria-label": "Ranking", label: "Ranking" },
];

const TEXT_ITEMS: ToggleItem[] = [
  { text: "AM", pressed: true },
  { text: "PM" },
];

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ToggleStatus = "default" | "disabled";

const STATUS_PROPS: Record<ToggleStatus, { disabled?: boolean }> = {
  default: {},
  disabled: { disabled: true },
};

/** `ToggleProps`는 `orientation="grid"`에서 아이템 4개 튜플을 요구하는 판별
 * 유니온이다. Controls의 items는 항상 배열이라, 스토리는 배열 쪽 멤버로 좁힌다. */
type ToggleStoryBase = Extract<ToggleProps, { items: ToggleItem[] }>;

type StoryArgs = Omit<ToggleStoryBase, "disabled"> & { status: ToggleStatus };

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      source: {
        transform: makeStatusSource("Toggle", STATUS_PROPS, {
          omit: ["items", "trailingAction"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Toggle {...(args as ToggleStoryBase)} {...STATUS_PROPS[status]} />
  ),
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
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. 그룹 전체에 적용되며, disabled에서는 구분선이 사라진다",
    },
  },
  args: {
    items: ICON_ITEMS,
    type: "icon",
    orientation: "horizontal",
    status: "default",
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
