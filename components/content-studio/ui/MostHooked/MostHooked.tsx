"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";

import { ProfileCard, type SelectOption } from "../ProfileCard";

import styles from "./MostHooked.module.css";

export type { SelectOption };

export interface MostHookedItem {
  /** Social handle shown as the row's title, e.g. "@cloedatascientist" */
  handle: string;
  /** Post summary shown under the handle */
  description: string;
  /** Like count */
  likes: number;
  /** Comment count */
  comments: number;
}

export interface MostHookedProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Self-profile portrait slot, forwarded to the embedded ProfileCard */
  children?: React.ReactNode;
  /** Figma `Open`, forwarded to the embedded ProfileCard */
  open?: boolean;
  /** Figma `Status=disabled`, forwarded to the embedded ProfileCard */
  disabled?: boolean;
  /** Bio text forwarded to the embedded ProfileCard */
  bio?: string;
  /** Image for the embedded ProfileCard's collapsed-row avatar */
  avatarSrc?: string;
  /** Alt text for the embedded ProfileCard's avatar/portrait placeholder */
  avatarAlt?: string;
  /** Options for the embedded ProfileCard's job-title select */
  options: SelectOption[];
  /** Select value when controlled */
  value?: string;
  /** Select initial value when uncontrolled */
  defaultValue?: string;
  /** Called when the select value changes */
  onValueChange?: (value: string) => void;
  /** Select trigger placeholder */
  placeholder?: string;
  /** Click handler for the embedded ProfileCard's goal icon button */
  onGoalClick?: () => void;
  /** Accessible label for the embedded ProfileCard's goal icon button */
  goalLabel?: string;
  /** Click handler for the embedded ProfileCard's shrink/expand toggle */
  onToggleOpen?: () => void;
  /** Accessible label for the embedded ProfileCard's shrink/expand toggle */
  toggleLabel?: string;
  /** Ranked top-performing posts, sorted by engagement. Omitted/empty renders the no-data state */
  items?: MostHookedItem[];
}

export function MostHooked({
  className,
  children,
  open,
  disabled,
  bio,
  avatarSrc,
  avatarAlt,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  onGoalClick,
  goalLabel,
  onToggleOpen,
  toggleLabel,
  items = [],
  ...props
}: MostHookedProps) {
  return (
    <div className={cn(styles.root, className)} {...props}>
      <ProfileCard
        open={open}
        disabled={disabled}
        bio={bio}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        onGoalClick={onGoalClick}
        goalLabel={goalLabel}
        onToggleOpen={onToggleOpen}
        toggleLabel={toggleLabel}
      >
        {children}
      </ProfileCard>

      {items.length === 0 ? (
        <div className={styles.emptyCard}>
          <MostHookedHeader />
          <div className={styles.emptyBody}>
            <div className={styles.emptyIconWrap}>
              <Icon id="hook-icon" className={styles.emptyIcon} />
            </div>
            <p className={styles.emptyTitle}>No posts tracked yet</p>
            <p className={styles.emptyDescription}>
              Publish content to discover which posts drive the most engagement
              and retention.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.listCard}>
          <MostHookedHeader />
          {items.map((item, index) => (
            <MostHookedRow
              key={`${item.handle}-${index}`}
              item={item}
              rank={index + 1}
              highlighted={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MostHookedHeader() {
  return (
    <div className={styles.header}>
      <p className={styles.title}>Top Performers</p>
      <p className={styles.subtitle}>Sorted by Engagement</p>
    </div>
  );
}

function MostHookedRow({
  item,
  rank,
  highlighted,
}: {
  item: MostHookedItem;
  rank: number;
  highlighted: boolean;
}) {
  return (
    <div className={styles.row} data-highlighted={highlighted || undefined}>
      <div className={styles.rowHeader}>
        <Icon id="linkedin-icon" className={styles.linkedinIcon} />
        <div className={styles.rowInfo}>
          <div className={styles.rowTitleLine}>
            <p className={styles.handle}>{item.handle}</p>
            <Badge variant={highlighted ? "alarm" : "outline"} size="20">
              {`#${rank}`}
            </Badge>
          </div>
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>
      <div className={styles.rowFooter}>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.stats}>
          <span className={styles.stat}>
            <Icon id="linkedinset-like-icon" className={styles.statIcon} />
            {item.likes}
          </span>
          <span className={styles.stat}>
            <Icon id="linkedinset-comment-icon" className={styles.statIcon} />
            {item.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
