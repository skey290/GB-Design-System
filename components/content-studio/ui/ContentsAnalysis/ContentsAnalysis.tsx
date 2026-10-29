import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Calendar, type CalendarEventType } from "@/components/ui/calendar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Icon } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";

import styles from "./ContentsAnalysis.module.css";

/** Figma `Style`. */
export type ContentsAnalysisVariant = "expanded" | "empty";

/** One row in the weekly-goal progress list. */
export interface ContentsAnalysisGoal {
  /** Row label, e.g. "Weekly Goal Progress" */
  label: string;
  /** Current progress amount, also drives the bar fill via `current / target` */
  current: number;
  /** Target amount the bar fills up to */
  target: number;
  /** Trailing value text format: "75%" vs "2/3". Default "percent" */
  format?: "percent" | "fraction";
}

export interface ContentsAnalysisProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Style` */
  variant?: ContentsAnalysisVariant;
  /** "Total" headline number, `variant="expanded"` only */
  postsThisMonth?: number;
  /** Delta badge text next to `postsThisMonth`, e.g. "+5" */
  postsDelta?: string;
  /** Weekly goal progress rows, in display order */
  goals?: ContentsAnalysisGoal[];
  /** Per-date event markers forwarded to the embedded Calendar. Keys are `yyyy-MM-dd` strings */
  calendarEvents?: Record<string, CalendarEventType>;
  /** Empty-state title, `variant="empty"` only */
  emptyTitle?: string;
  /** Empty-state description, `variant="empty"` only */
  emptyDescription?: string;
}

const EMPTY_EVENTS: Record<string, CalendarEventType> = {};

const DEFAULT_GOALS: ContentsAnalysisGoal[] = [
  {
    label: "Weekly Goal Progress",
    current: 75,
    target: 100,
    format: "percent",
  },
  { label: "Posting Frequency", current: 2, target: 3, format: "fraction" },
  { label: "Tone consistency", current: 75, target: 100, format: "percent" },
];

function GoalRow({ goal }: { goal: ContentsAnalysisGoal }) {
  const { label, current, target, format = "percent" } = goal;
  const valueText =
    format === "fraction"
      ? `${current}/${target}`
      : `${target === 0 ? 0 : Math.round((current / target) * 100)}%`;

  return (
    <div className={styles.goalRow}>
      <p className={styles.goalLabel}>{label}</p>
      <div className={styles.goalBarRow}>
        <ProgressBar
          className={styles.goalBarTrack}
          value={current}
          max={target || 100}
          aria-label={label}
        />
        <span className={styles.goalValue}>{valueText}</span>
      </div>
    </div>
  );
}

function LegendItem({
  type,
  label,
}: {
  type: CalendarEventType;
  label: string;
}) {
  return (
    <div className={styles.legendItem}>
      <span aria-hidden="true" data-event={type} className={styles.legendDot} />
      <span data-event={type} className={styles.legendLabel}>
        {label}
      </span>
    </div>
  );
}

export function ContentsAnalysis({
  className,
  variant = "empty",
  postsThisMonth = 15,
  postsDelta = "+5",
  goals = DEFAULT_GOALS,
  calendarEvents = EMPTY_EVENTS,
  emptyTitle = "No uploads in June",
  emptyDescription = "Connect your calendar or drafts to start tracking weekly goals.",
  ...props
}: ContentsAnalysisProps) {
  const isEmpty = variant === "empty";

  return (
    <div
      className={cn(styles.root, className)}
      data-variant={variant}
      {...props}
    >
      <div className={styles.header}>
        <p className={styles.title}>Posts This Month</p>
        <Icon id="calendar-icon" className={styles.headerIcon} />
      </div>

      {isEmpty ? (
        <div className={styles.emptyBody}>
          <div className={styles.emptyIconWrap}>
            <Icon id="calendar-check-icon" className={styles.emptyIcon} />
          </div>
          <p className={styles.emptyTitle}>{emptyTitle}</p>
          <p className={styles.emptyDescription}>{emptyDescription}</p>
        </div>
      ) : (
        <>
          <div className={styles.totalBlock}>
            <p className={styles.totalLabel}>Total</p>
            <p className={styles.totalValue}>{postsThisMonth}</p>
            <div className={styles.deltaRow}>
              <Badge variant="alarm" size="20">
                {postsDelta}
              </Badge>
              <span className={styles.deltaCaption}>from last month</span>
            </div>
          </div>

          <div className={styles.goalsList}>
            {goals.map((goal) => (
              <GoalRow key={goal.label} goal={goal} />
            ))}
          </div>

          <div className={styles.calendarSection}>
            <Calendar
              mode="single"
              events={calendarEvents}
              className={styles.calendarFill}
            />
            <div className={styles.legendRow}>
              <LegendItem type="published" label="Published" />
              <LegendItem type="reserved" label="Reserved" />
              <LegendItem type="draft" label="Draft" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
