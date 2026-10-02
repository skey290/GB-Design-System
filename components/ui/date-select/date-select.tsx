"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarEventType,
} from "@/components/ui/calendar/calendar";

/**
 * Figma "Date select"(node-id 7219:10905, ❄️ GB_Design-System — Atom) — 라벨 +
 * 트리거(Radix Popover Trigger) + 팝오버 안에 `Calendar mode="single"`을
 * 렌더링하는 완성형 위젯 (2026-09-27).
 *
 * 트리거 폭 192px은 `--scale-192`와 정확히 일치해 리터럴 예외 없이 토큰으로
 * 구현했습니다. 높이 36px(`--scale-36`), radius 8px(`--radius-scale-md`) —
 * Figma 확정값. `RangeSelect`(radius-scale-lg, 10px)와 radius 값이 다름에 유의.
 *
 * Figma `status` variant(default/hovered/pressed/disabled/filled)는 값 존재
 * 여부(filled ↔ default)와 CSS 의사 클래스(hovered → `:hover`, pressed →
 * `data-[state=open]`, disabled → `disabled` prop)로 매핑했습니다.
 *
 * 팝오버 콘텐츠(`Part/Calendar`가 렌더링되는 영역)는 Popover/Chatbox/
 * FloatingMenu와 동일하게 "항상 다크" 원칙을 적용해 `className="dark"`로
 * 스코프했습니다(사이트 라이트/다크 테마와 무관). 트리거 자체는 일반
 * 라이트/다크 테마를 따르는 일반 컴포넌트입니다(Select 트리거와 동일 취급).
 */
export interface DateSelectProps {
  /** 라벨 텍스트. Figma 기본값 "Date to post" */
  label?: string;
  value?: Date;
  onValueChange?: (date: Date) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  events?: Record<string, CalendarEventType>;
}

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${date.getFullYear()}`;
}

export function DateSelect({
  label = "Date to post",
  value,
  onValueChange,
  placeholder = "MM.DD.YYYY",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
  events,
}: DateSelectProps) {
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();
  const hasValue = !!value;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <div
      className={cn(
        "flex w-[calc(var(--scale-192)*1px)] flex-col items-start gap-[var(--spacing-3)]",
        className,
      )}
    >
      {label && (
        <label
          htmlFor={generatedId}
          className="w-full text-sm-medium text-[var(--text-default)]"
        >
          {label}
        </label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={generatedId}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-[calc(var(--scale-36)*1px)] w-full items-center justify-center",
              "rounded-[var(--radius-scale-md)] border-[length:var(--border-1)] border-solid",
              "px-[var(--spacing-3)] py-[var(--spacing-2)]",
              "outline-none transition-colors",
              disabled ? "text-sm-regular" : "text-sm-medium",
              disabled
                ? cn(
                    "cursor-not-allowed",
                    "bg-[var(--background-disabled)] border-[var(--border-overlay)]",
                    "text-[var(--text-static-gray)]",
                  )
                : cn(
                    "bg-[var(--background-default)] border-[var(--border-default)]",
                    hasValue
                      ? "text-[var(--text-default)]"
                      : "text-[var(--text-subtle)]",
                    "hover:bg-[var(--background-static-gray)] hover:border-[var(--border-static-gray)]",
                    "hover:text-[var(--text-static-white)] hover:shadow-[var(--shadow-focus-ring)]",
                    "data-[state=open]:border-[var(--border-static-gray)]",
                    "data-[state=open]:shadow-[var(--shadow-focus-ring)]",
                    "data-[state=open]:text-[var(--text-default)]",
                  ),
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {hasValue ? formatDate(value) : placeholder}
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className="dark z-50 outline-none"
          >
            <Calendar
              mode="single"
              value={value}
              onValueChange={(date) => {
                onValueChange?.(date);
                setOpen(false);
              }}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              events={events}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
