import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect, fn } from "storybook/test";

import { CompassMetricCard } from "./compass-metric-card";

const FIGMA_URL =
  "https://www.figma.com/design/C34HOpbSASmThFA1iYFm8D/%E2%9D%84%EF%B8%8F-GB_Compass?node-id=8003-12444";

const meta = {
  title: "Compass/UI/CompassMetricCard",
  component: CompassMetricCard,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    state: {
      control: "radio",
      options: ["default", "warning", "error"],
    },
    title: { control: "text" },
    badgeLabel: { control: "text" },
    description: { control: "text" },
  },
  args: {
    title: "Growth Potential",
    badgeLabel: "Become Recommended",
    description:
      "It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience.",
    state: "default",
    children: <p className="text-5xl-black text-[var(--text-default)]">80%</p>,
    onFooterLinkClick: fn(),
  },
  decorators: [
    // The Compass product is always used on a dark surface (every Figma screenshot
    // has a dark background) — wrapped in a `.dark` scope like the other compass-* stories.
    (Story) => (
      <div className="dark w-[604px] bg-[var(--background-default)] p-[var(--spacing-8)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompassMetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Growth Potential")).toBeInTheDocument();
    await expect(canvas.getByText("80%")).toBeInTheDocument();
  },
};
