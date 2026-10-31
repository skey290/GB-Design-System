import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Post } from "@/components/review/content-studio/data";

import { PostCard } from "./PostCard";

const BASE_POST: Post = {
  id: "post-1",
  status: "draft",
  contentType: "image",
  images: ["/images/personas/team-leader.jpg"],
  caption: "Hi, I'm Cloe. Three years into data science at a SaaS startup.",
  hashtags: ["#DataScience", "#SaaS"],
  platforms: ["linkedin"],
  date: "09.01.2026",
  time: "10:00 PM",
};

function renderPostCard(post: Partial<Post> = {}, extraProps = {}) {
  const onOpenEdit = vi.fn();
  const onScheduleDraft = vi.fn();
  const onArchive = vi.fn();

  render(
    <PostCard
      post={{ ...BASE_POST, ...post }}
      onOpenEdit={onOpenEdit}
      onScheduleDraft={onScheduleDraft}
      onArchive={onArchive}
      {...extraProps}
    />,
  );

  return { onOpenEdit, onScheduleDraft, onArchive };
}

describe("PostCard", () => {
  it("renders the header name, date/time, and status badge", () => {
    renderPostCard();

    expect(screen.getByText("Data Storyteller")).toBeInTheDocument();
    expect(screen.getByText("09.01.2026 10:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it.each([
    ["draft", "reverse"],
    ["scheduled", "default"],
    ["posted", "outline"],
  ] as const)(
    "renders the %s status badge with the same variant as ScheduleSlot (%s)",
    (status, variant) => {
      renderPostCard({ status });

      expect(screen.getByText(/^(Draft|Scheduled|Posted)$/)).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it("renders the image, caption, and hashtags for an image post", () => {
    renderPostCard();

    expect(screen.getByRole("button", { name: "Open post" })).toBeVisible();
    expect(screen.getByText(/Three years into data science/)).toBeVisible();
    expect(screen.getByText("#DataScience")).toBeVisible();
  });

  it("renders no image for a text post", () => {
    renderPostCard({ contentType: "text", images: [] });

    expect(
      screen.queryByRole("button", { name: "Open post" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Three years into data science/)).toBeVisible();
  });

  it("renders carousel navigation and a page counter when there is more than one image", () => {
    renderPostCard({
      images: [
        "/images/personas/team-leader.jpg",
        "/images/personas/entrepreneur.jpg",
        "/images/personas/fashion-editor.jpg",
      ],
    });

    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next image" }),
    ).not.toBeDisabled();
  });

  it("advances the carousel image on next/previous click", async () => {
    const user = userEvent.setup();
    renderPostCard({
      images: [
        "/images/personas/team-leader.jpg",
        "/images/personas/entrepreneur.jpg",
      ],
    });

    await user.click(screen.getByRole("button", { name: "Next image" }));

    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next image" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous image" }));

    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("renders the empty placeholder for a no-content post", () => {
    renderPostCard({ status: "no-content", images: [] });

    expect(screen.getByText("No post Created yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add ideas to create your post."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Data Storyteller")).not.toBeInTheDocument();
  });

  it("shows a primary Schedule Draft button for draft posts", async () => {
    const user = userEvent.setup();
    const { onScheduleDraft } = renderPostCard({ status: "draft" });

    const button = screen.getByRole("button", { name: "Schedule Draft" });
    await user.click(button);

    expect(onScheduleDraft).toHaveBeenCalledTimes(1);
  });

  it("shows an enabled Edit Post button for scheduled posts", async () => {
    const user = userEvent.setup();
    const { onOpenEdit } = renderPostCard({ status: "scheduled" });

    const button = screen.getByRole("button", { name: "Edit Post" });
    expect(button).not.toBeDisabled();

    await user.click(button);
    expect(onOpenEdit).toHaveBeenCalledTimes(1);
  });

  it("disables the Edit Post button for posted posts", () => {
    renderPostCard({ status: "posted" });

    expect(screen.getByRole("button", { name: "Edit Post" })).toBeDisabled();
  });

  it("calls onArchive when the archive button is clicked", async () => {
    const user = userEvent.setup();
    const { onArchive } = renderPostCard();

    await user.click(screen.getByRole("button", { name: "Move to Archive" }));

    expect(onArchive).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenEdit when the image or caption is clicked", async () => {
    const user = userEvent.setup();
    const { onOpenEdit } = renderPostCard();

    await user.click(screen.getByRole("button", { name: "Open post" }));
    expect(onOpenEdit).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/Three years into data science/));
    expect(onOpenEdit).toHaveBeenCalledTimes(2);
  });

  it("marks the card as highlighted via data-highlighted", () => {
    const { container } = render(
      <PostCard
        post={BASE_POST}
        isHighlighted
        onOpenEdit={vi.fn()}
        onScheduleDraft={vi.fn()}
        onArchive={vi.fn()}
      />,
    );

    expect(container.firstChild).toHaveAttribute("data-highlighted", "true");
  });

  it("renders the Archive/Schedule-Draft row by default (showButtons defaults to true)", () => {
    renderPostCard();

    expect(
      screen.getByRole("button", { name: "Move to Archive" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Schedule Draft" }),
    ).toBeInTheDocument();
  });

  it("hides the Archive/Schedule-Draft row when showButtons is false", () => {
    renderPostCard({}, { showButtons: false });

    expect(
      screen.queryByRole("button", { name: "Move to Archive" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Schedule Draft" }),
    ).not.toBeInTheDocument();
  });

  describe("X layout", () => {
    it("renders the handle, name, and 5 unlabeled reaction icons", () => {
      renderPostCard({ platforms: ["x"] });

      expect(screen.getByText("Cloe Mitchell")).toBeInTheDocument();
      expect(screen.getByText("@Cloe_Mitchell")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Retweet" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Comment" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Like" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "View" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Share" })).toBeInTheDocument();
    });

    it("renders hashtags", () => {
      renderPostCard({ platforms: ["x"] });

      expect(screen.getByText("#DataScience")).toBeInTheDocument();
    });
  });

  describe("Instagram layout", () => {
    it("renders the name as a caption prefix and a bookmark icon", () => {
      renderPostCard({ platforms: ["instagram"] });

      expect(screen.getAllByText("data.storyteller").length).toBeGreaterThan(0);
      expect(screen.getByRole("img", { name: "Bookmark" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Like" })).toBeInTheDocument();
    });

    it("always renders the image, even without a carousel", () => {
      renderPostCard({ platforms: ["instagram"] });

      expect(screen.getByRole("button", { name: "Open post" })).toBeVisible();
    });
  });

  describe("Threads layout", () => {
    it("renders the title above the caption when set", () => {
      renderPostCard({
        platforms: ["threads"],
        title: "Today's Data Insight",
        contentType: "text",
        images: [],
      });

      expect(screen.getByText("Today's Data Insight")).toBeInTheDocument();
    });

    it("does not render a title when the post has none", () => {
      renderPostCard({
        platforms: ["threads"],
        contentType: "text",
        images: [],
      });

      expect(
        screen.queryByText("Today's Data Insight"),
      ).not.toBeInTheDocument();
    });

    it("renders only 4 reaction icons and no hashtags", () => {
      renderPostCard({
        platforms: ["threads"],
        contentType: "text",
        images: [],
      });

      expect(screen.getByRole("img", { name: "Like" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Comment" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Repost" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Share" })).toBeInTheDocument();
      expect(screen.queryByText("#DataScience")).not.toBeInTheDocument();
    });
  });
});
