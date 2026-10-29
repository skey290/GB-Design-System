import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { ReachEngagement } from "./ReachEngagement";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86245";

const meta = {
  title: "ContentStudio/UI/ReachEngagement",
  component: ReachEngagement,
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
      options: ["reach", "funnel", "empty"],
    },
    period: { control: "text" },
    reachTotal: { control: "text" },
    reachDelta: { control: "text" },
    engagementRate: { control: "text" },
    newFollowers: { control: "text" },
    funnelAnalysisLabel: { control: "text" },
    topChannel: { control: "object" },
    accountOptions: { control: "object" },
    columns: { control: "object" },
  },
  args: {
    type: "reach",
    period: "Last 28 days",
    onFunnelAnalysisClick: fn(),
    onAccountChange: fn(),
  },
} satisfies Meta<typeof ReachEngagement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("18,240")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Funnel Analysis" }),
    );
    expect(args.onFunnelAnalysisClick).toHaveBeenCalledTimes(1);
  },
};
