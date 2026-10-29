"use client";

import * as React from "react";
import { Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarRangeValue } from "@/components/ui/calendar";
import { RangeSelect } from "@/components/ui/range-select";
import { Scrollbar } from "@/components/ui/scrollbar";
import {
  ScheduleSlot,
  type ScheduleSlotProps,
} from "@/components/content-studio/ui/ScheduleSlot";
import { cn } from "@/lib/utils";

import styles from "./SchedulePanel.module.css";

/** Figma `Type` — which panel content to render. */
export type SchedulePanelType =
  "default" | "in process" | "no content" | "archived";

/** Figma `Status` — only `type="default"` has a distinct `disabled` look; the other three types bake their own interactive/non-interactive look into `type` itself. */
export type SchedulePanelStatus = "default" | "disabled";

/** One row inside a date group, rendered via `ScheduleSlot`. */
export type SchedulePanelSlot = ScheduleSlotProps & {
  /** React list key. Named `rowId` (not `id`) since `ScheduleSlotProps` already has a native `id?: string` HTML attribute. */
  rowId: string | number;
};

/** A date-grouped section of rows, e.g. "Today, Sep 01". Ignored when `type="no content"`. */
export interface SchedulePanelGroup {
  date: string;
  slots: SchedulePanelSlot[];
}

export interface SchedulePanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Which panel content to render. */
  type?: SchedulePanelType;
  /** Only changes rendering when `type="default"`. */
  status?: SchedulePanelStatus;
  /** Date-grouped rows. Ignored when `type="no content"`. */
  groups?: SchedulePanelGroup[];
  /** Range select value when controlled. */
  dateRange?: CalendarRangeValue;
  /** Range select initial value when uncontrolled. */
  defaultDateRange?: CalendarRangeValue;
  /** Called when the selected date range changes. */
  onDateRangeChange?: (range: CalendarRangeValue) => void;
  /** Settings gear button click handler. Hidden when `type="archived"`. */
  onOpenSettings?: () => void;
  /** "Schedule All Draft" click handler — shown for `type="default"`/`"in process"`. */
  onScheduleAllDraft?: () => void;
  /** "Create Your Brand-fit Post" click handler — `type="no content"` only. */
  onCreateBrandFitPost?: () => void;
  /** "Create More Post" footer click handler — `type="default"`/`"archived"` only. */
  onCreateMorePost?: () => void;
}

const EMPTY_GROUPS: SchedulePanelGroup[] = [];

export function SchedulePanel({
  className,
  type = "default",
  status = "default",
  groups = EMPTY_GROUPS,
  dateRange,
  defaultDateRange,
  onDateRangeChange,
  onOpenSettings,
  onScheduleAllDraft,
  onCreateBrandFitPost,
  onCreateMorePost,
  ...props
}: SchedulePanelProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });

  const updateThumb = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: 100 });
      return;
    }
    const heightPercent = (clientHeight / scrollHeight) * 100;
    const topPercent =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
    setThumb({ top: topPercent, height: heightPercent });
  }, []);

  React.useEffect(() => {
    updateThumb();
  }, [updateThumb, groups]);

  const isNoContent = type === "no content";
  const isArchived = type === "archived";
  const isInProcess = type === "in process";
  const isDisabledStatus = type === "default" && status === "disabled";
  const isHeaderDisabled = isInProcess || isDisabledStatus;
  const isFooterDisabled = isArchived || isDisabledStatus;
  const showScrollbar = thumb.height < 100;
  const showFooter = type === "default" || isArchived;

  return (
    <div
      className={cn(styles.root, className)}
      data-type={type}
      data-status={status}
      {...props}
    >
      {!isArchived && (
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <RangeSelect
              className={styles.rangeSelect}
              value={dateRange}
              defaultValue={defaultDateRange}
              onValueChange={onDateRangeChange}
              disabled={isHeaderDisabled}
            />
            <Button
              variant="icon"
              aria-label="Open schedule settings"
              icon={<Settings2 />}
              onClick={onOpenSettings}
              disabled={isHeaderDisabled}
            />
          </div>
          {isNoContent ? (
            <Button
              variant="primary"
              className={styles.fullWidthButton}
              onClick={onCreateBrandFitPost}
            >
              Create Your Brand-fit Post
            </Button>
          ) : (
            <Button
              variant="primary"
              className={styles.fullWidthButton}
              onClick={onScheduleAllDraft}
              disabled={isHeaderDisabled}
            >
              Schedule All Draft
            </Button>
          )}
        </div>
      )}

      {isArchived && (
        <div className={styles.archivedHeader}>
          <RangeSelect
            className={styles.rangeSelect}
            value={dateRange}
            defaultValue={defaultDateRange}
            onValueChange={onDateRangeChange}
          />
        </div>
      )}

      {isNoContent ? (
        <p className={styles.emptyState}>No Post Created</p>
      ) : (
        <div className={styles.body}>
          <div
            ref={listRef}
            onScroll={updateThumb}
            className={styles.groupsList}
          >
            {groups.map((group) => (
              <div key={group.date} className={styles.group}>
                <p className={styles.groupTitle}>{group.date}</p>
                {group.slots.map(({ rowId, ...slot }) => (
                  <ScheduleSlot key={rowId} {...slot} />
                ))}
              </div>
            ))}
          </div>
          {showScrollbar && (
            <Scrollbar
              className={styles.scrollbar}
              thumbTop={thumb.top}
              thumbHeight={thumb.height}
            />
          )}
        </div>
      )}

      {showFooter && (
        <Button
          variant="outline"
          className={styles.fullWidthButton}
          icon={<Plus />}
          onClick={onCreateMorePost}
          disabled={isFooterDisabled}
        >
          Create More Post
        </Button>
      )}
    </div>
  );
}
