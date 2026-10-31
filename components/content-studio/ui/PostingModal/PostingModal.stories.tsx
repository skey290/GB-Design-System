import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";
import { useDarkMode } from "storybook-dark-mode";

import type { TimePeriod } from "@/components/ui/input-time";
import {
  formatPostDate,
  type Post,
  type PostPlatform,
} from "@/components/content-studio/ui/PostCard";

import { IMAGE_STYLE_OPTIONS } from "./ImageStyleCard";
import {
  PostingModal,
  type PostingModalDefaultProps,
  type PostingModalEmptyProps,
  type PostingModalProps,
} from "./PostingModal";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-91305";

const SAMPLE_POST: Post = {
  id: "post-1",
  status: "draft",
  contentType: "image",
  images: [
    "/images/personas/team-leader.jpg",
    "/images/personas/entrepreneur.jpg",
  ],
  caption:
    "Hi, I'm Cloe. Three years into data science at a SaaS startup, and lately spending my evenings on the finance side of the same problem — building revenue models that hold up under a CFO's scrutiny, not just a data team's.",
  hashtags: ["#DataScience", "#RevenueForecasting", "#SaaS"],
  // Left short of all 4 platforms on purpose — a full list would hide the
  // "+" add-platform dropdown entirely (nothing left to offer), leaving no
  // way to demo it in the canvas below.
  platforms: ["linkedin", "x"],
  date: "09.01.2026",
  time: "10:00 PM",
};

const EMPTY_ARGS: PostingModalProps = {
  style: "empty",
  platforms: ["linkedin"],
  postCount: 9,
  postTypeIndex: 0,
  // Figma's own `Style=empty` mockup shows this already filled, but nothing
  // has been generated yet at this point in the flow — the real Chatbox
  // `Status` here is `default` (placeholder), not `filled`.
  instruction: "",
  defaultSelectedImageStyleId: IMAGE_STYLE_OPTIONS[0]!.id,
  onAddPlatform: fn(),
  onRemovePlatform: fn(),
  onPostCountChange: fn(),
  onPostTypeChange: fn(),
  onInstructionChange: fn(),
  onAutoGenerate: fn(),
  onImageStyleChange: fn(),
  onReferenceImagesChange: fn(),
  onClose: fn(),
};

const DEFAULT_ARGS: PostingModalProps = {
  style: "default",
  post: SAMPLE_POST,
  activeTabIndex: 0,
  defaultSelectedImageStyleId: IMAGE_STYLE_OPTIONS[0]!.id,
  // Unlike the generation Chatbox above, this rewrite box sits on a post
  // that's already been generated — Figma draws its `Status` as `filled`,
  // not the empty placeholder.
  rewriteInstruction:
    "Make the tone more confident and cut the second sentence — it repeats the hook.",
  onAddPlatform: fn(),
  onRemovePlatform: fn(),
  onActiveTabIndexChange: fn(),
  onDateChange: fn(),
  onTimeChange: fn(),
  onTimePeriodChange: fn(),
  onRewriteInstructionChange: fn(),
  onApplyChanges: fn(),
  onSaveChanges: fn(),
  onScheduleDraft: fn(),
  onArchive: fn(),
  onImageStyleChange: fn(),
  onReferenceImagesChange: fn(),
  onClose: fn(),
};

/** Story-only: switches Controls between Figma's `Style=empty`/`Style=default` sample props. */
interface PlaygroundProps {
  preset: "empty" | "default";
  showCloseButton: boolean;
}

/** Story-only: PostingModal's real component is controlled-only for `activeTabIndex`/`post` (no uncontrolled fallback) — this gives the canvas local state so clicking a platform tab swaps the PostCard preview, and adding/removing a platform in "Where to post?" actually grows/shrinks the Tabs row and preview below. */
function DefaultPlayground({ showCloseButton }: { showCloseButton: boolean }) {
  const isDark = useDarkMode();
  const defaultArgs = DEFAULT_ARGS as PostingModalDefaultProps;
  const [post, setPost] = React.useState(defaultArgs.post);
  const [activeTabIndex, setActiveTabIndex] = React.useState(
    defaultArgs.activeTabIndex ?? 0,
  );
  const [rewriteInstruction, setRewriteInstruction] = React.useState(
    defaultArgs.rewriteInstruction ?? "",
  );

  return (
    <PostingModal
      {...defaultArgs}
      colorScheme={isDark ? "dark" : "light"}
      post={post}
      activeTabIndex={activeTabIndex}
      rewriteInstruction={rewriteInstruction}
      onRewriteInstructionChange={(value: string) => {
        setRewriteInstruction(value);
        defaultArgs.onRewriteInstructionChange?.(value);
      }}
      onApplyChanges={() => {
        // No AI backend yet — mocks the rewrite by reflecting the instruction into the caption.
        setPost((prev) => ({
          ...prev,
          caption: rewriteInstruction.trim() || prev.caption,
        }));
        defaultArgs.onApplyChanges?.();
      }}
      onActiveTabIndexChange={(index: number) => {
        setActiveTabIndex(index);
        defaultArgs.onActiveTabIndexChange?.(index);
      }}
      onAddPlatform={(platform: PostPlatform) => {
        setPost((prev) => ({
          ...prev,
          platforms: [...prev.platforms, platform],
        }));
        defaultArgs.onAddPlatform?.(platform);
      }}
      onRemovePlatform={(index: number) => {
        setPost((prev) => ({
          ...prev,
          platforms: prev.platforms.filter((_, i) => i !== index),
        }));
        setActiveTabIndex(0);
        defaultArgs.onRemovePlatform?.(index);
      }}
      onScheduleDraft={() => {
        setPost((prev) => ({ ...prev, status: "scheduled" }));
        defaultArgs.onScheduleDraft?.();
      }}
      onDateChange={(date: Date) => {
        setPost((prev) => ({ ...prev, date: formatPostDate(date) }));
        defaultArgs.onDateChange?.(date);
      }}
      onTimeChange={(value: string) => {
        setPost((prev) => ({
          ...prev,
          time: `${value} ${prev.time.includes("PM") ? "PM" : "AM"}`,
        }));
        defaultArgs.onTimeChange?.(value);
      }}
      onTimePeriodChange={(period: TimePeriod) => {
        setPost((prev) => ({
          ...prev,
          time: `${prev.time.slice(0, 5)} ${period}`,
        }));
        defaultArgs.onTimePeriodChange?.(period);
      }}
      showCloseButton={showCloseButton}
    />
  );
}

/** Story-only: same reason as `DefaultPlayground` — `platforms`/`postTypeIndex`/`postCount` have no uncontrolled fallback, so the canvas needs local state for the add/remove dropdown, chip delete, Post Type chips (which toggle the Image style/Reference rows), and the post-count stepper to do anything visible. */
function EmptyPlayground({ showCloseButton }: { showCloseButton: boolean }) {
  const isDark = useDarkMode();
  const emptyArgs = EMPTY_ARGS as PostingModalEmptyProps;
  const [platforms, setPlatforms] = React.useState(emptyArgs.platforms);
  const [postTypeIndex, setPostTypeIndex] = React.useState(
    emptyArgs.postTypeIndex ?? 0,
  );
  const [postCount, setPostCount] = React.useState(emptyArgs.postCount ?? 1);

  return (
    <PostingModal
      {...emptyArgs}
      colorScheme={isDark ? "dark" : "light"}
      platforms={platforms}
      onAddPlatform={(platform: PostPlatform) => {
        setPlatforms((prev) => [...prev, platform]);
        emptyArgs.onAddPlatform?.(platform);
      }}
      onRemovePlatform={(index: number) => {
        setPlatforms((prev) => prev.filter((_, i) => i !== index));
        emptyArgs.onRemovePlatform?.(index);
      }}
      postTypeIndex={postTypeIndex}
      onPostTypeChange={(index: number) => {
        setPostTypeIndex(index);
        emptyArgs.onPostTypeChange?.(index);
      }}
      postCount={postCount}
      onPostCountChange={(count: number) => {
        setPostCount(count);
        emptyArgs.onPostCountChange?.(count);
      }}
      showCloseButton={showCloseButton}
    />
  );
}

const meta = {
  title: "ContentStudio/UI/PostingModal",
  component: PostingModal as unknown as React.ComponentType<PlaygroundProps>,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          "Implemented as PostingModal in components/content-studio/ui/PostingModal/PostingModal.tsx. Figma `Style=empty` is the creation flow (date header, platform chips+add, post-count stepper, post-type chips, a generation Chatbox, Auto-generate). `Style=default` is the edit flow (date/time/platform fields + an AI-rewrite ChatboxComposer on the left; Tabs + PostCard preview + footer actions on the right). The right-side Tabs/preview iterate `post.platforms` — adding a platform grows the row with no new branches. 'Where to post?' shows each selected platform as a deletable Chip, with a trailing dropdown to add any platform not yet selected (at least one is always kept). See docs/components/posting-modal.md.",
        story:
          'Canvas renders at real size and width hugs the active platform\'s preview (no fixed modal width) — scroll to see the full modal if needed. Both presets wrap their platform list in local state, so the "Where to post?" dropdown/chip delete work live in the canvas, as does (on `default`) the Tabs click and (on `empty`) the Post Type chips toggling the Image style/Reference rows — see docs/components/posting-modal.md for real usage.',
      },
      source: {
        type: "code",
        code: `<PostingModal
  style="default"
  post={post}
  activeTabIndex={activeTabIndex}
  onActiveTabIndexChange={setActiveTabIndex}
  onAddPlatform={(platform) => addPlatform(platform)}
  onRemovePlatform={(index) => removePlatform(index)}
  onSaveChanges={() => handleSaveChanges(post)}
  onScheduleDraft={() => handleScheduleDraft(post)}
/>`,
      },
    },
  },
  argTypes: {
    preset: {
      control: "radio",
      options: ["empty", "default"],
      description:
        "Figma `Style` — switches between the create-flow and edit-flow sample props",
    },
    showCloseButton: { control: "boolean" },
  },
  args: {
    preset: "default",
    showCloseButton: true,
  },
  render: ({ preset, showCloseButton }) =>
    preset === "default" ? (
      <DefaultPlayground showCloseButton={showCloseButton} />
    ) : (
      <EmptyPlayground showCloseButton={showCloseButton} />
    ),
} satisfies Meta<React.ComponentType<PlaygroundProps>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    if (args.preset === "default") {
      await userEvent.click(
        canvas.getByRole("button", { name: "Save Changes" }),
      );
      expect(
        (DEFAULT_ARGS as PostingModalProps & { style: "default" })
          .onSaveChanges,
      ).toHaveBeenCalledTimes(1);
    } else {
      await userEvent.click(
        canvas.getByRole("button", { name: "Auto-generate" }),
      );
      expect(
        (EMPTY_ARGS as PostingModalProps & { style: "empty" }).onAutoGenerate,
      ).toHaveBeenCalledTimes(1);

      // Leaves the nested Reference AssetGalleryDialog open so it's visible
      // without an extra manual click — it's opened via internal state
      // (no prop to default it open), so a play-function click is the only way.
      await userEvent.click(
        canvas.getByRole("button", { name: "Add Reference" }),
      );
    }
  },
};
