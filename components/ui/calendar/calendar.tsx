"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

/**
 * 날짜 그리드 프리미티브. `DateSelect`/`RangeSelect`가 이 컴포넌트를 팝오버
 * 안에서 재사용한다. 날짜 계산은 네이티브 `Date`만 쓰고 외부 라이브러리에
 * 의존하지 않는다.
 *
 * `mode="single"` — Part/Calendar를 그대로 구현. 헤더의 월/연 라벨을 클릭하면
 * 월(3×4)/연(3×4) 선택 서브뷰로 전환되는 동작은 Figma에 정적 스냅샷만 있어
 * 표준 달력 위젯 UX로 설계했다:
 * - Month 서브뷰: "Sep" 토글이 채워지고 "2026"은 outline. 화살표는 연도를 ±1 이동.
 * - Year 서브뷰: "2026" 토글이 채워지고 "Sep"은 outline. 화살표는 12년 블록을
 *   ±12 이동. 시작 연도는 `Math.floor(year / 10) * 10 - 1`로 계산.
 * - 월/연 그리드 셀 자체는 강조(현재 값 표시) 없음 — Figma에 그 구분이 없다.
 *
 * `mode="range"` — Part/Range Calendar를 그대로 구현. 월/연 서브뷰 없이 정적
 * 2개월 그리드만 있고, 헤더는 좌측 [이전, 월라벨]/우측 [월라벨, 다음]+[연라벨]
 * 구조. range 시작/끝 셀은 `--background-bold`+`--text-invert`(시작=좌측만
 * 라운드, 끝=우측만 라운드), 중간 셀은 `--background-selected`+`--text-bold`
 * (라운드 없음) — Figma 실측 그대로.
 *
 * 컨테이너 배경은 `mode` 둘 다 루트가 `--background-overlay`이고, 헤더 월/연
 * 토글 버튼(비활성 상태)은 `--background-default`를 쓴다.
 *
 * 이벤트 점 3종(published/reserved/draft)은 Figma가 래스터 SVG로 표현했지만
 * 색상이 기존 시맨틱 토큰과 정확히 일치해(published→`--text-default`,
 * draft→`--border-warning`, reserved는 같은 색의 outline) 토큰 기반 CSS 원으로
 * 재현했다.
 *
 * "항상 다크" 원칙(Popover/Chatbox와 동일)은 이 컴포넌트가 아니라
 * `DateSelect`/`RangeSelect`의 팝오버 콘텐츠 래퍼에 적용된다 — `Calendar` 자체는
 * 시맨틱 토큰만 참조하는 순수 프리미티브다.
 */
export type CalendarEventType = "published" | "reserved" | "draft";

export interface CalendarRangeValue {
  from?: Date;
  to?: Date;
}

interface CalendarSharedProps {
  /** 날짜별 이벤트 마커. 키는 `yyyy-MM-dd` 형식 문자열 */
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

const HEADER_TOGGLE_BASE = cn(
  "flex h-[36px] shrink-0 items-center justify-center",
  "gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
  "text-sm-medium whitespace-nowrap transition-colors outline-none",
);

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
      className={cn(
        active &&
          "border-transparent bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]",
      )}
    >
      {label}
    </Button>
  );
}

const GRID_CELL_BASE =
  "flex h-[32px] w-[70px] shrink-0 items-center justify-center rounded-[var(--gb-radius-scale-md)] text-sm-regular text-[var(--gb-text-default)] outline-none";

function MonthYearGrid({
  items,
  onSelect,
}: {
  items: readonly string[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-x-0 gap-y-[var(--gb-spacing-1)]">
      {items.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(index)}
          className={GRID_CELL_BASE}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type RangeState = "start" | "end" | "both" | "middle" | null;

const EVENT_DOT_BASE =
  "absolute left-[14px] top-[24px] size-[4px] rounded-[var(--gb-radius-scale-full)]";

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

  let colorClassName: string;
  let radiusClassName = "rounded-[var(--gb-radius-scale-md)]";

  if (disabled) {
    colorClassName = "text-[var(--gb-text-static-gray)]";
  } else if (
    rangeState === "start" ||
    rangeState === "end" ||
    rangeState === "both"
  ) {
    colorClassName =
      "bg-[var(--gb-background-bold)] text-[var(--gb-text-invert)]";
    radiusClassName =
      rangeState === "both"
        ? "rounded-[var(--gb-radius-scale-md)]"
        : rangeState === "start"
          ? "rounded-l-[var(--gb-radius-scale-md)] rounded-r-none"
          : "rounded-r-[var(--gb-radius-scale-md)] rounded-l-none";
  } else if (rangeState === "middle") {
    colorClassName =
      "bg-[var(--gb-background-selected)] text-[var(--gb-text-bold)]";
    radiusClassName = "rounded-none";
  } else if (isSelected) {
    colorClassName =
      "bg-[var(--gb-background-selected)] text-[var(--gb-text-bold)]";
  } else if (isToday) {
    colorClassName =
      "bg-[var(--gb-background-bold)] text-[var(--gb-text-invert)]";
  } else if (isOtherMonth) {
    colorClassName = "text-[var(--gb-text-static-gray)]";
  } else {
    colorClassName = "text-[var(--gb-text-default)]";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected || rangeState !== null}
      onClick={() => onSelect(date)}
      className={cn(
        "relative flex size-[32px] shrink-0 flex-col items-center justify-center",
        "text-sm-regular outline-none disabled:cursor-not-allowed",
        radiusClassName,
        colorClassName,
      )}
    >
      <span>{date.getDate()}</span>
      {eventType && (
        <span
          aria-hidden="true"
          className={cn(
            EVENT_DOT_BASE,
            eventType === "draft" && "bg-[var(--gb-border-warning)]",
            eventType === "published" && "bg-[var(--gb-text-default)]",
            eventType === "reserved" &&
              "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-text-default)]",
          )}
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
    <div className="grid grid-cols-7 gap-x-0 gap-y-[var(--gb-spacing-1)]">
      {WEEKDAY_LABELS.map((label) => (
        <span
          key={label}
          className="flex h-[var(--gb-spacing-4)] w-[32px] shrink-0 items-center justify-center text-xs-regular text-[var(--gb-text-subtle)]"
        >
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

  // year 서브뷰 페이지 시작값 — Figma 스냅샷(2026 → 2019~2030)과 정확히 일치
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
        className={cn(
          "flex items-start justify-center gap-[var(--gb-spacing-4)]",
          "rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)]",
          "bg-[var(--gb-background-overlay)] p-[var(--gb-spacing-3)]",
          className,
        )}
      >
        <div className="flex w-fit flex-col items-end gap-[var(--gb-spacing-4)]">
          <div className="flex items-center gap-[var(--gb-spacing-1)]">
            <Button
              variant="icon-ghost"
              icon="chevron-left-icon"
              aria-label="Previous month"
              onClick={handlePrev}
            />
            <div
              className={cn(
                HEADER_TOGGLE_BASE,
                "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] bg-[var(--gb-background-default)] text-[var(--gb-text-default)]",
              )}
            >
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
        <div className="flex w-fit flex-col items-start gap-[var(--gb-spacing-4)]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[var(--gb-spacing-1)]">
              <div
                className={cn(
                  HEADER_TOGGLE_BASE,
                  "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] bg-[var(--gb-background-default)] text-[var(--gb-text-default)]",
                )}
              >
                {MONTH_LABELS[rightMonth.getMonth()]}
              </div>
              <Button
                variant="icon-ghost"
                icon="chevron-right-icon"
                aria-label="Next month"
                onClick={handleNext}
              />
            </div>
            <div
              className={cn(
                HEADER_TOGGLE_BASE,
                "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] bg-[var(--gb-background-default)] text-[var(--gb-text-default)]",
              )}
            >
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
      className={cn(
        "flex flex-col items-start gap-[var(--gb-spacing-4)]",
        "rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)]",
        "bg-[var(--gb-background-overlay)] p-[var(--gb-spacing-5)]",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Button
          variant="icon-ghost"
          icon="chevron-left-icon"
          aria-label="Previous"
          onClick={handlePrev}
        />
        <div className="flex items-center gap-[var(--gb-spacing-1)]">
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
          icon="chevron-right-icon"
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
