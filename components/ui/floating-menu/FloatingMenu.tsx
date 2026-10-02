"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FloatingMenuItem {
  /** 항목 식별자 (고유해야 함) */
  id: string;
  /** 표시할 텍스트. 생략하면 아이콘 전용 버튼으로 렌더링됩니다 */
  label?: string;
  /** 표시할 아이콘 (lucide-react 아이콘 컴포넌트) */
  icon?: LucideIcon;
}

export interface FloatingMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 메뉴 항목 목록 */
  items: FloatingMenuItem[];
  /** 현재 활성화된 항목의 id (라디오그룹처럼 항상 정확히 1개) */
  activeId: string;
  /** 활성 항목이 바뀔 때 호출됩니다 */
  onActiveChange?: (id: string) => void;
  /** 전체 비활성화. 활성 항목 하이라이트 없이 모든 항목이 회색으로 고정 렌더링됩니다 */
  disabled?: boolean;
}

export function FloatingMenu({
  items,
  activeId,
  onActiveChange,
  disabled = false,
  className,
  ...props
}: FloatingMenuProps) {
  const instanceId = React.useId();

  const focusAndActivate = (index: number) => {
    if (disabled) return;
    const item = items[index];
    if (!item) return;

    onActiveChange?.(item.id);
    const button = document.getElementById(`${instanceId}-${item.id}`);
    button?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex === -1) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAndActivate((currentIndex + 1) % items.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAndActivate((currentIndex - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        focusAndActivate(0);
        break;
      case "End":
        event.preventDefault();
        focusAndActivate(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center gap-[var(--spacing-3)] rounded-[var(--radius-scale-full)] border-[length:var(--border-1)] border-[var(--border-default)] bg-[var(--background-sheer)] px-[var(--spacing-2-5)] py-[var(--spacing-2)]",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const selected = !disabled && item.id === activeId;
        const Icon = item.icon;
        const iconOnly = !item.label;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${instanceId}-${item.id}`}
            aria-selected={item.id === activeId}
            aria-label={iconOnly ? (item.label ?? item.id) : undefined}
            disabled={disabled}
            tabIndex={item.id === activeId ? 0 : -1}
            onClick={() => onActiveChange?.(item.id)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-[var(--spacing-2)] whitespace-nowrap rounded-[var(--radius-scale-full)] outline-none transition-colors focus-visible:shadow-[var(--shadow-focus-ring)]",
              iconOnly
                ? "size-[var(--spacing-9)]"
                : "h-[var(--spacing-9)] px-[var(--spacing-4)] py-[var(--spacing-2)]",
              selected && "bg-[var(--background-static-gray)]",
            )}
          >
            {Icon ? (
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-[var(--spacing-4)]",
                  disabled
                    ? "text-[var(--icon-static-gray)]"
                    : selected
                      ? "text-[var(--icon-static-white)]"
                      : "text-[var(--icon-default)]",
                )}
              />
            ) : null}
            {item.label ? (
              <span
                className={cn(
                  disabled
                    ? "text-sm-semi-bold text-[var(--text-static-gray)]"
                    : selected
                      ? "text-sm-semi-bold text-[var(--text-static-white)]"
                      : "text-sm-medium text-[var(--text-default)]",
                )}
              >
                {item.label}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
