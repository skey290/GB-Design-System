import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { ActionTrigger } from "./ActionTrigger";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-92271";

const meta = {
  title: "ContentStudio/UI/ActionTrigger",
  component: ActionTrigger,
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
    title: { control: "text" },
    items: { control: "object" },
    footerCaption: { control: "text" },
    recommendationTitle: { control: "text" },
    recommendationHeadline: { control: "text" },
    recommendationDescription: { control: "text" },
    recommendationActionLabel: { control: "text" },
    emptyTitle: { control: "text" },
    emptyDescription: { control: "text" },
    emptyActionLabel: { control: "text" },
  },
  args: {
    type: "full",
  },
} satisfies Meta<typeof ActionTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Action Items")).toBeInTheDocument();
    expect(canvas.getByText("3 items")).toBeInTheDocument();
    expect(canvas.getByText("Empty Slot on Jul 2")).toBeInTheDocument();
    expect(canvas.getByText("Draft")).toBeInTheDocument();
    expect(canvas.getAllByText("Create a post").length).toBeGreaterThan(0);

    expect(canvas.getByText("Why don't you try this?")).toBeInTheDocument();
    expect(
      canvas.getByText("Turn expertise into authority"),
    ).toBeInTheDocument();
    expect(canvas.getByText("Try it out")).toBeInTheDocument();
  },
};
