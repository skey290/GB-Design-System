import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect } from "storybook/test";

import { CompassDialTick } from "./compass-dial-tick";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8125-22862";

const meta = {
  title: "Compass/UI/CompassDialTick",
  component: CompassDialTick,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    // The dial is always drawn on a dark surface (every Figma screenshot has a
    // black background), so a `.dark` scope is forced. This does not make the
    // component dark-only — only the Storybook decorator darkens the background.
    (Story) => (
      <div className="dark bg-[var(--background-default)] p-[var(--spacing-24)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: "radio",
      options: ["default", "text", "circle"],
    },
    direction: {
      control: "radio",
      options: ["outward", "inward"],
    },
    muted: {
      control: "boolean",
    },
    textArrangement: {
      control: "radio",
      options: ["cross", "parallel", "parallel-reverse", "cross-reverse"],
    },
    size: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    label: {
      control: "text",
    },
  },
  args: {
    type: "text",
    direction: "outward",
    muted: false,
    textArrangement: "cross",
    size: 5,
    label: "6/1",
  },
} satisfies Meta<typeof CompassDialTick>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("6/1")).toBeInTheDocument();
  },
};
