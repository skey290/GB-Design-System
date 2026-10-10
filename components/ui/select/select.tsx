"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";

/** 유효한 `Type` × `Style` 조합 7종. */
export type SelectVariant =
  "primary" | "reverse" | "mute" | "ghost" | "icon" | "side" | "side-reverse";

export interface SelectOption {
  value: string;
  label: string;
  /** 트리거에 라벨 대신 표시할 짧은 코드 (예: 국가번호 "+82") */
  code?: string;
}

export interface SelectProps {
  /** 트리거 형태 */
  variant?: SelectVariant;
  options: SelectOption[];
  /** 선택된 값 */
  value?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 값이 없을 때 트리거에 표시할 텍스트 */
  placeholder?: string;
  /** Figma에는 `primary`/`icon`에만 disabled가 정의되어 있습니다 */
  disabled?: boolean;
  className?: string;
}

const SIDE_VARIANTS: readonly SelectVariant[] = ["side", "side-reverse"];

// Figma 드롭다운 슬롯 확정값: 폭 210px, 트리거와의 간격 8px(슬롯 top 44 = 트리거 36 + 8)
const DROPDOWN_WIDTH_CLASS = "w-[210px]";
const DROPDOWN_OFFSET = 8;
// side 계열은 아래가 아니라 옆으로 열리고, 트리거 상단보다 8px 위에서 시작
const SIDE_DROPDOWN_OFFSET = 5;
const SIDE_DROPDOWN_ALIGN_OFFSET = -8;

// 리스트와 스크롤바 트랙이 공유하는 Figma 확정 높이: 항목 h-8(32px) x 6 + gap-1(4px) x 5
// + padding-1(4px) x 2. 둘은 `max-h`/`h`로 유틸이 다르므로 공통 부모에 CSS 변수로 한 번만
// 선언하고 각자 그 변수를 참조한다 — 같은 calc를 두 번 적는 중복을 피한다.
const LIST_HEIGHT_VAR = "--gb-select-list-height";
const LIST_HEIGHT_STYLE = {
  [LIST_HEIGHT_VAR]:
    "calc((var(--gb-spacing-8)*6)+(var(--gb-spacing-1)*5)+(var(--gb-spacing-1)*2))",
} as React.CSSProperties;
const LIST_MAX_HEIGHT_CLASS = "max-h-[var(--gb-select-list-height)]";
const SCROLLBAR_TRACK_HEIGHT_CLASS = "h-[var(--gb-select-list-height)]";

// Figma: hover는 default 계열 전 Style 공통으로 배경을 채우고 텍스트/아이콘을 뒤집는다.
// pressed(열림)는 배경을 그대로 두고 보더+포커스링만 추가한다 — hover와 값이 다르다.
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
  variant = "primary",
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });
  const generatedId = React.useId();
  const listRef = React.useRef<HTMLUListElement>(null);
  // Figma 목업은 16개 옵션 중 6개만 보이는 고정 높이 드롭다운 + 하단 셰브론
  // 힌트로 디자인되어 있음 — 6개 이하면 스크롤할 내용이 없어 숨김
  const isScrollable = options.length > 6;

  const updateThumb = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: 100 });
      return;
    }
    const heightPercent = (clientHeight / scrollHeight) * 100;
    const topPercent =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
    setThumb({ top: topPercent, height: heightPercent });
  }, []);

  // Radix Popover는 Portal + Presence로 렌더링되어, `open`이 true가 되는 렌더와
  // <ul>가 실제 DOM에 마운트되는 시점이 같은 커밋이 아닐 수 있음 — 콜백 ref로
  // 노드가 실제로 붙는 순간에 맞춰 계산한다.
  const listCallbackRef = React.useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      if (node) updateThumb();
    },
    [updateThumb],
  );

  const handleScrollNext = () => {
    listRef.current?.scrollBy({
      top: listRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  const selectedOption = options.find((option) => option.value === value);
  const isIconOnly = variant === "icon";
  const isSide = SIDE_VARIANTS.includes(variant);
  const isSideReverse = variant === "side-reverse";
  const isReverse = variant === "reverse";
  const hasCodeColumn = options.some((option) => option.code);

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
        (option) => option.value === value,
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  };

  const commitSelection = (option: SelectOption) => {
    onValueChange?.(option.value);
    setOpen(false);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled || open) return;
    // Enter/Space는 <button>의 기본 클릭 동작으로 이미 팝오버가 열리므로 화살표 키만 처리
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      handleOpenChange(true);
    }
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape/바깥 클릭 닫힘은 Radix Popover가 기본 제공하므로 별도 처리하지 않음
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
          ? "border-transparent bg-transparent"
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

  // Figma: side의 hover는 배경을 채우는 게 아니라 텍스트/아이콘을 흐린다(dim)
  const hoverClass = isSide
    ? "hover:text-[var(--gb-text-static-gray)]"
    : FILLED_HOVER_CLASS;

  // Figma: 열려 있는 동안 텍스트는 선택 여부와 무관하게 "값이 있는 것처럼" 고정된다
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
            // Figma: disabled는 Style별 배경/보더를 흐리는 게 아니라 단일 디자인으로 완전히 대체된다
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
          <div className="flex items-stretch" style={LIST_HEIGHT_STYLE}>
            <ul
              ref={listCallbackRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              onScroll={updateThumb}
              aria-activedescendant={
                highlightedIndex >= 0
                  ? getOptionId(options[highlightedIndex]?.value ?? "")
                  : undefined
              }
              className={cn(
                "flex flex-1 flex-col items-start gap-[var(--gb-spacing-1)] overflow-y-auto p-[var(--gb-spacing-1)]",
                // 커스텀 스크롤바(트랙/썸)를 별도로 그리므로 브라우저 기본 스크롤바는 숨김
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                LIST_MAX_HEIGHT_CLASS,
              )}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={option.value}
                    id={getOptionId(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => commitSelection(option)}
                    className={cn(
                      "flex w-full shrink-0 cursor-pointer items-center",
                      "gap-[var(--gb-spacing-1)]",
                      "h-[var(--gb-spacing-8)] px-[var(--gb-spacing-2)]",
                      "rounded-[var(--gb-radius-scale-sm)]",
                      "text-sm-regular",
                      isSelected || isHighlighted
                        ? "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]"
                        : cn(
                            "text-[var(--gb-text-default)]",
                            "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
                          ),
                    )}
                  >
                    {hasCodeColumn ? (
                      <>
                        {/* Figma 확정값: 코드 컬럼 고정폭 50px */}
                        <span className="w-[50px] shrink-0">{option.code}</span>
                        <span className="min-w-0 flex-1 truncate">
                          {option.label}
                        </span>
                      </>
                    ) : (
                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {isScrollable && (
              <div
                aria-hidden="true"
                className="shrink-0 py-[var(--gb-spacing-1)] pr-[var(--gb-spacing-1)]"
              >
                <div
                  className={cn(
                    "relative w-[10px] rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-background-subtler)]",
                    SCROLLBAR_TRACK_HEIGHT_CLASS,
                  )}
                >
                  <div
                    className="absolute inset-x-0 rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-background-subtle)]"
                    style={{ top: `${thumb.top}%`, height: `${thumb.height}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {isScrollable && (
            <button
              type="button"
              aria-label="Show more options"
              onClick={handleScrollNext}
              className="flex h-[var(--gb-spacing-7)] w-full items-center justify-center outline-none"
            >
              <ChevronDown
                aria-hidden="true"
                className="size-[var(--gb-spacing-4)] text-[var(--gb-icon-subtle)]"
              />
            </button>
          )}
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
  className?: string;
}) {
  const sizeClass = cn("size-[var(--gb-spacing-4)] shrink-0", className);

  if (isSide) {
    // Figma: side는 열리는 방향을 가리키고, 열리면 반대로 뒤집힌다
    const PointsAway = isSideReverse ? ChevronLeft : ChevronRight;
    const PointsBack = isSideReverse ? ChevronRight : ChevronLeft;
    const Icon = isOpen ? PointsBack : PointsAway;
    return <Icon aria-hidden="true" className={sizeClass} />;
  }

  const Icon = isOpen ? ChevronUp : ChevronDown;
  return <Icon aria-hidden="true" className={sizeClass} />;
}
