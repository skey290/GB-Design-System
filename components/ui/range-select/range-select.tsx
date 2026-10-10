"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarEventType,
  type CalendarRangeValue,
} from "@/components/ui/calendar/calendar";

/**
 * 트리거(우측 `lucide/calendar` 아이콘, 값 포맷 `MM/DD - MM/DD`) + 팝오버 안에
 * `Calendar mode="range"`를 렌더링하는 완성형 위젯.
 *
 * 트리거 폭 488px은 Figma 확정값을 리터럴로 사용합니다.
 * radius는 `--radius-scale-lg`(10px)로 `DateSelect`(--radius-scale-md, 8px)와
 * 다름에 유의 — Figma 확정값.
 *
 * Figma `status` variant(filled/hovered/pressed/disabled)는 CSS 의사 클래스로
 * 매핑했습니다(hovered → `:hover`, pressed → `data-[state=open]`, disabled →
 * `disabled` prop). Figma에는 값이 비어있는 "default(placeholder)" 상태의
 * 정적 목업이 없지만(모든 상태가 이미 "09/01 - 09/30" 값으로 채워진
 * 스냅샷) 실사용에서는 값이 없는 초기 상태가 반드시 존재하므로 `placeholder`
 * prop을 추가해 지원합니다(Select의 placeholder 처리와 동일한 근거).
 *
 * 팝오버 콘텐츠는 Popover/Chatbox/DateSelect와 동일하게 "항상
 * 다크" 원칙을 적용해 `className="dark"`로 스코프했습니다.
 */
export interface RangeSelectProps {
  value?: CalendarRangeValue;
  onValueChange?: (range: CalendarRangeValue) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
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
  value,
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
  const formattedValue = formatRange(value);
  const hasValue = !!formattedValue;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            // 488px: 스케일 토큰에 없는 Figma 확정 트리거 폭 (Select 210px과 동일한 예외 근거)
            "flex w-[488px] items-center justify-center gap-[var(--gb-spacing-2)]",
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
          <svg
            aria-hidden="true"
            className="size-[var(--gb-spacing-4)] shrink-0 text-current"
          >
            <use href="/icons.svg#calendar-icon" />
          </svg>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="dark z-50 outline-none"
        >
          <Calendar
            mode="range"
            value={value}
            onValueChange={(range) => {
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
