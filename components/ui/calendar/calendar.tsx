"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

/**
 * Figma "Calendar" 페이지(node-id 7219:10699, ❄️ GB_Design-System — Atom) —
 * 그리드 프리미티브. 하위 5개 프레임(Part/Month Year 7219:10707, Part/Date
 * 7219:10714, Part/Calendar 7219:10741, Part/Range Calendar 7285:4507,
 * Date select 7219:10905, Range select 7219:10932)을 전수 조사해 구현
 * (2026-09-27, `DateSelect`/`RangeSelect`가 이 컴포넌트를 팝오버 안에서 재사용).
 *
 * ⚠️ Figma는 순수 날짜 라이브러리 없이 `Date` 객체 계산만으로 구현 가능한
 * 범위라 신규 의존성을 추가하지 않았습니다(요청 배경 문서 기준).
 *
 * `mode="single"` — Part/Calendar를 그대로 구현. 헤더의 월/연 라벨을 클릭하면
 * 월(3×4)/연(3×4) 선택 서브뷰로 전환되는 동작은 Figma에 3개 정적 스냅샷
 * (Calendar/Month/Year)만 있어 표준 달력 위젯 UX로 합리적으로 설계했습니다:
 * - Month 서브뷰: "Sep" 토글이 채워짐(`--background-static-gray`), "2026"은
 *   outline. 이전/다음 화살표는 연도를 ±1 이동합니다.
 * - Year 서브뷰: "2026" 토글이 채워지고 "Sep"은 outline. 화살표는 12년
 *   블록을 ±12 이동합니다. 시작 연도는 Figma 스냅샷(2026 기준 2019~2030)과
 *   정확히 일치하도록 `Math.floor(year / 10) * 10 - 1`로 계산했습니다.
 * - 월/연 그리드 셀 자체는 Figma에 "현재 값" 강조가 없어(강조는 헤더 토글에만
 *   존재) 셀은 상태 구분 없이 동일하게 렌더링합니다.
 *
 * `mode="range"` — Part/Range Calendar를 그대로 구현. Figma는 이 프레임에
 * 월/연 서브뷰 자체가 없고(정적 2개월 그리드만 존재), 헤더도 좌측 그리드에
 * [이전, 월라벨], 우측 그리드에 [월라벨, 다음]+[연라벨](justify-between)
 * 구조로 되어 있어 그대로 구현하고 서브뷰 전환 기능은 추가하지 않았습니다.
 * range 시작/끝 셀은 `--background-bold`+`--text-invert`(시작=좌측만 라운드,
 * 끝=우측만 라운드), 중간 셀은 `--background-selected`+`--text-bold`(라운드
 * 없음, 사각형으로 이어짐) — Figma 실측 그대로.
 *
 * 컨테이너 배경(2026-09-27 재확인): `mode="single"`(Part/Calendar
 * 7219:10741)과 `mode="range"`(Part/Range Calendar 7285:4507) 두 프레임 모두
 * 루트 배경이 `--background-overlay`(다크 `#262626`)로 동일합니다. 이전에는
 * range 컨테이너가 `--background-default`(다크 `#0a0a0a`)를 써서 서로 다른
 * 회색조였으나, Figma에서 두 프레임 배경을 통일한 뒤 재조사해 `--background-
 * overlay`로 맞췄습니다. 단, 헤더 월/연 토글 버튼(비활성 상태) 내부 배경은
 * 두 프레임 모두 여전히 `--background-default`를 그대로 사용합니다(변경 없음).
 *
 * 이벤트 점 3종(published/reserved/draft)은 Figma가 래스터 SVG(Ellipse
 * 55/56/57)로 표현했지만, 색상이 이미 존재하는 시맨틱 토큰과 정확히 일치해
 * (published `#FAFAFA`→다크 스코프의 `--text-default`, draft `#F87171`→
 * `--border-warning`, reserved는 같은 색의 outline) 래스터 대신 토큰 기반
 * CSS 원으로 재현했습니다. 점 위치(`left:14px`, `top:24px`, `size:4px`)는
 * 전부 `--scale-14`/`--scale-24`/`--scale-4`와 정확히 일치해 리터럴 예외 없이
 * 토큰만으로 구현했습니다.
 *
 * "항상 다크" 원칙(Popover/Chatbox/FloatingMenu와 동일)은 이 컴포넌트 자체가
 * 아니라 `DateSelect`/`RangeSelect`의 팝오버 콘텐츠 래퍼에 적용됩니다
 * (`className="dark"` 스코프) — `Calendar`는 다크 스코프 유무와 무관하게
 * 시맨틱 토큰만 참조하는 순수 프리미티브입니다.
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
  "flex h-[calc(var(--scale-36)*1px)] shrink-0 items-center justify-center",
  "gap-[var(--spacing-2)] rounded-[var(--radius-scale-lg)] px-[var(--spacing-4)]",
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
          "border-transparent bg-[var(--background-static-gray)] text-[var(--text-static-white)]",
      )}
    >
      {label}
    </Button>
  );
}

const GRID_CELL_BASE =
  "flex h-[calc(var(--scale-32)*1px)] w-[calc(var(--scale-70)*1px)] shrink-0 items-center justify-center rounded-[var(--radius-scale-md)] text-sm-regular text-[var(--text-default)] outline-none";

function MonthYearGrid({
  items,
  onSelect,
}: {
  items: readonly string[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-x-0 gap-y-[var(--spacing-1)]">
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
  "absolute left-[calc(var(--scale-14)*1px)] top-[calc(var(--scale-24)*1px)] size-[calc(var(--scale-4)*1px)] rounded-[var(--radius-scale-full)]";

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
  let radiusClassName = "rounded-[var(--radius-scale-md)]";

  if (disabled) {
    colorClassName = "text-[var(--text-static-gray)]";
  } else if (
    rangeState === "start" ||
    rangeState === "end" ||
    rangeState === "both"
  ) {
    colorClassName = "bg-[var(--background-bold)] text-[var(--text-invert)]";
    radiusClassName =
      rangeState === "both"
        ? "rounded-[var(--radius-scale-md)]"
        : rangeState === "start"
          ? "rounded-l-[var(--radius-scale-md)] rounded-r-none"
          : "rounded-r-[var(--radius-scale-md)] rounded-l-none";
  } else if (rangeState === "middle") {
    colorClassName = "bg-[var(--background-selected)] text-[var(--text-bold)]";
    radiusClassName = "rounded-none";
  } else if (isSelected) {
    colorClassName = "bg-[var(--background-selected)] text-[var(--text-bold)]";
  } else if (isToday) {
    colorClassName = "bg-[var(--background-bold)] text-[var(--text-invert)]";
  } else if (isOtherMonth) {
    colorClassName = "text-[var(--text-static-gray)]";
  } else {
    colorClassName = "text-[var(--text-default)]";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected || rangeState !== null}
      onClick={() => onSelect(date)}
      className={cn(
        "relative flex size-[calc(var(--scale-32)*1px)] shrink-0 flex-col items-center justify-center",
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
            eventType === "draft" && "bg-[var(--border-warning)]",
            eventType === "published" && "bg-[var(--text-default)]",
            eventType === "reserved" &&
              "border-[length:var(--border-1)] border-solid border-[var(--text-default)]",
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
    <div className="grid grid-cols-7 gap-x-0 gap-y-[var(--spacing-1)]">
      {WEEKDAY_LABELS.map((label) => (
        <span
          key={label}
          className="flex h-[var(--spacing-4)] w-[calc(var(--scale-32)*1px)] shrink-0 items-center justify-center text-xs-regular text-[var(--text-subtle)]"
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
          "flex items-start justify-center gap-[var(--spacing-4)]",
          "rounded-[var(--radius-scale-lg)] border-[length:var(--border-1)] border-solid border-[var(--border-default)]",
          "bg-[var(--background-overlay)] p-[var(--spacing-3)]",
          className,
        )}
      >
        <div className="flex w-fit flex-col items-end gap-[var(--spacing-4)]">
          <div className="flex items-center gap-[var(--spacing-1)]">
            <Button
              variant="ghost"
              icon="chevron-left-icon"
              aria-label="Previous month"
              onClick={handlePrev}
            />
            <div
              className={cn(
                HEADER_TOGGLE_BASE,
                "border-[length:var(--border-1)] border-solid border-[var(--border-default)] bg-[var(--background-default)] text-[var(--text-default)]",
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
        <div className="flex w-fit flex-col items-start gap-[var(--spacing-4)]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[var(--spacing-1)]">
              <div
                className={cn(
                  HEADER_TOGGLE_BASE,
                  "border-[length:var(--border-1)] border-solid border-[var(--border-default)] bg-[var(--background-default)] text-[var(--text-default)]",
                )}
              >
                {MONTH_LABELS[rightMonth.getMonth()]}
              </div>
              <Button
                variant="ghost"
                icon="chevron-right-icon"
                aria-label="Next month"
                onClick={handleNext}
              />
            </div>
            <div
              className={cn(
                HEADER_TOGGLE_BASE,
                "border-[length:var(--border-1)] border-solid border-[var(--border-default)] bg-[var(--background-default)] text-[var(--text-default)]",
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
        "flex flex-col items-start gap-[var(--spacing-4)]",
        "rounded-[var(--radius-scale-lg)] border-[length:var(--border-1)] border-solid border-[var(--border-default)]",
        "bg-[var(--background-overlay)] p-[var(--spacing-5)]",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Button
          variant="ghost"
          icon="chevron-left-icon"
          aria-label="Previous"
          onClick={handlePrev}
        />
        <div className="flex items-center gap-[var(--spacing-1)]">
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
          variant="ghost"
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
