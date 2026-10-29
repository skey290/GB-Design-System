import * as React from "react";
import {
  type LucideIcon,
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Blocks,
  Bookmark,
  Calendar,
  CalendarCheck,
  ChartColumnBig,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleArrowOutUpRight,
  CircleCheck,
  CircleCheckBig,
  CircleDashed,
  CircleHelp,
  CircleX,
  CreditCard,
  Download,
  Ellipsis,
  EllipsisVertical,
  Equal,
  Eraser,
  FilePen,
  Globe,
  Goal,
  Heart,
  HeartHandshake,
  History,
  House,
  ImageOff,
  Images,
  Maximize,
  Megaphone,
  Menu,
  MessageCircleHeart,
  MessageCircleQuestionMark,
  MessagesSquare,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Pen,
  Play,
  Plus,
  Redo2,
  Replace,
  RotateCcw,
  Save,
  Search,
  SearchX,
  ServerOff,
  Settings,
  Settings2,
  Share2,
  Shield,
  Shrink,
  SkipBack,
  SkipForward,
  Smile,
  Sparkles,
  Trash2,
  TriangleAlert,
  Undo2,
  UserRound,
  UserRoundSearch,
  Volume2,
  Wand,
  X,
} from "lucide-react";

/**
 * Wraps a `/public/icons.svg` symbol in a component that renders the same way
 * a `LucideIcon` does (passing SVG props like className/aria-hidden straight
 * through). An adapter for plugging a Figma icon sprite directly into places
 * that pass icons as components typed `icon: LucideIcon`, like `GnbButton`
 * or `Pagination`.
 */
export function createSpriteIcon(symbolId: string): LucideIcon {
  function SpriteIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props}>
        <use href={`/icons.svg#${symbolId}`} />
      </svg>
    );
  }
  SpriteIcon.displayName = `SpriteIcon(${symbolId})`;
  return SpriteIcon as unknown as LucideIcon;
}

/**
 * Symbol ids held by `/public/icons.svg` — corresponds to Figma's
 * `Customized Icons` frame. Only includes icons with no lucide equivalent,
 * like brand logos and Gabrielle-specific concept icons. This list exists so
 * a literal union can be used instead of `icon?: string`, so update this
 * array whenever a symbol is added to or removed from icons.svg.
 */
export const SPRITE_ONLY_ICON_IDS = [
  "asset-icon",
  "crown-icon",
  "dot-bell-icon",
  "engagement-icon",
  "expand-close-icon",
  "expand-icon",
  "facebook-icon",
  "file-text-icon",
  "google-icon",
  "handle-icon",
  "hook-icon",
  "instagram-icon",
  "linkedin-icon",
  "linkedinset-comment-icon",
  "linkedinset-like-icon",
  "linkedinset-public-icon",
  "linkedinset-repost-icon",
  "linkedinset-send-icon",
  "meta-badge-icon",
  "meta-bookmark-icon",
  "meta-comment-icon",
  "meta-like-icon",
  "meta-more-icon",
  "meta-repost-icon",
  "meta-repost2-icon",
  "meta-share-icon",
  "meta-share2-icon",
  "no-file-pen-icon",
  "reach-and-engagement-icon",
  "reach-icon",
  "spinner-icon",
  "thread-icon",
  "tiktok-icon",
  "user-filled-icon",
  "xtwitter-icon",
  "xtwitterset-badge-icon",
  "xtwitterset-comment-icon",
  "xtwitterset-like-icon",
  "xtwitterset-retweet-icon",
  "xtwitterset-share-icon",
  "xtwitterset-view-icon",
  "youtube-icon",
] as const;

export type SpriteOnlyIconId = (typeof SPRITE_ONLY_ICON_IDS)[number];

/**
 * Symbol id → `lucide-react` component mapping — corresponds to Figma's
 * `Lucide Icons` frame. Ids listed here are not also kept in
 * `/public/icons.svg`. Components that take an arbitrary id through an
 * `icon` prop, like `Button`, fall back to the sprite for any id not in this map.
 */
export const LUCIDE_SPRITE_MAP = {
  "archive-icon": Archive,
  "arrow-left-icon": ArrowLeft,
  "arrow-right-icon": ArrowRight,
  "arrow-up-right-icon": ArrowUpRight,
  "bar-chart-big-icon": ChartColumnBig,
  "bell-icon": Bell,
  "blocks-icon": Blocks,
  "bookmark-icon": Bookmark,
  "calendar-check-icon": CalendarCheck,
  "calendar-icon": Calendar,
  "check-icon": Check,
  "chevron-down-icon": ChevronDown,
  "chevron-left-icon": ChevronLeft,
  "chevron-right-icon": ChevronRight,
  "chevron-up-icon": ChevronUp,
  "circle-arrow-out-up-right-icon": CircleArrowOutUpRight,
  "circle-check-big-icon": CircleCheckBig,
  "circle-check-icon": CircleCheck,
  "circle-dashed-icon": CircleDashed,
  "circle-help-icon": CircleHelp,
  "circle-x-icon": CircleX,
  "credit-card-icon": CreditCard,
  "download-icon": Download,
  "ellipsis-icon": Ellipsis,
  "ellipsis-vertical-icon": EllipsisVertical,
  "equal-icon": Equal,
  "eraser-icon": Eraser,
  "file-pen-icon": FilePen,
  "globe-icon": Globe,
  "goal-icon": Goal,
  "heart-handshake-icon": HeartHandshake,
  "heart-icon": Heart,
  "history-icon": History,
  "home-icon": House,
  "image-off-icon": ImageOff,
  "images-icon": Images,
  "maximize-icon": Maximize,
  "megaphone-icon": Megaphone,
  "menu-icon": Menu,
  "message-circle-heart-icon": MessageCircleHeart,
  "message-circle-question-icon": MessageCircleQuestionMark,
  "messages-square-icon": MessagesSquare,
  "minus-icon": Minus,
  "panel-left-close-icon": PanelLeftClose,
  "panel-left-open-icon": PanelLeftOpen,
  "pen-icon": Pen,
  "play-icon": Play,
  "plus-icon": Plus,
  "redo-2-icon": Redo2,
  "replace-icon": Replace,
  "rotate-ccw-icon": RotateCcw,
  "save-icon": Save,
  "search-icon": Search,
  "search-x-icon": SearchX,
  "server-off-icon": ServerOff,
  "settings-2-icon": Settings2,
  "settings-icon": Settings,
  "share-2-icon": Share2,
  "shield-icon": Shield,
  "shrink-icon": Shrink,
  "skip-back-icon": SkipBack,
  "skip-forward-icon": SkipForward,
  "smile-icon": Smile,
  "sparkles-icon": Sparkles,
  "trash-2-icon": Trash2,
  "triangle-alert-icon": TriangleAlert,
  "undo-2-icon": Undo2,
  "user-round-icon": UserRound,
  "user-search-icon": UserRoundSearch,
  "volume-2-icon": Volume2,
  "wand-icon": Wand,
  "x-icon": X,
} satisfies Record<string, LucideIcon>;

export type LucideIconId = keyof typeof LUCIDE_SPRITE_MAP;

/** The full set of icon ids an `icon` prop (e.g. on Button) can take — lucide mapping + sprite-only. */
export type IconId = LucideIconId | SpriteOnlyIconId;

export const ICON_IDS: readonly IconId[] = [
  ...(Object.keys(LUCIDE_SPRITE_MAP) as LucideIconId[]),
  ...SPRITE_ONLY_ICON_IDS,
];

/**
 * Resolves an `IconId` to its actual element — a lucide component if one is
 * mapped, otherwise an `<svg><use></svg>` reference into `/public/icons.svg`.
 * Lets call sites that only have a string id produce a `ReactNode` to hand to
 * components (e.g. `Button`) whose `icon` prop takes rendered elements.
 */
export function Icon({ id, className }: { id: IconId; className?: string }) {
  const LucideIconComponent = (
    LUCIDE_SPRITE_MAP as Record<string, LucideIcon | undefined>
  )[id];

  if (LucideIconComponent) {
    return <LucideIconComponent className={className} aria-hidden="true" />;
  }

  return (
    <svg className={className} aria-hidden="true">
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}
