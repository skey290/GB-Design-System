import type { Meta, StoryObj } from "@storybook/nextjs";

import { Toggle, type ToggleItem, type ToggleProps } from "./toggle";
import { makeStatusSource } from "../../../.storybook/status-source";
import { CircleDashed } from "lucide-react";

import { ICON_IDS } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7214-444";

/** Placeholder matching the Figma `Part/Toggle` icon slot's default. */
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

/** A list mapped 1:1 to the values of the Figma `Status` axis. */
type ToggleStatus = "default" | "disabled";

const STATUS_PROPS: Record<ToggleStatus, { disabled?: boolean }> = {
  default: {},
  disabled: { disabled: true },
};

/** `ToggleProps` is a discriminated union that requires a 4-item tuple for
 * `orientation="grid"`. Controls' items is always an array, so the story narrows to the array member. */
type ToggleStoryBase = Extract<ToggleProps, { items: ToggleItem[] }>;

type StoryArgs = Omit<ToggleStoryBase, "disabled"> & { status: ToggleStatus };

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the redundant control
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: { component: "가로/세로/그리드로 배치되는 세그먼트 버튼 그룹으로, 각 버튼은 독립적으로 켜고 끌 수 있다. Type이 각 버튼에 표시되는 내용을 정한다 — 아이콘, 라벨, 또는 둘 다. 단일 on/off 슬라이더인 Switch와는 구분된다. hover, press, selected는 모두 같은 active 모습을 공유한다." },
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
        "icon is a bordered box with dividers, text is a pill (segment) floating on a track background",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical", "grid"],
      description: "For the text type, only horizontal is defined in Figma",
    },
    items: {
      control: "radio",
      options: ["아이콘 4개", "텍스트 2개 (AM/PM)"],
      mapping: { "아이콘 4개": ICON_ITEMS, "텍스트 2개 (AM/PM)": TEXT_ITEMS },
      description: "Pick the items that match the type",
    },
    trailingAction: {
      control: "select",
      options: [undefined, ...ICON_IDS.slice(0, 12)],
      mapping: Object.fromEntries(
        ICON_IDS.slice(0, 12).map((id) => [id, { icon: id, "aria-label": id }]),
      ),
      description:
        'type="text" + horizontal only — an icon button detached to the right of the pill',
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Applies to the whole group; dividers disappear when disabled",
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
