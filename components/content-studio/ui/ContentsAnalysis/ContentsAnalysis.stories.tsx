import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";

import type { CalendarEventType } from "@/components/ui/calendar";

import { ContentsAnalysis } from "./ContentsAnalysis";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86563";

// Builds sample event markers against the current month so the embedded
// Calendar (which always shows the real current month) has visible dots
// regardless of when this story is viewed.
function buildSampleEvents(): Record<string, CalendarEventType> {
  const now = new Date();
  const toKey = (day: number) => {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return {
    [toKey(1)]: "published",
    [toKey(6)]: "reserved",
    [toKey(9)]: "published",
    [toKey(13)]: "draft",
    [toKey(17)]: "reserved",
    [toKey(22)]: "published",
  };
}

const meta = {
  title: "ContentStudio/UI/ContentsAnalysis",
  component: ContentsAnalysis,
  tags: ["autodocs"],
  parameters: {
    // Verbatim text from the Figma component's description field
    docs: {
      description: {
        component:
          "Content Studio's analysis dashboard card showing this month's post count, weekly goal progress, and a mini calendar.",
      },
    },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["expanded", "empty"],
    },
    postsThisMonth: { control: "number" },
    postsDelta: { control: "text" },
    emptyTitle: { control: "text" },
    emptyDescription: { control: "text" },
    goals: { control: "object" },
    calendarEvents: { control: "object" },
  },
  args: {
    variant: "expanded",
    postsThisMonth: 15,
    postsDelta: "+5",
    calendarEvents: buildSampleEvents(),
  },
} satisfies Meta<typeof ContentsAnalysis>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Posts This Month")).toBeInTheDocument();
    expect(canvas.getByText("15")).toBeInTheDocument();
    expect(canvas.getByText("Weekly Goal Progress")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText("Published")).toBeInTheDocument();
  },
};
