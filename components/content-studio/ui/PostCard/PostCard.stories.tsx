import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import type {
  Post,
  PostPlatform,
} from "@/components/review/content-studio/data";

import { PostCard, type PostCardProps } from "./PostCard";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-87737";

const SAMPLE_POSTS: Record<PostPlatform, Post> = {
  linkedin: {
    id: "post-linkedin",
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
  },
  x: {
    id: "post-x",
    status: "draft",
    contentType: "text",
    images: [],
    caption:
      "I used to think a good forecast just needed the right formula. Turns out the harder part is getting a data model and a finance team to trust the same number.",
    hashtags: ["#RevenueForecasting", "#DataScience", "#SaaS"],
    platforms: ["x"],
    date: "09.01.2026",
    time: "10:00 PM",
  },
  instagram: {
    id: "post-instagram",
    status: "draft",
    contentType: "image",
    images: ["/images/personas/entrepreneur.jpg"],
    caption:
      "Hi, I'm Cloe. Three years into data science at a SaaS startup, and lately spending my evenings on the finance side of the same problem.",
    hashtags: ["#DataScience", "#RevenueForecasting", "#SaaS"],
    platforms: ["instagram"],
    date: "09.01.2026",
    time: "10:00 PM",
  },
  threads: {
    id: "post-threads",
    status: "draft",
    contentType: "text",
    images: [],
    title: "Today's Data Insight",
    caption:
      "I used to think a good forecast just needed the right formula. Turns out the harder part is getting a data model and a finance team to trust the same number.",
    hashtags: [],
    platforms: ["threads"],
    date: "09.01.2026",
    time: "10:00 PM",
  },
};

/** `isHighlighted` and `post.status` are plain display props (no onChange) — the story holds its own state so clicking the card toggles the focus ring (Figma's `Status=active`) and clicking "Schedule Draft" moves the sample post to `scheduled`, matching `app/review/content-studio/page.tsx`'s `handleScheduleDraft` and swapping the footer button from "Schedule Draft" to "Edit Post". */
function SelectablePostCard({
  post,
  isHighlighted,
  onScheduleDraft,
  ...props
}: PostCardProps) {
  const [highlighted, setHighlighted] = React.useState(isHighlighted ?? false);
  const [localPost, setLocalPost] = React.useState(post);

  return (
    <div onClick={() => setHighlighted((prev) => !prev)}>
      <PostCard
        {...props}
        post={localPost}
        isHighlighted={highlighted}
        onScheduleDraft={() => {
          setLocalPost((prev) => ({ ...prev, status: "scheduled" }));
          onScheduleDraft();
        }}
      />
    </div>
  );
}

interface StoryArgs extends PostCardProps {
  /** Story-only control for swapping which sample `Post` is shown. `PostCard` does have an optional `platform` prop (used by `PostingModal` to preview one post across multiple platform tabs), but this control is not forwarded to it — it only swaps the sample `Post` object, so the layout changes via `post.platforms[0]` instead. */
  platform: PostPlatform;
}

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
    docs: {
      description: {
        story:
          "`platform` is a story-only control that swaps which sample `Post` is passed in. In real usage, the layout is normally decided by `post.platforms[0]`; `PostCard` also accepts an optional `platform` prop to override that (used by `PostingModal` to preview one post across multiple tabs). The canvas also wraps the card in a demo-only local-state click handler so clicking it toggles `isHighlighted` — the code below reflects a representative real usage.",
      },
      source: {
        code: `<PostCard
  post={post} // layout is picked from post.platforms[0]
  onOpenEdit={handleOpenEdit}
  onScheduleDraft={handleScheduleDraft}
  onArchive={handleArchive}
/>`,
      },
    },
  },
  argTypes: {
    post: { control: false },
    platform: {
      control: "select",
      options: ["linkedin", "x", "instagram", "threads"],
    },
    isHighlighted: { control: "boolean" },
    showButtons: { control: "boolean" },
    avatarSrc: { control: "text" },
  },
  args: {
    post: SAMPLE_POSTS.linkedin,
    platform: "linkedin",
    isHighlighted: false,
    showButtons: true,
    onOpenEdit: fn(),
    onScheduleDraft: fn(),
    onArchive: fn(),
  },
  render: ({ platform, ...args }) => (
    <SelectablePostCard
      key={platform}
      {...args}
      post={SAMPLE_POSTS[platform]}
    />
  ),
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

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
  },
};
