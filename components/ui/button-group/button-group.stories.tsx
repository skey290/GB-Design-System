import type { Meta, StoryObj } from "@storybook/nextjs";

import { ButtonGroup, type ButtonGroupProps } from "./button-group";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3466-29935";

/** A list matched 1:1 with the values of the Figma `Status` axis. */
type ButtonGroupStatus = "default" | "disabled";

const STATUS_PROPS: Record<ButtonGroupStatus, Partial<ButtonGroupProps>> = {
  default: {},
  disabled: { disabled: true },
};

type StoryArgs = Omit<ButtonGroupProps, "disabled"> & {
  status: ButtonGroupStatus;
};

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate control since `status` drives it instead
    controls: { exclude: ["disabled"] },
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A row of related buttons presented as one unit — either a secondary/primary action pair that closes a step or dialog, or a segmented set where one item is active at a time. Use Button on its own when there is only one action, and Toggle when each item toggles independently.",
      },
      source: {
        transform: makeStatusSource("ButtonGroup", STATUS_PROPS, {
          omit: ["items"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ButtonGroup {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    type: {
      control: "select",
      options: [
        "skippable",
        "back-or-forth",
        "save",
        "confirm",
        "error",
        "menu",
      ],
      description:
        "Which arrangement — only `menu` is the floating navigation pill",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Applied to every button in the group at once",
    },
    shouldFitContainer: {
      control: "boolean",
      description:
        "Fill the parent width instead of the fixed 344px (not applied to menu)",
    },
    secondaryLabel: {
      control: "text",
      description:
        "Left outline button label (falls back to the per-type default when empty)",
    },
    primaryLabel: {
      control: "text",
      description:
        "Right primary button label (falls back to the per-type default when empty)",
    },
    activeId: {
      control: "select",
      options: [undefined, "home", "assets", "compass", "contents-studio"],
      description: "Id of the active item in `menu`",
    },
    items: { control: false },
    onSecondaryClick: { control: false },
    onPrimaryClick: { control: false },
    onActiveChange: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: "skippable",
    status: "default",
    shouldFitContainer: false,
    activeId: "compass",
  },
};
