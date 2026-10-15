"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { DropdownList } from "@/components/ui/dropdown-list";
import type { DropdownListOption as SelectOption } from "@/components/ui/dropdown-list";

export type { SelectOption };

/** 유효한 `Type` × `Style` 조합 7종. */
export type SelectVariant =
  "primary" | "reverse" | "mute" | "ghost" | "icon" | "side" | "side-reverse";

export interface SelectProps {
  /** 트리거 `<button>`에 연결할 ref */
  ref?: React.Ref<HTMLButtonElement>;
  /** 트리거 형태 */
  variant?: SelectVariant;
  /** 드롭다운에 표시할 옵션 목록 */
  options: SelectOption[];
  /** 제어 컴포넌트로 사용할 때의 선택된 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 선택값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  /** Figma에는 `primary`/`icon`에만 disabled가 정의되어 있습니다 */
  disabled?: boolean;
  /** 트리거 `<button>`에 병합 */
  className?: string;
}

const SIDE_VARIANTS: readonly SelectVariant[] = ["side", "side-reverse"];

const DROPDOWN_WIDTH_CLASS = "w-[210px]";
const DROPDOWN_OFFSET = 8;
const SIDE_DROPDOWN_OFFSET = 5;
const SIDE_DROPDOWN_ALIGN_OFFSET = -8;

const FILLED_HOVER_CLASS = cn(
  "hover:border-[var(--gb-border-static-gray)]",
  "hover:bg-[var(--gb-background-mute)]",
  "hover:text-[var(--gb-text-static-white)]",
  "hover:shadow-[var(--gb-shadow-focus-ring)]",
);
const OPEN_RING_CLASS = cn(
  "data-[state=open]:border-[var(--gb-border-static-gray)]",
  "data-[state=open]:shadow-[var(--gb-shadow-focus-ring)]",
);

export function Select({
  ref,
  variant = "primary",
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  disabled,
  className,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const generatedId = React.useId();

  const selectedOption = options.find(
    (option) => option.value === currentValue,
  );
  const isIconOnly = variant === "icon";
  const isSide = SIDE_VARIANTS.includes(variant);
  const isSideReverse = variant === "side-reverse";
  const isReverse = variant === "reverse";

  const triggerLabel =
    selectedOption?.code ?? selectedOption?.label ?? placeholder;

  const listboxId = `${generatedId}-listbox`;
  const getOptionId = (optionValue: string) =>
    `${generatedId}-option-${optionValue}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
    if (nextOpen) {
      const selectedIndex = options.findIndex(
        (option) => option.value === currentValue,
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  };

  const commitSelection = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled || open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      handleOpenChange(true);
    }
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) commitSelection(option);
    }
  };

  const geometryClass = isIconOnly
    ? "size-[36px] justify-center"
    : isSide
      ? cn(
          "h-[24px] gap-[var(--gb-spacing-0-5)] px-[var(--gb-spacing-2)]",
          isSideReverse ? "flex-row-reverse text-right" : "justify-between",
        )
      : "h-[36px] justify-between gap-[var(--gb-spacing-2)] px-[var(--gb-spacing-3)]";

  const surfaceClass = isSide
    ? "border-transparent bg-transparent"
    : isReverse
      ? "border-transparent bg-[var(--gb-background-bold)]"
      : variant === "mute"
        ? "border-transparent bg-[var(--gb-background-surface-secondary)]"
        : variant === "ghost"
          ? cn(
              "border-transparent bg-transparent",
              "data-[state=open]:bg-[var(--gb-background-default)]",
            )
          : "border-[var(--gb-border-default)] bg-[var(--gb-background-default)]";

  const textColorClass = isIconOnly
    ? "text-[var(--gb-icon-default)]"
    : isSide
      ? "text-[var(--gb-text-default)]"
      : isReverse
        ? selectedOption
          ? "text-[var(--gb-text-invert)]"
          : "text-[var(--gb-text-selected)]"
        : selectedOption
          ? "text-[var(--gb-text-default)]"
          : "text-[var(--gb-text-subtle)]";

  const hoverClass = isSide
    ? "hover:text-[var(--gb-text-static-gray)]"
    : FILLED_HOVER_CLASS;

  const openTextColorClass = isIconOnly
    ? ""
    : isSide
      ? ""
      : isReverse
        ? "data-[state=open]:text-[var(--gb-text-invert)]"
        : "data-[state=open]:text-[var(--gb-text-default)]";

  const popoverSide = isSideReverse ? "left" : isSide ? "right" : "bottom";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "inline-flex w-fit shrink-0 items-center",
            "rounded-[var(--gb-radius-scale-md)]",
            "border-[length:var(--gb-border-1)] border-solid",
            "outline-none transition-colors",
            geometryClass,
            isSide ? "text-xs-medium" : "text-sm-medium",
            disabled
              ? cn(
                  "cursor-not-allowed",
                  "border-[var(--gb-border-overlay)] bg-[var(--gb-background-disabled)]",
                  isIconOnly
                    ? "text-[var(--gb-icon-static-gray)]"
                    : "text-[var(--gb-text-static-gray)]",
                )
              : cn(
                  surfaceClass,
                  textColorClass,
                  hoverClass,
                  isSide ? null : OPEN_RING_CLASS,
                  openTextColorClass,
                ),
            className,
          )}
        >
          {isIconOnly ? (
            <Plus
              aria-hidden="true"
              className="size-[var(--gb-spacing-4)] shrink-0"
            />
          ) : (
            <>
              <span className="truncate">{triggerLabel}</span>
              <SelectChevron
                isOpen={open}
                isSide={isSide}
                isSideReverse={isSideReverse}
                className={
                  disabled ? "text-[var(--gb-icon-static-gray)]" : undefined
                }
              />
            </>
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={popoverSide}
          align="start"
          sideOffset={isSide ? SIDE_DROPDOWN_OFFSET : DROPDOWN_OFFSET}
          alignOffset={isSide ? SIDE_DROPDOWN_ALIGN_OFFSET : 0}
          onKeyDown={handleContentKeyDown}
          className={cn(
            "z-50 overflow-hidden",
            "rounded-[var(--gb-radius-scale-md)]",
            "border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid",
            "bg-[var(--gb-background-surface)] text-[var(--gb-text-default)]",
            "shadow-[var(--gb-shadow-md)]",
            DROPDOWN_WIDTH_CLASS,
          )}
        >
          <DropdownList
            options={options}
            value={value}
            highlightedIndex={highlightedIndex}
            onHighlightChange={setHighlightedIndex}
            onCommit={commitSelection}
            listboxId={listboxId}
            getOptionId={getOptionId}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function SelectChevron({
  isOpen,
  isSide,
  isSideReverse,
  className,
}: {
  isOpen: boolean;
  isSide: boolean;
  isSideReverse: boolean;
  /** 트리거 `<button>`에 병합 */
  className?: string;
}) {
  const sizeClass = cn("size-[var(--gb-spacing-4)] shrink-0", className);

  if (isSide) {
    const PointsAway = isSideReverse ? ChevronLeft : ChevronRight;
    const PointsBack = isSideReverse ? ChevronRight : ChevronLeft;
    const Icon = isOpen ? PointsBack : PointsAway;
    return <Icon aria-hidden="true" className={sizeClass} />;
  }

  const Icon = isOpen ? ChevronUp : ChevronDown;
  return <Icon aria-hidden="true" className={sizeClass} />;
}
