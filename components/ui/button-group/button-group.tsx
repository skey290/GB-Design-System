"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { IconId } from "@/lib/sprite-icon";

export type ButtonGroupType =
  "skippable" | "back-or-forth" | "save" | "confirm" | "error" | "menu";

interface ButtonGroupPair {
  secondary: string;
  primary: string;
}

const BUTTON_GROUP_LABELS: Record<
  Exclude<ButtonGroupType, "menu">,
  ButtonGroupPair
> = {
  skippable: { secondary: "Later", primary: "Go Next" },
  "back-or-forth": { secondary: "Go back", primary: "Go Next" },
  save: { secondary: "Cancel", primary: "Save" },
  confirm: { secondary: "Cancel", primary: "Confirm" },
  error: { secondary: "Refresh", primary: "Back to Dashboard" },
};

export interface ButtonGroupMenuItem {
  /** 항목 식별자 (고유해야 함) */
  id: string;
  /** 표시할 텍스트. 생략하면 아이콘 전용 항목으로 렌더링됩니다 */
  label?: string;
  /** 표시할 아이콘 id */
  icon?: IconId;
}

const DEFAULT_MENU_ITEMS: ButtonGroupMenuItem[] = [
  { id: "home", icon: "home-icon" },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
];

export interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  /** 버튼 조합 종류. `menu`만 플로팅 내비게이션 pill이고 나머지는 2버튼 행입니다 */
  type?: ButtonGroupType;
  /** 조합 내 모든 버튼을 한번에 비활성화합니다 */
  disabled?: boolean;
  /** 고정 너비(344px) 대신 부모 너비를 꽉 채웁니다 (`menu`에는 적용되지 않음) */
  shouldFitContainer?: boolean;
  /** 왼쪽 outline 버튼 라벨. 생략하면 `type`별 기본 라벨을 씁니다 */
  secondaryLabel?: string;
  /** 오른쪽 primary 버튼 라벨. 생략하면 `type`별 기본 라벨을 씁니다 */
  primaryLabel?: string;
  /** 왼쪽 outline 버튼 클릭 핸들러 */
  onSecondaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** 오른쪽 primary 버튼 클릭 핸들러 */
  onPrimaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** `type="menu"`에서 렌더링할 항목 목록 */
  items?: ButtonGroupMenuItem[];
  /** `type="menu"`에서 현재 활성화된 항목의 id */
  activeId?: string;
  /** `type="menu"`에서 활성 항목이 바뀔 때 호출됩니다 */
  onActiveChange?: (id: string) => void;
}

export function ButtonGroup({
  type = "skippable",
  disabled = false,
  shouldFitContainer = false,
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
  items = DEFAULT_MENU_ITEMS,
  activeId,
  onActiveChange,
  className,
  ...props
}: ButtonGroupProps) {
  if (type === "menu") {
    return (
      <ButtonGroupMenu
        items={items}
        activeId={activeId}
        onActiveChange={onActiveChange}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  const labels = BUTTON_GROUP_LABELS[type];

  return (
    <div
      className={cn(
        "flex items-end gap-[var(--gb-spacing-2-5)]",
        shouldFitContainer ? "w-full" : "w-[344px]",
        className,
      )}
      {...props}
    >
      <Button
        variant="outline"
        className="flex-1"
        disabled={disabled}
        onClick={onSecondaryClick}
      >
        {secondaryLabel ?? labels.secondary}
      </Button>
      <Button
        variant="primary"
        className="flex-1"
        disabled={disabled}
        onClick={onPrimaryClick}
      >
        {primaryLabel ?? labels.primary}
      </Button>
    </div>
  );
}

interface ButtonGroupMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  items: ButtonGroupMenuItem[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  disabled: boolean;
}

function ButtonGroupMenu({
  items,
  activeId,
  onActiveChange,
  disabled,
  className,
  ...props
}: ButtonGroupMenuProps) {
  const instanceId = React.useId();

  const focusAndActivate = (index: number) => {
    if (disabled) return;
    const item = items[index];
    if (!item) return;

    onActiveChange?.(item.id);
    document.getElementById(`${instanceId}-${item.id}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const foundIndex = items.findIndex((item) => item.id === activeId);
    const currentIndex = foundIndex === -1 ? 0 : foundIndex;
    if (items.length === 0) return;

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
        "inline-flex h-[53px] items-center justify-center",
        "gap-[var(--gb-spacing-3)] px-[var(--gb-spacing-2-5)] py-[var(--gb-spacing-2)]",
        "rounded-[var(--gb-radius-scale-full)]",
        "border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid",
        "bg-[var(--gb-background-sheer)]",
        "[backdrop-filter:var(--gb-backdrop-blur-8)]",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isSelected = !disabled && item.id === activeId;
        const isFocusable =
          activeId === undefined ? index === 0 : item.id === activeId;

        return (
          <Button
            key={item.id}
            variant={item.label ? "ghost" : "icon-rounded"}
            icon={item.icon}
            id={`${instanceId}-${item.id}`}
            role="tab"
            aria-selected={item.id === activeId}
            aria-label={item.label ?? item.id}
            tabIndex={isFocusable ? 0 : -1}
            disabled={disabled}
            onClick={() => onActiveChange?.(item.id)}
            className={cn(
              isSelected &&
                "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]",
            )}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
