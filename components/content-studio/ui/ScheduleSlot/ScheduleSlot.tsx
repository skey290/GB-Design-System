import * as React from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import styles from "./ScheduleSlot.module.css";

/** Figma `Type` — which kind of row content to show. */
export type ScheduleSlotType =
  "posted" | "scheduled" | "draft" | "archive" | "no content";

/** Figma `Status` — `disabled` only has a distinct look when `type="no content"`; other types render identically to `default`. */
export type ScheduleSlotStatus = "default" | "active" | "disabled";

export interface ScheduleSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which row content to render. */
  type?: ScheduleSlotType;
  /** Row highlight (`active`) or muted state (`disabled`, `no content` only). */
  status?: ScheduleSlotStatus;
  /** Scheduled time label, shown for every type except `archive`. */
  time?: string;
  /** Figma deleted-at label, shown only when `type="archive"`. */
  deletedDate?: string;
  /** Figma `Add post` boolean — shows the circular add trigger. Never renders when `type="archive"`. */
  showAddPost?: boolean;
  /** Click handler for the add-post trigger. */
  onAddPost?: () => void;
}

const BADGE_LABEL: Record<Exclude<ScheduleSlotType, "archive">, string> = {
  posted: "Posted",
  scheduled: "Scheduled",
  draft: "Draft",
  "no content": "No content",
};

export function ScheduleSlot({
  className,
  type = "posted",
  status = "default",
  time = "11:00 AM",
  deletedDate = "Deleted at 08:12 AM",
  showAddPost = false,
  onAddPost,
  onClick,
  onKeyDown,
  ...props
}: ScheduleSlotProps) {
  const isArchive = type === "archive";
  const isNoContent = type === "no content";
  const isMutedTime =
    type === "posted" || (isNoContent && status === "disabled");
  const isClickable = Boolean(onClick);

  return (
    <div
      className={cn(styles.root, className)}
      data-type={type}
      data-status={status}
      data-clickable={isClickable || undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!isClickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      {...props}
    >
      {isArchive ? (
        <span className={styles.deletedDate}>{deletedDate}</span>
      ) : (
        <>
          <div className={styles.timeWrap}>
            <span className={styles.time} data-muted={isMutedTime || undefined}>
              {time}
            </span>
          </div>
          {type === "draft" && (
            <Badge variant="reverse">{BADGE_LABEL.draft}</Badge>
          )}
          {type === "scheduled" && (
            <Badge variant="default">{BADGE_LABEL.scheduled}</Badge>
          )}
          {isNoContent && (
            <Badge variant="alarm">{BADGE_LABEL["no content"]}</Badge>
          )}
          {type === "posted" && (
            <Badge variant="outline">{BADGE_LABEL.posted}</Badge>
          )}
        </>
      )}
      {showAddPost && !isArchive && (
        <button
          type="button"
          className={styles.addPostButton}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onAddPost?.();
          }}
          aria-label="Add post"
        >
          <Plus
            className={styles.addPostIcon}
            strokeWidth={isNoContent || status === "active" ? 2 : 1}
          />
        </button>
      )}
    </div>
  );
}
