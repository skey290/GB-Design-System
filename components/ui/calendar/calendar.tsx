"use client";

import * as React from "react";

import { Button } from "@/components/ui/button/button";
import { Icon } from "@/lib/sprite-icon";

import styles from "./calendar.module.css";

/**
 * Date grid primitive. `DateSelect`/`RangeSelect` reuse this component
 * inside a popover. See `docs/components/calendar.md` for the full spec.
 */
export type CalendarEventType = "published" | "reserved" | "draft";

export interface CalendarRangeValue {
  from?: Date;
  to?: Date;
}

interface CalendarSharedProps {
  /** Per-date event markers. Keys are `yyyy-MM-dd` strings */
  events?: Record<string, CalendarEventType>;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export type CalendarProps = CalendarSharedProps &
  (
    | {
        mode: "single";
        value?: Date;
        onValueChange?: (date: Date) => void;
      }
    | {
        mode: "range";
        value?: CalendarRangeValue;
        onValueChange?: (range: CalendarRangeValue) => void;
      }
  );

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTH_LABELS = [
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
] as const;

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addYears(date: Date, amount: number): Date {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthMatrix(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  return Array.from(
    { length: 42 },
    (_, i) =>
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i,
      ),
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
): boolean {
  const target = stripTime(date);
  if (minDate && target < stripTime(minDate)) return true;
  if (maxDate && target > stripTime(maxDate)) return true;
  if (disabledDates?.some((d) => isSameDay(d, target))) return true;
  return false;
}

function HeaderToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      aria-pressed={active}
      isSelected={active}
    >
      {label}
    </Button>
  );
}

function MonthYearGrid({
  items,
  onSelect,
}: {
  items: readonly string[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className={styles.monthYearGrid}>
      {items.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(index)}
          className={styles.gridCell}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type RangeState = "start" | "end" | "both" | "middle" | null;

interface DateCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  isToday: boolean;
  rangeState: RangeState;
  eventType?: CalendarEventType;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onSelect: (date: Date) => void;
}

function DateCell({
  date,
  currentMonth,
  isSelected,
  isToday,
  rangeState,
  eventType,
  minDate,
  maxDate,
  disabledDates,
  onSelect,
}: DateCellProps) {
  const isOtherMonth = date.getMonth() !== currentMonth.getMonth();
  const disabled = isDateDisabled(date, minDate, maxDate, disabledDates);
  const isRangeEdge =
    rangeState === "start" || rangeState === "end" || rangeState === "both";

  // On a dark surface (selected / range edges), the event dot also needs an inverted color to stay visible.
  const hasInvertedSurface = !disabled && (isSelected || isRangeEdge);

  // disabled takes priority over every other state, and the rest are mutually exclusive — only one attribute is ever set.
  let dataRangeState: RangeState | undefined;
  let dataSelected: true | undefined;
  let dataToday: true | undefined;
  let dataOtherMonth: true | undefined;
  if (!disabled) {
    if (isRangeEdge || rangeState === "middle") {
      dataRangeState = rangeState;
    } else if (isSelected) {
      dataSelected = true;
    } else if (isToday) {
      dataToday = true;
    } else if (isOtherMonth) {
      dataOtherMonth = true;
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected || rangeState !== null}
      onClick={() => onSelect(date)}
      data-range-state={dataRangeState ?? undefined}
      data-selected={dataSelected}
      data-today={dataToday}
      data-other-month={dataOtherMonth}
      className={styles.cell}
    >
      <span>{date.getDate()}</span>
      {eventType && (
        <span
          aria-hidden="true"
          data-event={eventType}
          data-inverted={hasInvertedSurface || undefined}
          className={styles.eventDot}
        />
      )}
    </button>
  );
}

interface DateGridProps {
  currentMonth: Date;
  events?: Record<string, CalendarEventType>;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  today: Date;
  getSelectionState: (date: Date) => {
    isSelected: boolean;
    rangeState: RangeState;
  };
  onSelect: (date: Date) => void;
}

function DateGrid({
  currentMonth,
  events,
  minDate,
  maxDate,
  disabledDates,
  today,
  getSelectionState,
  onSelect,
}: DateGridProps) {
  const matrix = React.useMemo(
    () => getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  return (
    <div className={styles.dateGrid}>
      {WEEKDAY_LABELS.map((label) => (
        <span key={label} className={styles.weekdayLabel}>
          {label}
        </span>
      ))}
      {matrix.map((date) => {
        const { isSelected, rangeState } = getSelectionState(date);
        return (
          <DateCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentMonth}
            isSelected={isSelected}
            isToday={isSameDay(date, today)}
            rangeState={rangeState}
            eventType={events?.[toDateKey(date)]}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

export function Calendar(props: CalendarProps) {
  const { events, minDate, maxDate, disabledDates, className } = props;
  const today = React.useMemo(() => new Date(), []);

  const [viewDate, setViewDate] = React.useState<Date>(() => {
    if (props.mode === "single" && props.value)
      return startOfMonth(props.value);
    if (props.mode === "range" && props.value?.from)
      return startOfMonth(props.value.from);
    return startOfMonth(today);
  });
  const [subView, setSubView] = React.useState<"date" | "month" | "year">(
    "date",
  );

  // Start the decade range one year early to fill all 12 cells (2026 → 2019~2030).
  const yearPageStart = Math.floor(viewDate.getFullYear() / 10) * 10 - 1;
  const yearItems = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(yearPageStart + i)),
    [yearPageStart],
  );

  const handlePrev = () => {
    if (subView === "date") setViewDate((prev) => addMonths(prev, -1));
    else if (subView === "month") setViewDate((prev) => addYears(prev, -1));
    else setViewDate((prev) => addYears(prev, -12));
  };

  const handleNext = () => {
    if (subView === "date") setViewDate((prev) => addMonths(prev, 1));
    else if (subView === "month") setViewDate((prev) => addYears(prev, 1));
    else setViewDate((prev) => addYears(prev, 12));
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setSubView("date");
  };

  const handleSelectYear = (index: number) => {
    setViewDate((prev) => new Date(yearPageStart + index, prev.getMonth(), 1));
    setSubView("date");
  };

  const handleSelectSingleDate = (date: Date) => {
    if (props.mode !== "single") return;
    props.onValueChange?.(date);
    if (
      date.getMonth() !== viewDate.getMonth() ||
      date.getFullYear() !== viewDate.getFullYear()
    ) {
      setViewDate(startOfMonth(date));
    }
  };

  const handleSelectRangeDate = (date: Date) => {
    if (props.mode !== "range") return;
    const { from, to } = props.value ?? {};
    if (!from || (from && to)) {
      props.onValueChange?.({ from: date, to: undefined });
      return;
    }
    if (date < from) {
      props.onValueChange?.({ from: date, to: from });
      return;
    }
    props.onValueChange?.({ from, to: date });
  };

  if (props.mode === "range") {
    const from = props.value?.from;
    const to = props.value?.to;
    const leftMonth = viewDate;
    const rightMonth = addMonths(viewDate, 1);

    const getSelectionState = (date: Date) => {
      const isStart = isSameDay(date, from);
      const isEnd = isSameDay(date, to);
      const inBetween =
        !!from &&
        !!to &&
        date.getTime() > from.getTime() &&
        date.getTime() < to.getTime();
      let rangeState: RangeState = null;
      if (isStart && isEnd) rangeState = "both";
      else if (isStart) rangeState = "start";
      else if (isEnd) rangeState = "end";
      else if (inBetween) rangeState = "middle";
      return { isSelected: false, rangeState };
    };

    return (
      <div
        className={className ? `${styles.rangeRoot} ${className}` : styles.rangeRoot}
      >
        <div className={styles.rangeColumnLeft}>
          <div className={styles.headerGroup}>
            <Button
              variant="icon-ghost"
              icon={<Icon id="chevron-left-icon" />}
              aria-label="Previous month"
              onClick={handlePrev}
            />
            <div className={styles.headerLabel}>
              {MONTH_LABELS[leftMonth.getMonth()]}
            </div>
          </div>
          <DateGrid
            currentMonth={leftMonth}
            events={events}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            today={today}
            getSelectionState={getSelectionState}
            onSelect={handleSelectRangeDate}
          />
        </div>
        <div className={styles.rangeColumnRight}>
          <div className={styles.headerRowBetween}>
            <div className={styles.headerGroup}>
              <div className={styles.headerLabel}>
                {MONTH_LABELS[rightMonth.getMonth()]}
              </div>
              <Button
                variant="icon-ghost"
                icon={<Icon id="chevron-right-icon" />}
                aria-label="Next month"
                onClick={handleNext}
              />
            </div>
            <div className={styles.headerLabel}>
              {rightMonth.getFullYear()}
            </div>
          </div>
          <DateGrid
            currentMonth={rightMonth}
            events={events}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            today={today}
            getSelectionState={getSelectionState}
            onSelect={handleSelectRangeDate}
          />
        </div>
      </div>
    );
  }

  const value = props.value;
  const getSelectionState = (date: Date) => ({
    isSelected: isSameDay(date, value),
    rangeState: null as RangeState,
  });

  return (
    <div
      className={className ? `${styles.singleRoot} ${className}` : styles.singleRoot}
    >
      <div className={styles.headerRowBetween}>
        <Button
          variant="icon-ghost"
          icon={<Icon id="chevron-left-icon" />}
          aria-label="Previous"
          onClick={handlePrev}
        />
        <div className={styles.headerGroup}>
          <HeaderToggleButton
            label={MONTH_LABELS[viewDate.getMonth()]}
            active={subView === "month"}
            onClick={() =>
              setSubView((prev) => (prev === "month" ? "date" : "month"))
            }
          />
          <HeaderToggleButton
            label={String(viewDate.getFullYear())}
            active={subView === "year"}
            onClick={() =>
              setSubView((prev) => (prev === "year" ? "date" : "year"))
            }
          />
        </div>
        <Button
          variant="icon-ghost"
          icon={<Icon id="chevron-right-icon" />}
          aria-label="Next"
          onClick={handleNext}
        />
      </div>

      {subView === "month" && (
        <MonthYearGrid items={MONTH_LABELS} onSelect={handleSelectMonth} />
      )}
      {subView === "year" && (
        <MonthYearGrid items={yearItems} onSelect={handleSelectYear} />
      )}
      {subView === "date" && (
        <DateGrid
          currentMonth={viewDate}
          events={events}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          today={today}
          getSelectionState={getSelectionState}
          onSelect={handleSelectSingleDate}
        />
      )}
    </div>
  );
}
