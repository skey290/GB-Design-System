import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  Toggle,
  type ToggleItem,
  type ToggleProps,
  type ToggleTrailingAction,
  type ToggleType,
} from "./toggle";
import { makeStatusSource } from "../../../.storybook/status-source";
import { CircleDashed } from "lucide-react";

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
 * `orientation="grid"`. Presets' items is always a plain array, so the story narrows to the array member. */
type ToggleStoryBase = Extract<ToggleProps, { items: ToggleItem[] }>;

interface VariantPreset {
  type: ToggleType;
  orientation: "horizontal" | "vertical" | "grid";
  items: ToggleItem[];
  trailingAction?: ToggleTrailingAction;
}

/**
 * Each entry is a full `type`/`orientation`/`items`/`trailingAction` combination that
 * actually exists in Figma's `Type` × `Style` × `Number` matrix (see docs/components/toggle.md).
 * Picking one sets all of them together, so no Figma-undefined crossover (e.g.
 * `type="icon"` with text items) can be assembled through Controls.
 */
const VARIANT_PRESETS: Record<string, VariantPreset> = {
  "Icon · Horizontal (1–5)": {
    type: "icon",
    orientation: "horizontal",
    items: ICON_ITEMS,
  },
  "Icon · Grid (4)": {
    type: "icon",
    orientation: "grid",
    items: ICON_ITEMS,
  },
  "Icon · Vertical + Label (3–4)": {
    type: "icon",
    orientation: "vertical",
    items: ICON_ITEMS,
  },
  "Text · Horizontal (AM/PM)": {
    type: "text",
    orientation: "horizontal",
    items: TEXT_ITEMS,
  },
  "Text · Horizontal + Trailing action": {
    type: "text",
    orientation: "horizontal",
    items: TEXT_ITEMS,
    trailingAction: { icon: "calendar-icon", "aria-label": "Pick a date" },
  },
};

type VariantName = keyof typeof VARIANT_PRESETS;

interface StoryArgs {
  variant: VariantName;
  status: ToggleStatus;
}

/**
 * Toggle is fully controlled (no internal selection state), so the Playground owns a
 * `selectedIndex` itself — otherwise clicking an item would call `onPressedChange` with
 * nothing listening, and the click would visibly do nothing.
 */
function ControlledToggle({ variant, status }: StoryArgs) {
  const preset = VARIANT_PRESETS[variant];
  const [selectedIndex, setSelectedIndex] = React.useState(() =>
    preset.items.findIndex((item) => item.pressed ?? false),
  );

  React.useEffect(() => {
    setSelectedIndex(preset.items.findIndex((item) => item.pressed ?? false));
  }, [preset]);

  const items = preset.items.map((item, index) => ({
    ...item,
    pressed: index === selectedIndex,
    onPressedChange: () => setSelectedIndex(index),
  }));

  return (
    <Toggle
      {...(preset as ToggleStoryBase)}
      items={items}
      {...STATUS_PROPS[status]}
    />
  );
}

const meta = {
  title: "UI/Toggle",
  component: ControlledToggle,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A segmented group of buttons, laid out horizontally, vertically, or as a grid, where each button can be pressed on or off independently. Type sets what each button shows — an icon, a label, or both. Distinct from Switch, which is a single on/off slider. Hover, press, and selected all share the same active appearance.",
      },
      source: {
        transform: (
          code: string,
          context: { args?: Record<string, unknown> },
        ) => {
          const rawArgs = context.args ?? {};
          const preset =
            VARIANT_PRESETS[String(rawArgs.variant)] ??
            VARIANT_PRESETS["Icon · Horizontal (1–5)"];
          const resolvedArgs: Record<string, unknown> = {
            ...rawArgs,
            ...preset,
          };
          delete resolvedArgs.variant;
          return makeStatusSource("Toggle", STATUS_PROPS, {
            omit: ["items", "trailingAction"],
          })(code, { ...context, args: resolvedArgs });
        },
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(VARIANT_PRESETS),
      description:
        "Figma Type × Style × Number combination — picking one sets type/items/orientation/trailingAction together so only real Figma variants are selectable",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Applies to the whole group; dividers disappear when disabled",
    },
  },
  args: {
    variant: "Icon · Horizontal (1–5)",
    status: "default",
  },
} satisfies Meta<typeof ControlledToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
