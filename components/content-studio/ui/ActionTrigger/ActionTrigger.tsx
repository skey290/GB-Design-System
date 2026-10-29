import * as React from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";

import styles from "./ActionTrigger.module.css";

/** Figma `Type`. */
export type ActionTriggerType = "full" | "empty";

/** One row in the "Action Items" list. */
export interface ActionTriggerItem {
  /** Row title, e.g. "Empty Slot on Jul 2" */
  label: string;
  /** Supporting copy below the header row */
  description: string;
  badgeLabel: string;
  /** Default `"default"` (black "Brand Goal" look) */
  badgeVariant?: BadgeVariant;
  /** Default `"Create a post"` */
  actionLabel?: string;
  onAction?: () => void;
}

export interface ActionTriggerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Type` */
  type?: ActionTriggerType;
  /** "Action Items" card title */
  title?: string;
  /** Row data, in display order. The "N items" count is derived from this array's length */
  items?: ActionTriggerItem[];
  /** "Action Items" card footer caption */
  footerCaption?: string;
  /** "Why don't you try this?" card title */
  recommendationTitle?: string;
  /** AI recommendation headline under the skeleton placeholder */
  recommendationHeadline?: string;
  /** AI recommendation supporting copy under the headline */
  recommendationDescription?: string;
  /** Default `"Try it out"` */
  recommendationActionLabel?: string;
  onTryItOut?: () => void;
  /** `type="empty"` title, e.g. "No post yet" */
  emptyTitle?: string;
  /** `type="empty"` description */
  emptyDescription?: string;
  /** Default `"Create posts"` */
  emptyActionLabel?: string;
  onCreatePosts?: () => void;
}

const DEFAULT_ITEMS: ActionTriggerItem[] = [
  {
    label: "Empty Slot on Jul 2",
    description: 'AI topic suggestion ready — "Leading without authority."',
    badgeLabel: "Draft",
    badgeVariant: "alarm",
  },
  {
    label: "Influential voice gap",
    description:
      "Not detected in your 'Self' match. Try a post that stakes your POV on sustainable fashion.",
    badgeLabel: "Brand Goal",
  },
  {
    label: "Niche leader signal weak",
    description:
      "Your sustainable fashion niche isn't coming through clearly. Consider a post that owns your specific angle.",
    badgeLabel: "Brand Goal",
  },
];

function ItemRow({ item }: { item: ActionTriggerItem }) {
  return (
    <div className={styles.itemRow}>
      <div className={styles.itemHeader}>
        <Icon id="circle-check-icon" className={styles.itemHeaderIcon} />
        <p className={styles.itemLabel}>{item.label}</p>
        <Badge variant={item.badgeVariant ?? "default"} size="20">
          {item.badgeLabel}
        </Badge>
      </div>
      <p className={styles.itemDescription}>{item.description}</p>
      <Button
        variant="mute"
        className={styles.itemAction}
        onClick={item.onAction}
      >
        {item.actionLabel ?? "Create a post"}
      </Button>
    </div>
  );
}

export function ActionTrigger({
  className,
  type = "full",
  title = "Action Items",
  items = DEFAULT_ITEMS,
  footerCaption = "Updated daily · Prioritized by urgency",
  recommendationTitle = "Why don't you try this?",
  recommendationHeadline = "Turn expertise into authority",
  recommendationDescription = "Your sustainable fashion niche isn't landing yet. Let AI draft a post that stakes your POV.",
  recommendationActionLabel = "Try it out",
  onTryItOut,
  emptyTitle = "No post yet",
  emptyDescription = "You haven't generated any posts yet.\nCreate a post at the content studio to get started.",
  emptyActionLabel = "Create posts",
  onCreatePosts,
  ...props
}: ActionTriggerProps) {
  const isEmpty = type === "empty";

  return (
    <div className={cn(styles.root, className)} data-type={type} {...props}>
      {isEmpty ? (
        <>
          <p className={styles.title}>{title}</p>
          <div className={styles.emptyBox}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyHeader}>
                <Icon id="circle-dashed-icon" className={styles.emptyIcon} />
                <p className={styles.emptyLabel}>{emptyTitle}</p>
              </div>
              <p className={styles.emptyDescription}>{emptyDescription}</p>
            </div>
            <Button
              variant="primary"
              className={styles.emptyAction}
              onClick={onCreatePosts}
            >
              {emptyActionLabel}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.title}>{title}</p>
              <div className={styles.itemsCountWrap}>
                <p className={styles.itemsCount}>{`${items.length} items`}</p>
              </div>
            </div>
            <div className={styles.itemList}>
              {items.map((item) => (
                <ItemRow key={item.label} item={item} />
              ))}
              <p className={styles.footerCaption}>{footerCaption}</p>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.title}>{recommendationTitle}</p>
            <Skeleton
              type="rectangle"
              className={styles.recommendationSkeleton}
            />
            <div className={styles.recommendationTextBlock}>
              <p className={styles.recommendationHeadline}>
                {recommendationHeadline}
              </p>
              <p className={styles.recommendationDescription}>
                {recommendationDescription}
              </p>
            </div>
            <Button
              variant="mute"
              className={styles.recommendationAction}
              onClick={onTryItOut}
            >
              {recommendationActionLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
