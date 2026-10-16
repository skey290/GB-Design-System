"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import styles from "./dropdown-list.module.css";

export interface DropdownListOption {
  value: string;
  label: string;
  /** Short code shown instead of the label on the trigger (e.g. country code "+82") */
  code?: string;
  /** Icon shown to the left of the list item (Figma `Part/dropdown slot` leadingIcon) */
  icon?: LucideIcon;
  /** Only this option is unselectable (Figma `Part/dropdown slot` status=disabled) */
  disabled?: boolean;
}

// Fixed to 6 rows of height (see docs/components/dropdown-list.md — calc() spacing required)
const LIST_VISIBLE_HEIGHT =
  "calc((var(--gb-spacing-8) * 6) + (var(--gb-spacing-1) * 5) + (var(--gb-spacing-1) * 2))";

export interface DropdownListProps {
  /** List of options to display */
  options: DropdownListOption[];
  /** Currently selected value */
  value?: string;
  /** Index of the option highlighted by keyboard/mouse */
  highlightedIndex: number;
  /** Called when the highlighted index changes (mouse hover) */
  onHighlightChange: (index: number) => void;
  /** Called when an option is committed (click/Enter) */
  onCommit: (option: DropdownListOption) => void;
  /** `<ul>` id linked to the trigger's `aria-controls` */
  listboxId: string;
  /** Per-option `id` generator (for `aria-activedescendant` linkage) */
  getOptionId: (value: string) => string;
}

/** Dropdown panel content for `Select` (see docs/components/dropdown-list.md) */
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

  // Recalculate thumb size when options change (see docs/components/dropdown-list.md)
  React.useLayoutEffect(() => {
    updateThumb();
  }, [options, updateThumb]);

  return (
    <div className={styles.root}>
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
        style={{ maxHeight: LIST_VISIBLE_HEIGHT }}
        className={styles.list}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isHighlighted = highlightedIndex === index;
          const isOptionDisabled = Boolean(option.disabled);
          const isActive = !isOptionDisabled && (isSelected || isHighlighted);
          const LeadingIcon = option.icon;
          const leadingIconKind = !hasLeadingIcon
            ? "none"
            : LeadingIcon
              ? "custom"
              : "placeholder";

          return (
            <li
              key={option.value}
              id={getOptionId(option.value)}
              role="option"
              aria-selected={isSelected}
              aria-disabled={isOptionDisabled || undefined}
              data-disabled={isOptionDisabled || undefined}
              data-active={isActive || undefined}
              onMouseEnter={() => {
                if (!isOptionDisabled) onHighlightChange(index);
              }}
              onClick={() => onCommit(option)}
              className={styles.option}
            >
              {leadingIconKind === "custom" && LeadingIcon && (
                <LeadingIcon aria-hidden="true" className={styles.icon} />
              )}
              {leadingIconKind === "placeholder" && (
                <span aria-hidden="true" className={styles.icon} />
              )}
              {hasCodeColumn ? (
                <>
                  <span className={styles.code}>{option.code}</span>
                  <span className={styles.label}>{option.label}</span>
                </>
              ) : (
                <span className={styles.label}>{option.label}</span>
              )}
            </li>
          );
        })}
      </ul>
      {isScrollable && (
        <div aria-hidden="true" className={styles.scrollTrack}>
          <div
            style={{ height: LIST_VISIBLE_HEIGHT }}
            className={styles.scrollbarTrack}
          >
            <div
              className={styles.scrollbarThumb}
              style={{ top: `${thumb.top}%`, height: `${thumb.height}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
