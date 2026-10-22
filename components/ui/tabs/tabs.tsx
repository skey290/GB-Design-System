import * as React from "react";

import { Badge } from "@/components/ui/badge";

import styles from "./tabs.module.css";

export interface TabItem {
  /** Label text to show on the tab */
  label: string;
  /** Count to show next to the label. No badge is rendered if omitted */
  count?: number;
  /** Whether the tab is disabled. If true, it can't be clicked and no badge is rendered even with a count (Figma "disabled" state) */
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** List of tabs */
  items: TabItem[];
  /** Index of the currently selected tab */
  selectedIndex: number;
  /** Called when the selected tab changes */
  onSelectedIndexChange?: (index: number) => void;
}

/** Next enabled tab index, cycling from `from` in `delta` steps. Falls back to `from` if every tab is disabled. */
function nextEnabledIndex(
  items: TabItem[],
  from: number,
  delta: 1 | -1,
): number {
  let next = from;
  for (let i = 0; i < items.length; i++) {
    next = (next + delta + items.length) % items.length;
    if (!items[next]?.disabled) return next;
  }
  return from;
}

export function Tabs({
  items,
  selectedIndex,
  onSelectedIndexChange,
  className,
  ...props
}: TabsProps) {
  const instanceId = React.useId();

  const focusAndSelect = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onSelectedIndexChange?.(index);
    document.getElementById(`${instanceId}-${index}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (items.length === 0) return;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusAndSelect(nextEnabledIndex(items, selectedIndex, 1));
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusAndSelect(nextEnabledIndex(items, selectedIndex, -1));
        break;
      case "Home":
        event.preventDefault();
        focusAndSelect(nextEnabledIndex(items, -1, 1));
        break;
      case "End":
        event.preventDefault();
        focusAndSelect(nextEnabledIndex(items, 0, -1));
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="tablist"
      onKeyDown={handleKeyDown}
      className={className ? `${styles.list} ${className}` : styles.list}
      {...props}
    >
      {items.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <button
            key={`${item.label}-${index}`}
            id={`${instanceId}-${index}`}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            data-selected={selected}
            onClick={() => onSelectedIndexChange?.(index)}
            className={styles.tab}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" && !item.disabled ? (
              <Badge variant={selected ? "default" : "outline"}>
                {item.count}
              </Badge>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
