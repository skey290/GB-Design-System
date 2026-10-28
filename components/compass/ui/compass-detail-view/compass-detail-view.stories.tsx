import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect, fn } from "storybook/test";

import { CompassDetailView } from "./compass-detail-view";

const FIGMA_URL =
  "https://www.figma.com/design/C34HOpbSASmThFA1iYFm8D/%E2%9D%84%EF%B8%8F-GB_Compass?node-id=8003-12444";

const meta = {
  title: "Compass/UI/CompassDetailView",
  component: CompassDetailView,
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
      options: [
        "default",
        "bls",
        "niche-data",
        "no-experience",
        "trend-data",
        "error",
      ],
    },
  },
  args: {
    type: "default",
    onCreatePostsClick: fn(),
    onRetry: fn(),
    onGrowthFooterClick: fn(),
    onReachFooterClick: fn(),
    onEngagementFooterClick: fn(),
  },
  decorators: [
    // The Compass product is always used on a dark surface (every Figma screenshot
    // has a dark background) — wrapped in a `.dark` scope like the other stories.
    (Story) => (
      <div className="dark bg-[var(--background-default)] p-[var(--spacing-8)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompassDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Data Scientist")).toBeInTheDocument();
  },
};
