import type { BadgeVariant } from "@/components/ui/badge";
import type { IconId } from "@/lib/sprite-icon";

export type PostStatus = "no-content" | "draft" | "scheduled" | "posted";
export type PostPlatform = "linkedin" | "x" | "instagram" | "threads";
export type PostContentType = "image" | "text";

export interface PlatformIdentity {
  name: string;
  handle?: string;
}

export interface Post {
  id: string;
  status: PostStatus;
  contentType: PostContentType;
  /** One image renders a single frame; more than one renders a carousel with dot pagination. */
  images: string[];
  caption: string;
  /** Bold headline shown above the caption. Threads-only — other platform layouts ignore it. */
  title?: string;
  hashtags: string[];
  platforms: PostPlatform[];
  date: string;
  time: string;
}

export const PLATFORM_LABELS: Record<PostPlatform, string> = {
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  instagram: "Instagram",
  threads: "Threads",
};

export const PLATFORM_IDENTITIES: Record<PostPlatform, PlatformIdentity> = {
  linkedin: { name: "Data Storyteller" },
  x: { name: "Cloe Mitchell", handle: "@Cloe_Mitchell" },
  instagram: { name: "data.storyteller" },
  threads: { name: "data.storyteller" },
};

export const PLATFORM_ICONS: Record<PostPlatform, IconId> = {
  linkedin: "linkedin-icon",
  x: "xtwitter-icon",
  instagram: "instagram-icon",
  threads: "thread-icon",
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  "no-content": "No content",
  draft: "Draft",
  scheduled: "Scheduled",
  posted: "Posted",
};

/** Mirrors `ScheduleSlot`'s type→variant mapping so the same status always renders the same badge color. */
export const STATUS_BADGE_VARIANT: Record<PostStatus, BadgeVariant> = {
  "no-content": "alarm",
  draft: "reverse",
  scheduled: "default",
  posted: "outline",
};

export function formatPostDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${date.getFullYear()}`;
}
