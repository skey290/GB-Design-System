import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { PostSignal } from "./PostSignal";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86739";

const meta = {
  title: "ContentStudio/UI/PostSignal",
  component: PostSignal,
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
      options: ["full", "empty"],
    },
    perceptionLabel: { control: "text" },
    perceptionPercent: { control: "number" },
    traits: { control: "object" },
    perceivedTraits: { control: "object" },
    reactions: { control: "object" },
    perceptionEmptyTitle: { control: "text" },
    perceptionEmptyDescription: { control: "text" },
    feedbackEmptyTitle: { control: "text" },
    feedbackEmptyDescription: { control: "text" },
  },
  args: {
    type: "full",
  },
} satisfies Meta<typeof PostSignal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("How people see you")).toBeInTheDocument();
    expect(canvas.getByText("Perception Alignment")).toBeInTheDocument();
    expect(canvas.getByText("75%")).toBeInTheDocument();
    expect(canvas.getByText("Expert & authoritative")).toBeInTheDocument();
    expect(canvas.getByText("Matched")).toBeInTheDocument();

    expect(canvas.getByText("What people say")).toBeInTheDocument();
    expect(canvas.getByText("#Relatable")).toBeInTheDocument();
    expect(canvas.getByText("43 comments")).toBeInTheDocument();
  },
};
