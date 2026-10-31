"use client";

import * as React from "react";
import { Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarRangeValue } from "@/components/ui/calendar";
import { Chips } from "@/components/ui/chips";
import { RangeSelect } from "@/components/ui/range-select";
import { Scrollbar } from "@/components/ui/scrollbar";
import {
  ScheduleSlot,
  type ScheduleSlotProps,
} from "@/components/screens/content-studio/ui/ScheduleSlot";
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
  /** Date-grouped rows (controlled). When provided, the panel never mutates it internally — `onAddSchedule` must be handled by the parent to actually add a row. Ignored when `type="no content"`. */
  groups?: SchedulePanelGroup[];
  /** Initial date-grouped rows for uncontrolled usage. Ignored when `groups` is provided. When `groups` is omitted, the panel manages its own list and appends `extendDays` new date groups (each with `occurrencesPerDay` empty `type="no content"` slots) when "Add Schedule" is clicked. */
  defaultGroups?: SchedulePanelGroup[];
  /** How many new date groups "Add Schedule" appends per click, uncontrolled only. */
  extendDays?: number;
  /** How many empty slots each newly-appended day gets. */
  occurrencesPerDay?: number;
  /** Anchor time ("hh:mm AM/PM") for the first new slot each appended day; later ones spread automatically 6 hours apart. */
  startTime?: string;
  /** Range select value when controlled. */
  dateRange?: CalendarRangeValue;
  /** Range select initial value when uncontrolled. */
  defaultDateRange?: CalendarRangeValue;
  /** Called when the selected date range changes. */
  onDateRangeChange?: (range: CalendarRangeValue) => void;
  /** Settings gear button click handler. Hidden when `type="archived"`. */
  onOpenSettings?: () => void;
  /** Header "Create Posts" button click handler — shown for `type="default"`/`"in process"`. */
  onCreatePosts?: () => void;
  /** "Schedule All Draft" chip click handler, shown next to the "Schedule created" title above the date list — `type="default"`/`"in process"` only, and disabled when no row is currently `type="draft"`. Always called regardless of controlled/uncontrolled; when uncontrolled, the panel also turns every `type="draft"` slot into `type="scheduled"` itself. */
  onScheduleAllDraft?: () => void;
  /** "Create Your Brand-fit Post" click handler — `type="no content"` only. */
  onCreateBrandFitPost?: () => void;
  /** "Add Schedule" footer click handler — `type="default"`/`"archived"` only. */
  onAddSchedule?: () => void;
  /** Which row is highlighted (`status="active"`), controlled. Every row — including `type="archive"` — is clickable. */
  selectedRowId?: string | number | null;
  /** Initial highlighted row, uncontrolled. */
  defaultSelectedRowId?: string | number | null;
  /** Called with the full slot whenever any row is clicked. */
  onSlotClick?: (slot: SchedulePanelSlot) => void;
  /** Called with the full slot when its hover-revealed delete trigger is clicked (`type="no content"`/`"draft"`/`"scheduled"` only). Always called regardless of controlled/uncontrolled; when uncontrolled, the panel also removes the row itself. */
  onSlotDelete?: (slot: SchedulePanelSlot) => void;
}

const EMPTY_GROUPS: SchedulePanelGroup[] = [];

const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatGroupDateLabel(date: Date): string {
  const weekday = WEEKDAY_LONG[date.getDay()];
  const month = MONTH_SHORT[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  return `${weekday}, ${month} ${day}`;
}

/** Parses a `ScheduleSlot`-style "hh:mm AM/PM" label into minutes since midnight. */
function parseTimeToMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;
  const [, hourStr, minuteStr, period] = match;
  const hour = Number(hourStr) % 12;
  return (
    hour * 60 + Number(minuteStr) + (period.toUpperCase() === "PM" ? 720 : 0)
  );
}

function formatMinutesToTime(totalMinutes: number): string {
  const minutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

const OCCURRENCE_INTERVAL_MINUTES = 6 * 60;

/** Spreads `occurrencesPerDay` times across a day, `startTime` first and each later one 6 hours after the previous. */
function generateOccurrenceTimes(
  startTime: string,
  occurrencesPerDay: number,
): string[] {
  const startMinutes = parseTimeToMinutes(startTime);
  return Array.from({ length: occurrencesPerDay }, (_, index) =>
    formatMinutesToTime(startMinutes + OCCURRENCE_INTERVAL_MINUTES * index),
  );
}

export function SchedulePanel({
  className,
  type = "default",
  status = "default",
  groups: controlledGroups,
  defaultGroups = EMPTY_GROUPS,
  extendDays = 3,
  occurrencesPerDay = 3,
  startTime = "09:00 AM",
  dateRange,
  defaultDateRange,
  onDateRangeChange,
  onOpenSettings,
  onCreatePosts,
  onScheduleAllDraft,
  onCreateBrandFitPost,
  onAddSchedule,
  selectedRowId: controlledSelectedRowId,
  defaultSelectedRowId = null,
  onSlotClick,
  onSlotDelete,
  ...props
}: SchedulePanelProps) {
  const isControlled = controlledGroups !== undefined;
  const [internalGroups, setInternalGroups] = React.useState(defaultGroups);
  const groups = isControlled ? controlledGroups : internalGroups;
  const nextNewRowId = React.useRef(0);
  const dateAnchorRef = React.useRef<Date | null>(null);
  const daysAddedRef = React.useRef(0);

  const isSelectionControlled = controlledSelectedRowId !== undefined;
  const [internalSelectedRowId, setInternalSelectedRowId] =
    React.useState(defaultSelectedRowId);
  const selectedRowId = isSelectionControlled
    ? controlledSelectedRowId
    : internalSelectedRowId;

  const handleSlotClick = React.useCallback(
    (slot: SchedulePanelSlot) => {
      if (!isSelectionControlled) {
        setInternalSelectedRowId(slot.rowId);
      }
      onSlotClick?.(slot);
    },
    [isSelectionControlled, onSlotClick],
  );

  const handleAddSchedule = React.useCallback(() => {
    if (!isControlled) {
      if (dateAnchorRef.current === null) {
        const base = dateRange?.to ?? defaultDateRange?.to ?? new Date();
        dateAnchorRef.current = new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
        );
      }
      const anchor = dateAnchorRef.current;
      const startDay = daysAddedRef.current;
      const occurrenceTimes = generateOccurrenceTimes(
        startTime,
        occurrencesPerDay,
      );

      const newGroups: SchedulePanelGroup[] = Array.from(
        { length: extendDays },
        (_, dayIndex): SchedulePanelGroup => {
          const date = new Date(anchor);
          date.setDate(date.getDate() + startDay + dayIndex + 1);
          return {
            date: formatGroupDateLabel(date),
            slots: occurrenceTimes.map((time): SchedulePanelSlot => {
              nextNewRowId.current += 1;
              return {
                rowId: `new-${nextNewRowId.current}`,
                type: "no content",
                time,
              };
            }),
          };
        },
      );

      daysAddedRef.current = startDay + extendDays;
      setInternalGroups((prev) => [...prev, ...newGroups]);
    }
    onAddSchedule?.();
  }, [
    isControlled,
    onAddSchedule,
    extendDays,
    occurrencesPerDay,
    startTime,
    dateRange,
    defaultDateRange,
  ]);

  const handleScheduleAllDraft = React.useCallback(() => {
    if (!isControlled) {
      setInternalGroups((prev) =>
        prev.map((group) => ({
          ...group,
          slots: group.slots.map((slot) =>
            slot.type === "draft" ? { ...slot, type: "scheduled" } : slot,
          ),
        })),
      );
    }
    onScheduleAllDraft?.();
  }, [isControlled, onScheduleAllDraft]);

  const handleSlotDelete = React.useCallback(
    (slot: SchedulePanelSlot) => {
      if (!isControlled) {
        setInternalGroups((prev) =>
          prev
            .map((group) => ({
              ...group,
              slots: group.slots.filter((s) => s.rowId !== slot.rowId),
            }))
            .filter((group) => group.slots.length > 0),
        );
      }
      onSlotDelete?.(slot);
    },
    [isControlled, onSlotDelete],
  );

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

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(updateThumb);
    observer.observe(list);
    return () => observer.disconnect();
  }, [updateThumb]);

  const isNoContent = type === "no content";
  const isArchived = type === "archived";
  const isInProcess = type === "in process";
  const isDisabledStatus = type === "default" && status === "disabled";
  const isHeaderDisabled = isInProcess || isDisabledStatus;
  const isFooterDisabled = isArchived || isDisabledStatus;
  const hasDraftSlots = groups.some((group) =>
    group.slots.some((slot) => slot.type === "draft"),
  );
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
              onClick={onCreatePosts}
              disabled={isHeaderDisabled}
            >
              Create Posts
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
          <div className={styles.listColumn}>
            {!isArchived && (
              <div className={styles.sectionHeader}>
                <p className={styles.sectionTitle}>Schedule created</p>
                <Chips
                  variant="secondary"
                  size="sm"
                  onClick={handleScheduleAllDraft}
                  disabled={isHeaderDisabled || !hasDraftSlots}
                >
                  Schedule All Draft
                </Chips>
              </div>
            )}
            <div
              ref={listRef}
              onScroll={updateThumb}
              className={styles.groupsList}
            >
              {groups.map((group) => (
                <div key={group.date} className={styles.group}>
                  <p className={styles.groupTitle}>{group.date}</p>
                  {group.slots.map((slot) => {
                    const { rowId, status: slotStatus, ...rest } = slot;
                    const isSelected = rowId === selectedRowId;
                    return (
                      <ScheduleSlot
                        key={rowId}
                        {...rest}
                        status={
                          slotStatus ?? (isSelected ? "active" : "default")
                        }
                        onClick={() => handleSlotClick(slot)}
                        onDelete={() => handleSlotDelete(slot)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {showScrollbar && (
            <Scrollbar thumbTop={thumb.top} thumbHeight={thumb.height} />
          )}
        </div>
      )}

      {showFooter && (
        <Button
          variant="outline"
          className={styles.fullWidthButton}
          icon={<Plus />}
          onClick={handleAddSchedule}
          disabled={isFooterDisabled}
        >
          Add Schedule
        </Button>
      )}
    </div>
  );
}
