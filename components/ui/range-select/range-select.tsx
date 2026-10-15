"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarEventType,
  type CalendarRangeValue,
} from "@/components/ui/calendar/calendar";

/**
 * Figma `Range select` — 기간(시작~종료) 선택 트리거 + 팝오버 캘린더.
 * 스펙 상세는 `docs/components/range-select.md` 참고.
 */
export interface RangeSelectProps {
  /** 트리거 `<button>`에 연결할 ref */
  ref?: React.Ref<HTMLButtonElement>;
  /** 제어 컴포넌트로 사용할 때의 기간 */
  value?: CalendarRangeValue;
  /** 비제어 컴포넌트로 사용할 때의 초기 기간 */
  defaultValue?: CalendarRangeValue;
  /** 기간이 바뀔 때 호출됩니다 */
  onValueChange?: (range: CalendarRangeValue) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  /** 트리거를 비활성화합니다 (팝오버도 열리지 않음) */
  disabled?: boolean;
  /** 트리거 `<button>`에 병합 */
  className?: string;
  /** 이 날짜 이전은 선택할 수 없습니다 (달력에 전달) */
  minDate?: Date;
  /** 이 날짜 이후는 선택할 수 없습니다 (달력에 전달) */
  maxDate?: Date;
  /** 개별적으로 선택을 막을 날짜 목록 (달력에 전달) */
  disabledDates?: Date[];
  /** 날짜별 이벤트 마커. 키는 `yyyy-MM-dd` (달력에 전달) */
  events?: Record<string, CalendarEventType>;
}

function formatShortDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

function formatRange(value?: CalendarRangeValue): string | undefined {
  if (!value?.from) return undefined;
  if (!value.to) return formatShortDate(value.from);
  return `${formatShortDate(value.from)} - ${formatShortDate(value.to)}`;
}

export function RangeSelect({
  ref,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select date range",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
  events,
}: RangeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const formattedValue = formatRange(currentValue);
  const hasValue = !!formattedValue;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-[36px] w-[488px] items-center justify-center gap-[var(--gb-spacing-2)]",
            "rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid",
            "px-[var(--gb-spacing-3)] py-[var(--gb-spacing-2)]",
            "outline-none transition-colors",
            "text-sm-medium",
            disabled
              ? cn(
                  "cursor-not-allowed",
                  "bg-[var(--gb-background-disabled)] border-[var(--gb-border-overlay)]",
                  "text-[var(--gb-text-static-gray)]",
                )
              : cn(
                  "bg-[var(--gb-background-default)] border-[var(--gb-border-default)]",
                  hasValue
                    ? "text-[var(--gb-text-default)]"
                    : "text-[var(--gb-text-subtle)]",
                  "hover:bg-[var(--gb-background-mute)] hover:border-[var(--gb-border-static-gray)]",
                  "hover:text-[var(--gb-text-static-white)] hover:shadow-[var(--gb-shadow-focus-ring)]",
                  "data-[state=open]:border-[var(--gb-border-static-gray)]",
                  "data-[state=open]:shadow-[var(--gb-shadow-focus-ring)]",
                  "data-[state=open]:text-[var(--gb-text-default)]",
                ),
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {formattedValue ?? placeholder}
          </span>
          <CalendarIcon
            aria-hidden="true"
            className="size-[var(--gb-spacing-4)] shrink-0 text-current"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className="dark z-50 outline-none"
        >
          <Calendar
            mode="range"
            value={currentValue}
            onValueChange={(range) => {
              if (!isControlled) setUncontrolledValue(range);
              onValueChange?.(range);
              if (range.from && range.to) setOpen(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            events={events}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
