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
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
  type Post,
  type PostPlatform,
} from "@/components/review/content-studio/data";

import styles from "./PostCard.module.css";

const DEFAULT_AVATAR_SRC = "/images/personas/self-default.jpg";

const LINKEDIN_REACTIONS: { id: IconId; label: string }[] = [
  { id: "linkedinset-like-icon", label: "Like" },
  { id: "linkedinset-comment-icon", label: "Comment" },
  { id: "linkedinset-repost-icon", label: "Share" },
  { id: "linkedinset-send-icon", label: "Send" },
];

const X_REACTIONS: { id: IconId; label: string }[] = [
  { id: "xtwitterset-retweet-icon", label: "Retweet" },
  { id: "xtwitterset-comment-icon", label: "Comment" },
  { id: "xtwitterset-like-icon", label: "Like" },
  { id: "xtwitterset-view-icon", label: "View" },
  { id: "xtwitterset-share-icon", label: "Share" },
];

const THREADS_REACTIONS: { id: IconId; label: string }[] = [
  { id: "meta-like-icon", label: "Like" },
  { id: "meta-comment-icon", label: "Comment" },
  { id: "meta-repost-icon", label: "Repost" },
  { id: "meta-share-icon", label: "Share" },
];

const INSTAGRAM_REACTIONS: { id: IconId; label: string }[] = [
  { id: "meta-like-icon", label: "Like" },
  { id: "meta-comment-icon", label: "Comment" },
  { id: "meta-repost-icon", label: "Repost" },
  { id: "meta-share-icon", label: "Share" },
];

export interface PostCardProps {
  post: Post;
  /** Overrides which platform layout renders. Defaults to `post.platforms[0]` — set this when the same post must preview under a specific platform tab (e.g. PostingModal's multi-platform Tabs) */
  platform?: PostPlatform;
  /** Figma `Status=active` — a focus ring highlighting this card (e.g. the post tied to the currently selected schedule slot) */
  isHighlighted?: boolean;
  /** Whether hovering shows the clickable affordance (border + focus-ring shadow) and a pointer cursor. Set false when this card is a non-interactive preview (e.g. PostingModal's embedded preview, whose onOpenEdit is a no-op). Default true. */
  isInteractive?: boolean;
  /** Figma `buttons` — the bottom Archive/Schedule-Draft-or-Edit-Post row. Turn off when embedding this card in a container that already has its own equivalent actions (e.g. PostingModal's footer) */
  showButtons?: boolean;
  /** Self-profile photo shown in the header avatar */
  avatarSrc?: string;
  className?: string;
  onOpenEdit: () => void;
  onScheduleDraft: () => void;
  onArchive: () => void;
}

interface PostImageState {
  contentStyle: "text" | "image" | "carousel";
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}

function usePostImageState(post: Post): PostImageState {
  const [currentImage, setCurrentImage] = React.useState(1);
  const isCarousel = post.contentType === "image" && post.images.length > 1;
  const contentStyle =
    post.contentType === "text" ? "text" : isCarousel ? "carousel" : "image";

  return { contentStyle, currentImage, setCurrentImage };
}

function PostImageSection({
  post,
  state,
  onOpenEdit,
}: {
  post: Post;
  state: PostImageState;
  onOpenEdit: () => void;
}) {
  const { contentStyle, currentImage, setCurrentImage } = state;

  return (
    <div className={styles.imageWrapper}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenEdit();
        }}
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
            onClick={(event) => {
              event.stopPropagation();
              setCurrentImage((prev) => Math.max(1, prev - 1));
            }}
            disabled={currentImage === 1}
            className={cn(styles.carouselNav, styles.carouselNavPrev)}
          />
          <Button
            variant="icon-rounded"
            icon={<Icon id="arrow-right-icon" />}
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              setCurrentImage((prev) => Math.min(post.images.length, prev + 1));
            }}
            disabled={currentImage === post.images.length}
            className={cn(styles.carouselNav, styles.carouselNavNext)}
          />
        </>
      )}
    </div>
  );
}

function ActionsBar({
  post,
  onArchive,
  onScheduleDraft,
  onOpenEdit,
}: Pick<
  PostCardProps,
  "post" | "onArchive" | "onScheduleDraft" | "onOpenEdit"
>) {
  const isDraft = post.status === "draft";
  const isPosted = post.status === "posted";

  return (
    <div className={styles.actions}>
      <Button
        variant="icon"
        icon={<Icon id="archive-icon" />}
        aria-label="Move to Archive"
        onClick={(event) => {
          event.stopPropagation();
          onArchive();
        }}
      />
      {isDraft ? (
        <Button
          variant="primary"
          onClick={(event) => {
            event.stopPropagation();
            onScheduleDraft();
          }}
          className={styles.primaryAction}
        >
          Schedule Draft
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            onOpenEdit();
          }}
          disabled={isPosted}
          className={styles.primaryAction}
        >
          Edit Post
        </Button>
      )}
    </div>
  );
}

function EmptyCard({
  platform,
  isHighlighted,
  className,
}: {
  platform: PostPlatform;
  isHighlighted: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(styles.root, className)}
      data-platform={platform}
      data-style="empty"
      data-highlighted={isHighlighted || undefined}
    >
      <span className={styles.emptyIconWrap}>
        <Icon id="no-file-pen-icon" className={styles.emptyIcon} />
      </span>
      <p className={styles.emptyTitle}>No post Created yet</p>
      <p className={styles.emptyDescription}>Add ideas to create your post.</p>
    </div>
  );
}

/** Figma `Part/post` (node 8127:87737), `Type=LinkedIn`. */
function LinkedInLayout({
  post,
  isHighlighted = false,
  isInteractive = true,
  showButtons = true,
  avatarSrc = DEFAULT_AVATAR_SRC,
  className,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const identity = PLATFORM_IDENTITIES.linkedin;
  const imageState = usePostImageState(post);

  return (
    <div
      className={cn(styles.root, className)}
      data-platform="linkedin"
      data-style={imageState.contentStyle}
      data-highlighted={isHighlighted || undefined}
      data-interactive={isInteractive || undefined}
      onClick={onOpenEdit}
    >
      <div className={styles.header}>
        <PostAvatar
          socialMedia="linkedin"
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
              id={PLATFORM_ICONS.linkedin}
              className={styles.platformIcon}
            />
          </div>
        </div>
        <Badge
          variant={STATUS_BADGE_VARIANT[post.status]}
          className={styles.statusBadge}
        >
          {STATUS_LABELS[post.status]}
        </Badge>
      </div>

      {imageState.contentStyle !== "text" && (
        <PostImageSection
          post={post}
          state={imageState}
          onOpenEdit={onOpenEdit}
        />
      )}

      <div className={styles.body}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenEdit();
          }}
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
          {LINKEDIN_REACTIONS.map((reaction) => (
            <span key={reaction.id} className={styles.reaction}>
              <Icon id={reaction.id} className={styles.reactionIcon} />
              <span className={styles.reactionLabel}>{reaction.label}</span>
            </span>
          ))}
        </div>

        {showButtons && (
          <ActionsBar
            post={post}
            onArchive={onArchive}
            onScheduleDraft={onScheduleDraft}
            onOpenEdit={onOpenEdit}
          />
        )}
      </div>
    </div>
  );
}

/** Figma `Part/post` (node 8127:87737), `Type=X (Twitter)`. */
function XLayout({
  post,
  isHighlighted = false,
  isInteractive = true,
  showButtons = true,
  avatarSrc = DEFAULT_AVATAR_SRC,
  className,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const identity = PLATFORM_IDENTITIES.x;
  const imageState = usePostImageState(post);

  return (
    <div
      className={cn(styles.root, className)}
      data-platform="x"
      data-style={imageState.contentStyle}
      data-highlighted={isHighlighted || undefined}
      data-interactive={isInteractive || undefined}
      onClick={onOpenEdit}
    >
      <div className={styles.header}>
        <PostAvatar
          socialMedia="x"
          type="self"
          src={avatarSrc}
          connectedAccounts={1}
        />
        <div className={styles.headerText}>
          <div className={styles.nameRow}>
            <p className={styles.name}>{identity.name}</p>
            <Icon id="xtwitterset-badge-icon" className={styles.nameBadge} />
          </div>
          <div className={styles.handleRow}>
            {identity.handle && (
              <span className={styles.handle}>{identity.handle}</span>
            )}
            <span className={styles.date}>
              {post.date} {post.time}
            </span>
          </div>
        </div>
        <Badge
          variant={STATUS_BADGE_VARIANT[post.status]}
          className={styles.statusBadge}
        >
          {STATUS_LABELS[post.status]}
        </Badge>
      </div>

      {imageState.contentStyle !== "text" && (
        <PostImageSection
          post={post}
          state={imageState}
          onOpenEdit={onOpenEdit}
        />
      )}

      <div className={styles.body}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenEdit();
          }}
          className={styles.captionButton}
        >
          <p className={styles.caption}>{post.caption}</p>
        </button>

        <p className={styles.hashtags}>
          {post.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>

        <div className={styles.reactionsRow}>
          {X_REACTIONS.map((reaction) => (
            <span key={reaction.id} role="img" aria-label={reaction.label}>
              <Icon id={reaction.id} className={styles.reactionIcon} />
            </span>
          ))}
        </div>

        {showButtons && (
          <ActionsBar
            post={post}
            onArchive={onArchive}
            onScheduleDraft={onScheduleDraft}
            onOpenEdit={onOpenEdit}
          />
        )}
      </div>
    </div>
  );
}

/** Figma `Part/post` (node 8127:87737), `Type=instagram`. */
function InstagramLayout({
  post,
  isHighlighted = false,
  isInteractive = true,
  showButtons = true,
  avatarSrc = DEFAULT_AVATAR_SRC,
  className,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const identity = PLATFORM_IDENTITIES.instagram;
  const imageState = usePostImageState(post);

  return (
    <div
      className={cn(styles.root, className)}
      data-platform="instagram"
      data-style={imageState.contentStyle}
      data-highlighted={isHighlighted || undefined}
      data-interactive={isInteractive || undefined}
      onClick={onOpenEdit}
    >
      <div className={styles.header}>
        <PostAvatar
          socialMedia="instagram"
          type="self"
          src={avatarSrc}
          connectedAccounts={1}
        />
        <div className={styles.headerText}>
          <div className={styles.nameRow}>
            <p className={styles.name}>{identity.name}</p>
            <Icon id="meta-badge-icon" className={styles.nameBadge} />
          </div>
          <span className={styles.date}>
            {post.date} {post.time}
          </span>
        </div>
        <Badge
          variant={STATUS_BADGE_VARIANT[post.status]}
          className={styles.statusBadge}
        >
          {STATUS_LABELS[post.status]}
        </Badge>
      </div>

      <PostImageSection
        post={post}
        state={imageState}
        onOpenEdit={onOpenEdit}
      />

      <div className={styles.body}>
        <div className={styles.reactionsRow}>
          <div className={styles.reactionsGroup}>
            {INSTAGRAM_REACTIONS.map((reaction) => (
              <span key={reaction.id} role="img" aria-label={reaction.label}>
                <Icon id={reaction.id} className={styles.reactionIcon} />
              </span>
            ))}
          </div>
          <span role="img" aria-label="Bookmark">
            <Icon id="meta-bookmark-icon" className={styles.reactionIcon} />
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenEdit();
          }}
          className={styles.captionButton}
        >
          <p className={styles.title}>{identity.name}</p>
          <p className={styles.caption}>{post.caption}</p>
        </button>

        <p className={styles.hashtags}>
          {post.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>

        {showButtons && (
          <ActionsBar
            post={post}
            onArchive={onArchive}
            onScheduleDraft={onScheduleDraft}
            onOpenEdit={onOpenEdit}
          />
        )}
      </div>
    </div>
  );
}

/** Figma `Part/post` (node 8127:87737), `Type=Thread`. */
function ThreadsLayout({
  post,
  isHighlighted = false,
  isInteractive = true,
  showButtons = true,
  avatarSrc = DEFAULT_AVATAR_SRC,
  className,
  onOpenEdit,
  onScheduleDraft,
  onArchive,
}: PostCardProps) {
  const identity = PLATFORM_IDENTITIES.threads;
  const imageState = usePostImageState(post);

  return (
    <div
      className={cn(styles.root, className)}
      data-platform="threads"
      data-style={imageState.contentStyle}
      data-highlighted={isHighlighted || undefined}
      data-interactive={isInteractive || undefined}
      onClick={onOpenEdit}
    >
      <div className={styles.threadsMain}>
        <PostAvatar
          socialMedia="threads"
          type="self"
          src={avatarSrc}
          connectedAccounts={1}
        />
        <div className={styles.threadsColumn}>
          <div className={styles.header}>
            <div className={styles.headerText}>
              <div className={styles.nameRow}>
                <p className={styles.name}>{identity.name}</p>
                <Icon
                  id="xtwitterset-badge-icon"
                  className={styles.nameBadge}
                />
              </div>
              <span className={styles.date}>
                {post.date} {post.time}
              </span>
            </div>
            <Badge
              variant={STATUS_BADGE_VARIANT[post.status]}
              className={styles.statusBadge}
            >
              {STATUS_LABELS[post.status]}
            </Badge>
          </div>

          <div className={styles.threadsBody}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenEdit();
              }}
              className={styles.captionButton}
            >
              {post.title && <p className={styles.title}>{post.title}</p>}
              <p className={styles.caption}>{post.caption}</p>
            </button>

            {imageState.contentStyle !== "text" && (
              <PostImageSection
                post={post}
                state={imageState}
                onOpenEdit={onOpenEdit}
              />
            )}

            <div className={styles.reactionsRow}>
              {THREADS_REACTIONS.map((reaction) => (
                <span key={reaction.id} role="img" aria-label={reaction.label}>
                  <Icon id={reaction.id} className={styles.reactionIcon} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showButtons && (
        <ActionsBar
          post={post}
          onArchive={onArchive}
          onScheduleDraft={onScheduleDraft}
          onOpenEdit={onOpenEdit}
        />
      )}
    </div>
  );
}

const PLATFORM_LAYOUTS: Record<
  PostPlatform,
  (props: PostCardProps) => React.JSX.Element
> = {
  linkedin: LinkedInLayout,
  x: XLayout,
  instagram: InstagramLayout,
  threads: ThreadsLayout,
};

/** Figma `Part/post` (node 8127:87737) — the feed preview card shown in the Content tab grid. `Type` dispatches to a platform-specific layout. */
export function PostCard(props: PostCardProps) {
  const {
    post,
    isHighlighted = false,
    className,
    platform: platformOverride,
  } = props;
  const platform = platformOverride ?? post.platforms[0] ?? "linkedin";

  if (post.status === "no-content") {
    return (
      <EmptyCard
        platform={platform}
        isHighlighted={isHighlighted}
        className={className}
      />
    );
  }

  const Layout = PLATFORM_LAYOUTS[platform];
  return <Layout {...props} />;
}
