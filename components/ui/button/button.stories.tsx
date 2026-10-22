import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button, type ButtonProps } from "./button";
import { makeStatusSource } from "../../../.storybook/status-source";
import { ICON_IDS, Icon, type IconId } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681";

/** A list matched 1:1 with the values of the Figma `Status` axis. */
type ButtonStatus = "default" | "disabled" | "active";

const ICON_ONLY_VARIANTS = ["icon", "icon-ghost", "icon-rounded"] as const;

const STATUS_PROPS: Record<
  ButtonStatus,
  { className?: string; disabled?: boolean }
> = {
  default: {},
  active: { className: "pseudo-hover pseudo-hover-all" },
  disabled: { disabled: true },
};

interface StoryArgs {
  variant: ButtonProps["variant"];
  children?: string;
  icon?: IconId;
  "aria-label"?: string;
  status: ButtonStatus;
}

const meta = {
  title: "UI/Button",
  // `Button`'s props are a discriminated union keyed off `variant`; the flat
  // `StoryArgs` shape below can't satisfy that directly, so this cast hands
  // the actual prop construction to `render`, which resolves the union per
  // variant before handing props to `Button`.
  component: Button as unknown as ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate control since `status` drives it instead
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A clickable button used to trigger an action such as submit, navigate, or confirm. Type chooses the shape of the content — default renders a label, icon renders a single icon with no label, and google renders the branded sign-in button — and Style sets the colour role. Not for representing a persistent on/off state — use Switch or Toggle instead.",
      },
      source: {
        transform: makeStatusSource("Button", STATUS_PROPS, {
          cssOnly: ["active"],
          childrenKey: "children",
        }),
      },
    },
  },
  render: ({ status, icon, children, "aria-label": ariaLabel, ...args }) => {
    const variant = args.variant ?? "primary";
    const isIconOnly = (ICON_ONLY_VARIANTS as readonly string[]).includes(
      variant,
    );
    const takesIcon = isIconOnly || !["ghost", "google"].includes(variant);
    const resolvedIcon = takesIcon && icon ? <Icon id={icon} /> : undefined;

    // `ButtonProps` is a discriminated union keyed off `variant` — construct
    // the per-variant shape dynamically from the flat Controls args, then
    // hand the result to `Button` as one cast (see the `component` cast above).
    const resolvedProps = {
      ...args,
      ...STATUS_PROPS[status],
      variant,
      icon: resolvedIcon,
      ...(isIconOnly
        ? { "aria-label": ariaLabel ?? "Icon", children: undefined }
        : { children }),
    } as ButtonProps;

    return <Button key={status} {...resolvedProps} />;
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "mute",
        "outline",
        "link",
        "ghost",
        "icon",
        "icon-ghost",
        "icon-rounded",
        "google",
      ],
    },
    icon: {
      control: "select",
      options: ICON_IDS,
      description:
        "The whole button icon for icon/icon-ghost/icon-rounded; a trailing icon after the label for the other variants (google excluded). 12px on link, 16px elsewhere.",
    },
    "aria-label": {
      control: "text",
      description: "Used by icon/icon-ghost/icon-rounded only (required).",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the hover/press CSS state — hover the canvas directly to see it",
    },
    children: {
      control: "text",
      description:
        'Not rendered by the icon-only variants. Leaving it empty on google fills in "Continue with Google".',
    },
  },
  args: {
    variant: "primary",
    children: "Button",
    status: "default",
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
