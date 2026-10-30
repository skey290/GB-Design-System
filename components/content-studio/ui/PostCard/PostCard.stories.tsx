import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import type { Post } from "@/components/review/content-studio/data";

import { PostCard } from "./PostCard";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-87737";

const SAMPLE_POST: Post = {
  id: "post-1",
  status: "draft",
  contentType: "image",
  images: [
    "/images/personas/team-leader.jpg",
    "/images/personas/entrepreneur.jpg",
    "/images/personas/fashion-editor.jpg",
  ],
  caption:
    "Hi, I'm Cloe. Three years into data science at a SaaS startup, and lately spending my evenings on the finance side of the same problem — building revenue models that hold up under a CFO's scrutiny, not just a data team's.",
  hashtags: ["#DataScience", "#RevenueForecasting", "#SaaS"],
  platforms: ["linkedin"],
  date: "09.01.2026",
  time: "10:00 PM",
};

const meta = {
  title: "ContentStudio/UI/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    layout: "centered",
  },
  argTypes: {
    post: { control: false },
    isHighlighted: { control: "boolean" },
    avatarSrc: { control: "text" },
  },
  args: {
    post: SAMPLE_POST,
    isHighlighted: false,
    onOpenEdit: fn(),
    onScheduleDraft: fn(),
    onArchive: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Schedule Draft" }),
    );
    expect(args.onScheduleDraft).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Move to Archive" }),
    );
    expect(args.onArchive).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Open post" }));
    expect(args.onOpenEdit).toHaveBeenCalledTimes(1);
  },
};
