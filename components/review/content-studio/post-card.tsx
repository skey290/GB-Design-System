"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";

import type { Post } from "./data";

const REACTION_ICONS = [
  "linkedinset-like-icon",
  "linkedinset-comment-icon",
  "linkedinset-repost-icon",
  "linkedinset-send-icon",
] as const;

export interface PostCardProps {
  post: Post;
  isHighlighted?: boolean;
  onOpenEdit: () => void;
  onScheduleDraft: () => void;
  onArchive: () => void;
}

/**
 * Content 탭 그리드의 포스트 카드. 상태에 따라 하단 액션 버튼과 archive
 * 가능 여부가 달라진다(`docs/GB_Content_Studio.md` 11부).
 */
export function PostCard({
  post,
  isHighlighted = false,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const isPosted = post.status === "posted";
  const isDraft = post.status === "draft";
  const badgeVariant =
    post.status === "posted"
      ? "success"
      : post.status === "scheduled"
        ? "default"
        : "outline";

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)]",
        "border-[length:var(--gb-border-1)] border-solid bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-3)]",
        isHighlighted
          ? "border-[var(--gb-border-selected)]"
          : "border-[var(--gb-border-subtler)]",
      )}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onOpenEdit}
          className="block w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt=""
            className="aspect-square w-full rounded-[var(--gb-radius-scale-lg)] object-cover"
          />
        </button>
        <Button
          variant="icon-ghost"
          icon={<Icon id="archive-icon" />}
          aria-label="Move to Archive"
          onClick={onArchive}
          className="absolute top-[var(--gb-spacing-1)] left-[var(--gb-spacing-1)] bg-[var(--gb-background-default)]"
        />
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={badgeVariant}>{post.status}</Badge>
        <span className="text-xs-regular text-[var(--gb-text-subtle)]">
          {post.date} · {post.time}
        </span>
      </div>

      <button type="button" onClick={onOpenEdit} className="text-left">
        <p className="text-sm-medium line-clamp-2 text-[var(--gb-text-default)]">
          {post.caption}
        </p>
        <p className="text-xs-regular text-[var(--gb-text-subtler)]">
          {post.hashtags.join(" ")}
        </p>
      </button>

      <div className="flex items-center gap-[var(--gb-spacing-3)]">
        {REACTION_ICONS.map((iconId) => (
          <Icon
            key={iconId}
            id={iconId}
            className="size-[var(--gb-spacing-4)] text-[var(--gb-text-subtle)]"
          />
        ))}
      </div>

      {isDraft ? (
        <Button variant="primary" onClick={onScheduleDraft}>
          Schedule Draft
        </Button>
      ) : (
        <Button variant="outline" onClick={onOpenEdit} disabled={isPosted}>
          Edit Post
        </Button>
      )}
    </div>
  );
}
