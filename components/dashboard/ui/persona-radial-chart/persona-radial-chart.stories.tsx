import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { PersonaRadialChart } from "./persona-radial-chart";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8133-122594";

const meta = {
  title: "Dashboard/UI/PersonaRadialChart",
  component: PersonaRadialChart,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    // No forced `.dark` — the component follows the app theme, so the value bands
    // invert with the Storybook toolbar's light/dark toggle. The badges overflow the
    // 500×500 frame, so only padding is added.
    (Story) => (
      <div className="bg-background p-[var(--spacing-24)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    selfCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
      description:
        "How many Selves to show. The remaining cells become empty 'No Self' slots.",
    },
    valueFractionDigits: {
      control: { type: "range", min: 0, max: 3, step: 1 },
      description:
        "Maximum decimal places for the badge value. Whole numbers get no decimal point",
    },
    isDataCollected: {
      control: "boolean",
    },
    hover: {
      control: "radio",
      options: ["default", "growth", "reach", "engagement", "self"],
    },
  },
  args: {
    selfCount: 8,
    isDataCollected: true,
    onCenterClick: fn(),
  },
} satisfies Meta<typeof PersonaRadialChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
