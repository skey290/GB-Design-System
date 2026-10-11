"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import {
  Calendar,
  type CalendarEventType,
} from "@/components/ui/calendar/calendar";

/**
 * 라벨 + 트리거(Radix Popover Trigger) + 팝오버 안에 `Calendar mode="single"`을
 * 렌더링하는 완성형 위젯.
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
 * Popover/Chatbox와 동일하게 "항상 다크" 원칙을 적용해 `className="dark"`로
 * 스코프했습니다(사이트 라이트/다크 테마와 무관). 트리거 자체는 일반
 * 라이트/다크 테마를 따르는 일반 컴포넌트입니다(Select 트리거와 동일 취급).
 */
export interface DateSelectProps {
  /** 라벨 텍스트. Figma 기본값 "Date to post" */
  label?: string;
  /** 제어 컴포넌트로 사용할 때의 선택된 날짜 */
  value?: Date;
  /** 비제어 컴포넌트로 사용할 때의 초기 날짜 */
  defaultValue?: Date;
  /** 날짜를 고르면 호출됩니다. 선택 즉시 팝오버가 닫힙니다 */
  onValueChange?: (date: Date) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  /** 트리거를 비활성화합니다 (팝오버도 열리지 않음) */
  disabled?: boolean;
  /** 루트 `<div>`에 병합 */
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

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${date.getFullYear()}`;
}

export function DateSelect({
  label = "Date to post",
  value,
  defaultValue,
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

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasValue = !!currentValue;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <div
      className={cn(
        "flex w-[192px] flex-col items-start gap-[var(--gb-spacing-3)]",
        className,
      )}
    >
      {label && (
        <label
          htmlFor={generatedId}
          className="w-full text-sm-medium text-[var(--gb-text-default)]"
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
              "flex h-[36px] w-full items-center justify-center",
              "rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-solid",
              "px-[var(--gb-spacing-3)] py-[var(--gb-spacing-2)]",
              "outline-none transition-colors",
              disabled ? "text-sm-regular" : "text-sm-medium",
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
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {hasValue ? formatDate(currentValue) : placeholder}
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className="dark z-50 outline-none"
          >
            <Calendar
              mode="single"
              value={currentValue}
              onValueChange={(date) => {
                if (!isControlled) setUncontrolledValue(date);
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
