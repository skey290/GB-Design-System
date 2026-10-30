"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon, type IconId } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";
import { PLATFORM_ICONS } from "@/components/review/content-studio/account-picker";
import { PostAvatar } from "@/components/review/content-studio/post-avatar";
import {
  PLATFORM_IDENTITIES,
  STATUS_LABELS,
  type Post,
} from "@/components/review/content-studio/data";

import styles from "./PostCard.module.css";

const DEFAULT_AVATAR_SRC = "/images/personas/self-default.jpg";

const REACTIONS: { id: IconId; label: string }[] = [
  { id: "linkedinset-like-icon", label: "Like" },
  { id: "linkedinset-comment-icon", label: "Comment" },
  { id: "linkedinset-repost-icon", label: "Share" },
  { id: "linkedinset-send-icon", label: "Send" },
];

export interface PostCardProps {
  post: Post;
  /** Figma `Status=active` — a focus ring highlighting this card (e.g. the post tied to the currently selected schedule slot) */
  isHighlighted?: boolean;
  /** Self-profile photo shown in the header avatar */
  avatarSrc?: string;
  className?: string;
  onOpenEdit: () => void;
  onScheduleDraft: () => void;
  onArchive: () => void;
}

/** Figma `Part/post` (node 8127:87737) — the feed preview card shown in the Content tab grid. */
export function PostCard({
  post,
  isHighlighted = false,
  avatarSrc = DEFAULT_AVATAR_SRC,
  className,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const [currentImage, setCurrentImage] = React.useState(1);

  const platform = post.platforms[0] ?? "linkedin";
  const identity = PLATFORM_IDENTITIES[platform];
  const isEmpty = post.status === "no-content";
  const isCarousel = post.contentType === "image" && post.images.length > 1;
  const contentStyle = isEmpty
    ? "empty"
    : post.contentType === "text"
      ? "text"
      : isCarousel
        ? "carousel"
        : "image";
  const isDraft = post.status === "draft";
  const isPosted = post.status === "posted";

  if (contentStyle === "empty") {
    return (
      <div
        className={cn(styles.root, className)}
        data-style="empty"
        data-highlighted={isHighlighted || undefined}
      >
        <span className={styles.emptyIconWrap}>
          <Icon id="no-file-pen-icon" className={styles.emptyIcon} />
        </span>
        <p className={styles.emptyTitle}>No post Created yet</p>
        <p className={styles.emptyDescription}>
          Add ideas to create your post.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.root, className)}
      data-style={contentStyle}
      data-highlighted={isHighlighted || undefined}
    >
      <div className={styles.header}>
        <PostAvatar
          socialMedia={platform}
          type="self"
          src={avatarSrc}
          connectedAccounts={1}
        />
        <div className={styles.headerText}>
          <p className={styles.name}>{identity.name}</p>
          <div className={styles.dateRow}>
            <span className={styles.date}>
              {post.date} {post.time}
            </span>
            <Icon
              id={PLATFORM_ICONS[platform]}
              className={styles.platformIcon}
            />
          </div>
        </div>
        <Badge variant="reverse" className={styles.statusBadge}>
          {STATUS_LABELS[post.status]}
        </Badge>
      </div>

      {contentStyle !== "text" && (
        <div className={styles.imageWrapper}>
          <button
            type="button"
            onClick={onOpenEdit}
            className={styles.imageButton}
            aria-label="Open post"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.images[currentImage - 1]}
              alt=""
              className={styles.image}
            />
          </button>

          {contentStyle === "carousel" && (
            <>
              <Badge variant="default" className={styles.carouselCounter}>
                {currentImage}/{post.images.length}
              </Badge>
              <Button
                variant="icon-rounded"
                icon={<Icon id="arrow-left-icon" />}
                aria-label="Previous image"
                onClick={() => setCurrentImage((prev) => Math.max(1, prev - 1))}
                disabled={currentImage === 1}
                className={cn(styles.carouselNav, styles.carouselNavPrev)}
              />
              <Button
                variant="icon-rounded"
                icon={<Icon id="arrow-right-icon" />}
                aria-label="Next image"
                onClick={() =>
                  setCurrentImage((prev) =>
                    Math.min(post.images.length, prev + 1),
                  )
                }
                disabled={currentImage === post.images.length}
                className={cn(styles.carouselNav, styles.carouselNavNext)}
              />
            </>
          )}
        </div>
      )}

      <div className={styles.body}>
        <button
          type="button"
          onClick={onOpenEdit}
          className={styles.captionButton}
        >
          <p className={styles.caption}>{post.caption}</p>
        </button>

        <p className={styles.hashtags}>
          {post.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>

        <div className={styles.divider} />

        <div className={styles.reactions}>
          {REACTIONS.map((reaction) => (
            <span key={reaction.id} className={styles.reaction}>
              <Icon id={reaction.id} className={styles.reactionIcon} />
              <span className={styles.reactionLabel}>{reaction.label}</span>
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <Button
            variant="icon"
            icon={<Icon id="archive-icon" />}
            aria-label="Move to Archive"
            onClick={onArchive}
          />
          {isDraft ? (
            <Button
              variant="primary"
              onClick={onScheduleDraft}
              className={styles.primaryAction}
            >
              Schedule Draft
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onOpenEdit}
              disabled={isPosted}
              className={styles.primaryAction}
            >
              Edit Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
