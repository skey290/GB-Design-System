"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { createSpriteIcon } from "@/lib/sprite-icon";

const ChevronLeft = createSpriteIcon("chevron-left-icon");
const ChevronRight = createSpriteIcon("chevron-right-icon");

export interface PersonaActionMenuAction {
  label: string;
  onSelect: () => void;
  /** 16px 아이콘 슬롯 */
  icon?: React.ReactNode;
}

export interface PersonaActionMenuProps {
  /**
   * Figma `Style` variant(Type=self menu) 2종.
   * - `self-right`: 트리거가 [라벨 → chevron-right] 순서, 팝오버가 트리거 오른쪽에서 열림
   * - `self-left`: 트리거가 [chevron-left → 라벨] 순서(라벨 우측 정렬), 팝오버가 트리거 왼쪽에서 열림(미러)
   */
  style: "self-right" | "self-left";
  /** 트리거에 표시할 페르소나 이름 등 라벨 */
  label: string;
  actions: PersonaActionMenuAction[];
  className?: string;
}

// Figma 확정값(node 5314:6906/5314:9671): 트리거 폭(115px)과 무관하게 드롭다운은 항상 210px —
// 토큰 스케일에 없는 값이라 Select와 동일하게 예외적으로 하드코딩
const DROPDOWN_WIDTH_CLASS = "w-[210px]";

export function PersonaActionMenu({
  style,
  label,
  actions,
  className,
}: PersonaActionMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const isSelfRight = style === "self-right";

  const listboxId = React.useId();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setHighlightedIndex(0);
  };

  const commitSelection = (action: PersonaActionMenuAction) => {
    action.onSelect();
    setOpen(false);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      handleOpenChange(true);
    }
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, actions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const action = actions[highlightedIndex];
      if (action) commitSelection(action);
    }
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "inline-flex h-[var(--spacing-6)] w-fit shrink-0 items-center",
            "gap-[var(--spacing-0-5)] px-[var(--spacing-2)]",
            "rounded-[var(--radius-scale-md)] outline-none transition-colors",
            "text-xs-medium text-[var(--text-default)]",
            // Figma 확정값: hover는 배경 변화 없이 텍스트/아이콘만 dim되고 포커스링 쉐도우가 붙음.
            // 팝오버가 열린 동안(open)에는 텍스트가 다시 기본색으로 돌아오되 쉐도우는 유지됨.
            "hover:text-[var(--text-static-gray)] hover:shadow-[var(--shadow-focus-ring)]",
            "data-[state=open]:text-[var(--text-default)] data-[state=open]:shadow-[var(--shadow-focus-ring)]",
            isSelfRight ? "justify-start" : "justify-end",
            className,
          )}
        >
          {isSelfRight ? (
            <>
              <span className="min-w-0 flex-1 truncate text-left">{label}</span>
              {open ? (
                <ChevronLeft
                  aria-hidden="true"
                  className="size-[var(--spacing-4)] shrink-0"
                />
              ) : (
                <ChevronRight
                  aria-hidden="true"
                  className="size-[var(--spacing-4)] shrink-0"
                />
              )}
            </>
          ) : (
            <>
              {open ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-[var(--spacing-4)] shrink-0"
                />
              ) : (
                <ChevronLeft
                  aria-hidden="true"
                  className="size-[var(--spacing-4)] shrink-0"
                />
              )}
              <span className="min-w-0 flex-1 truncate text-right">
                {label}
              </span>
            </>
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={isSelfRight ? "right" : "left"}
          align="start"
          sideOffset={4}
          onKeyDown={handleContentKeyDown}
          className={cn(
            "z-50 overflow-hidden",
            "rounded-[var(--radius-scale-md)]",
            "border-[length:var(--border-1)] border-[var(--border-default)] border-solid",
            "bg-[var(--background-surface)] text-[var(--text-default)]",
            // Figma의 그림자값(0 4px 3px + 0 2px 2px, rgba(0,0,0,0.1))과 정확히 일치하는 토큰이 없어 --shadow-lg로 근사(Select와 동일 근거)
            "shadow-[var(--shadow-lg)]",
            DROPDOWN_WIDTH_CLASS,
          )}
        >
          <ul
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            className="flex flex-col items-start gap-[var(--spacing-1)] p-[var(--spacing-1)]"
          >
            {actions.map((action, index) => {
              const isHighlighted = highlightedIndex === index;

              return (
                <li
                  key={action.label}
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => commitSelection(action)}
                  className={cn(
                    "flex w-full shrink-0 cursor-pointer items-center",
                    "gap-[var(--spacing-2)]",
                    "h-[var(--spacing-8)] px-[var(--spacing-2)]",
                    "rounded-[var(--radius-scale-sm)]",
                    "text-sm-regular",
                    isHighlighted
                      ? "bg-[var(--background-static-gray)] text-[var(--text-static-white)]"
                      : cn(
                          "text-[var(--text-default)]",
                          "hover:bg-[var(--background-static-gray)] hover:text-[var(--text-static-white)]",
                        ),
                  )}
                >
                  {action.icon && (
                    <span aria-hidden="true" className="shrink-0">
                      {action.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {action.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
