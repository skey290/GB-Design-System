import type { BadgeVariant } from "@/components/ui/badge";

export type PostStatus = "no-content" | "draft" | "scheduled" | "posted";
export type PostPlatform = "linkedin" | "x" | "instagram" | "threads";
export type PostContentType = "image" | "text";

export interface PlatformIdentity {
  name: string;
  handle?: string;
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

export interface ScheduleSlot {
  id: string;
  dayLabel: string;
  date: string;
  time: string;
  postId: string | null;
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

const CAPTION_POOL = [
  "Not just written. Already scheduled.\nHere's how I turned a scattered week into a clear direction.",
  "SCATTERED. BUT DIRECTION.\nThe signal was always there — we just needed the right lens.",
  "Something's shifting in how early-stage teams read their own data.",
  "REFLECTIONS — captured at the right angle.\nA short note on what the numbers don't say out loud.",
  "BEYOND THE SURFACE.\nThree weeks of forecasting taught me more about trust than about math.",
  'What founders actually mean when they say "show me the model."',
  "The best financial model is the one nobody has to explain twice.",
  "Consistency isn't a content calendar. It's a decision you stop having to make.",
  "Early-stage data work is 10% modeling, 90% translation.",
];

const HASHTAG_POOL = ["#DataStorytelling", "#StartupFinance", "#BrandVoice"];

const IMAGE_POOL = [
  "/images/personas/self-default.jpg",
  "/images/personas/team-leader.jpg",
  "/images/personas/entrepreneur.jpg",
  "/images/personas/fashion-editor.jpg",
  "/images/personas/novelist.jpg",
];

export function createGeneratedPosts(count: number, startId: number): Post[] {
  return Array.from({ length: count }, (_, index) => {
    const contentType: PostContentType = index % 3 === 0 ? "text" : "image";
    const imageCount = contentType === "text" ? 0 : (index % 3) + 1;
    const images = Array.from(
      { length: imageCount },
      (_, imageIndex) => IMAGE_POOL[(index + imageIndex) % IMAGE_POOL.length]!,
    );

    return {
      id: `post-${startId + index}`,
      status: "draft",
      contentType,
      images,
      caption: CAPTION_POOL[index % CAPTION_POOL.length]!,
      hashtags: HASHTAG_POOL,
      platforms: ["linkedin"],
      date: "09.01.2026",
      time: "10:00 PM",
    };
  });
}

export const INITIAL_SLOTS: Omit<ScheduleSlot, "postId">[] = [
  { id: "slot-1", dayLabel: "Today", date: "Sep 01", time: "10:00 AM" },
  { id: "slot-2", dayLabel: "Today", date: "Sep 01", time: "02:25 PM" },
  { id: "slot-3", dayLabel: "Today", date: "Sep 01", time: "10:00 PM" },
  { id: "slot-4", dayLabel: "Tomorrow", date: "Sep 02", time: "11:00 AM" },
  { id: "slot-5", dayLabel: "Tomorrow", date: "Sep 02", time: "02:25 PM" },
  { id: "slot-6", dayLabel: "Tomorrow", date: "Sep 02", time: "09:00 PM" },
  { id: "slot-7", dayLabel: "Thursday", date: "Sep 03", time: "09:00 AM" },
  { id: "slot-8", dayLabel: "Thursday", date: "Sep 03", time: "01:00 PM" },
  { id: "slot-9", dayLabel: "Thursday", date: "Sep 03", time: "08:00 PM" },
];

export const INITIAL_POSTS: Post[] = createGeneratedPosts(9, 1);

const MORE_SLOT_DAY_LABELS = ["Friday", "Saturday", "Sunday"];
const MORE_SLOT_DATES = ["Sep 04", "Sep 05", "Sep 06"];
const MORE_SLOT_TIMES = ["10:00 AM", "02:25 PM", "09:00 PM"];

export function createMoreSlots(
  nextIndex: number,
): Omit<ScheduleSlot, "postId">[] {
  return MORE_SLOT_DAY_LABELS.flatMap((dayLabel, groupIndex) =>
    MORE_SLOT_TIMES.map((time, timeIndex) => ({
      id: `slot-${nextIndex + groupIndex * MORE_SLOT_TIMES.length + timeIndex}`,
      dayLabel,
      date: MORE_SLOT_DATES[groupIndex]!,
      time,
    })),
  );
}

export function parsePostDate(date: string): Date {
  const [month, day, year] = date.split(".").map(Number);
  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1);
}

export function formatPostDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${date.getFullYear()}`;
}

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
