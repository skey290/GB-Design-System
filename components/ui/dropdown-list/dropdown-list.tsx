"use client";

import * as React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DropdownListOption {
  value: string;
  label: string;
  /** 트리거에 라벨 대신 표시할 짧은 코드 (예: 국가번호 "+82") */
  code?: string;
  /** 리스트 아이템 왼쪽에 표시할 아이콘 (Figma `Part/dropdown slot` leadingIcon) */
  icon?: LucideIcon;
  /** 이 옵션만 선택 불가 (Figma `Part/dropdown slot` status=disabled) */
  disabled?: boolean;
}

const LIST_HEIGHT_VAR = "--gb-select-list-height";
const LIST_HEIGHT_STYLE = {
  [LIST_HEIGHT_VAR]:
    "calc((var(--gb-spacing-8)*6)+(var(--gb-spacing-1)*5)+(var(--gb-spacing-1)*2))",
} as React.CSSProperties;
const LIST_MAX_HEIGHT_CLASS = "max-h-[var(--gb-select-list-height)]";
const SCROLLBAR_TRACK_HEIGHT_CLASS = "h-[var(--gb-select-list-height)]";

export interface DropdownListProps {
  /** 표시할 옵션 목록 */
  options: DropdownListOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 키보드/마우스로 강조된 옵션의 인덱스 */
  highlightedIndex: number;
  /** 강조 인덱스가 바뀔 때(마우스 hover) 호출됩니다 */
  onHighlightChange: (index: number) => void;
  /** 옵션을 선택(클릭/Enter)했을 때 호출됩니다 */
  onCommit: (option: DropdownListOption) => void;
  /** 트리거의 `aria-controls`와 연결되는 `<ul>` id */
  listboxId: string;
  /** 옵션별 `id` 생성 함수 (`aria-activedescendant` 연결용) */
  getOptionId: (value: string) => string;
}

/**
 * `Select`의 드롭다운 패널 콘텐츠 — 옵션 리스트 + 커스텀 스크롤바 +
 * "Show more" 버튼. `Select`가 이 컴포넌트를 import해서 트리거 아래
 * `PopoverPrimitive.Content`(Figma `Select` 컴포넌트셋의 빈 `Dropdown`
 * slot에 대응) 안에 끼워 넣는 조합 구조다 — Chatbox와 ChatboxComposer의
 * 관계와 동일하다.
 */
export function DropdownList({
  options,
  value,
  highlightedIndex,
  onHighlightChange,
  onCommit,
  listboxId,
  getOptionId,
}: DropdownListProps) {
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });
  const listRef = React.useRef<HTMLUListElement>(null);
  const isScrollable = options.length > 6;
  const hasCodeColumn = options.some((option) => option.code);
  const hasLeadingIcon = options.some((option) => option.icon);

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

  return (
    <>
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
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            LIST_MAX_HEIGHT_CLASS,
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = highlightedIndex === index;
            const isOptionDisabled = Boolean(option.disabled);

            return (
              <li
                key={option.value}
                id={getOptionId(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isOptionDisabled || undefined}
                onMouseEnter={() => {
                  if (!isOptionDisabled) onHighlightChange(index);
                }}
                onClick={() => onCommit(option)}
                className={cn(
                  "flex w-full shrink-0 items-center",
                  "gap-[var(--gb-spacing-1)]",
                  "h-[var(--gb-spacing-8)] px-[var(--gb-spacing-2)]",
                  "rounded-[var(--gb-radius-scale-sm)]",
                  "text-sm-regular",
                  isOptionDisabled
                    ? "cursor-not-allowed text-[var(--gb-text-static-gray)]"
                    : cn(
                        "cursor-pointer",
                        isSelected || isHighlighted
                          ? "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]"
                          : cn(
                              "text-[var(--gb-text-default)]",
                              "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
                            ),
                      ),
                )}
              >
                {hasLeadingIcon ? (
                  option.icon ? (
                    <option.icon
                      aria-hidden="true"
                      className="size-[var(--gb-spacing-4)] shrink-0"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="size-[var(--gb-spacing-4)] shrink-0"
                    />
                  )
                ) : null}
                {hasCodeColumn ? (
                  <>
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
    </>
  );
}
