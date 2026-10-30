import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { CircleCheck, CircleX } from "lucide-react";

import { Chips, type ChipsProps } from "./chips";
import { makeStatusSource } from "../../../.storybook/status-source";
import styles from "./chips.module.css";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3021-1615";

/** List matched 1:1 with the Figma `Status` axis values. */
type ChipsStatus = "default" | "active" | "disabled";

const STATUS_PROPS: Record<ChipsStatus, Partial<ChipsProps>> = {
  default: {},
  active: { selected: true },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ChipsProps, "selected" | "disabled"> & {
  status: ChipsStatus;
  /** Story-only: prepends a status icon as a child, matching the ProfileCard
   * checklist's live usage, to show that it follows the label's color on
   * hover/selected rather than staying its own fixed color. */
  showStatusIcon: boolean;
};

/** `selected` is a controlled prop, so the story must hold its own state for clicks to take effect. */
function ControlledChips({
  selected,
  onClick,
  variant,
  showStatusIcon,
  children,
  ...props
}: ChipsProps & { showStatusIcon?: boolean }) {
  const [isSelected, setIsSelected] = React.useState(selected ?? false);
  const StatusIcon = variant === "alarm" ? CircleX : CircleCheck;

  return (
    <Chips
      {...props}
      variant={variant}
      selected={isSelected}
      onClick={(event) => {
        setIsSelected((prev) => !prev);
        onClick?.(event);
      }}
    >
      {showStatusIcon && (
        <StatusIcon aria-hidden="true" className={styles.statusIcon} />
      )}
      {children}
    </Chips>
  );
}

const meta = {
  title: "UI/Chips",
  component: Chips,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the duplicate controls
    controls: { exclude: ["disabled", "selected"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A clickable, selectable pill for filter or tag selection, where the user toggles one or more options on or off. Delete icon adds an X badge for removing the chip; it is hidden when the chip is disabled, since a disabled chip cannot be acted on. Distinct from Badge, which is a passive, non-interactive label.",
        story:
          "Canvas uses a demo-only local-state wrapper so clicking toggles `selected` in isolation. The code below reflects the current Controls values as real props — see docs/components/chips.md.",
      },
      source: {
        transform: makeStatusSource("Chips", STATUS_PROPS, {
          childrenKey: "children",
          omit: ["showStatusIcon"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ControlledChips key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the pressed (selected) state, and the `disabled` coloring is a single look regardless of Type",
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost", "success", "alarm"],
      description: "Figma `Type` axis",
    },
    showDeleteIcon: { control: "boolean" },
    showStatusIcon: {
      control: "boolean",
      description:
        "Story-only: prepends a status icon as a child, matching ProfileCard's checklist usage — toggle this with `status` to confirm the icon's color follows the label on hover/selected instead of staying fixed.",
    },
    children: { control: "text" },
  },
  args: {
    status: "default",
    children: "Chip",
    variant: "primary",
    showStatusIcon: false,
    showDeleteIcon: false,
    onDelete: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
